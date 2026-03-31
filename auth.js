import { compare } from 'bcryptjs';
import NextAuth, { AuthError, CredentialsSignin } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { authConfig } from './auth.config';
import { User } from './models/user.model';
import { dbConnect } from './service/mongo';

async function refreshAccessToken(token) {
  if (!token?.refreshToken) return null;
  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken,
      }),
    });

    const tokens = await response.json();
    if (!response.ok) throw tokens;

    return {
      ...token,
      accessToken: tokens.access_token,
      accessTokenExpires: Date.now() + tokens.expires_in * 1000,
      refreshToken: tokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error('Error refreshing access token:', error);
    console.error(error.message);

    return { ...token, error: 'RefreshAccessTokenError' };
  }
}

export class InvalidCredentialsError extends CredentialsSignin {
  constructor(message = 'Email or password is invalid.') {
    super(message);
    this.code = 'invalid_credentials';
    this.message = message;
  }
}

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials) return null;

        try {
          await dbConnect();
          const user = await User.findOne({ email: credentials.email })

            .select('+password')
            .lean();
          if (!user) {
            throw new InvalidCredentialsError();
          }

          const isPasswordMatched = await compare(credentials.password, user.password);

          if (!isPasswordMatched) throw new InvalidCredentialsError();

          return { ...user, _id: user._id.toString() };
        } catch (err) {
          console.error('Error in auth authorize function:', err);

          if (err instanceof InvalidCredentialsError) {
            throw err;
          }

          throw new AuthError('InternalServerError');
        }
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,

    async jwt({ token, user, account }) {
      if (user && account) {
        if (account.provider === 'google') {
          try {
            await dbConnect();
            let dbUser = await User.findOne({ email: user.email }).lean();

            if (!dbUser) {
              const nameParts = user.name ? user.name.split(' ') : ['Student'];
              const firstName = nameParts[0];
              const lastName = nameParts.slice(1).join(' ') || ' ';

              dbUser = await User.create({
                email: user.email,
                firstName: firstName,
                lastName: lastName,
                profilePicture: user.image,
                role: 'student',
              });
            }

            return {
              ...token,
              id: dbUser._id.toString(),
              role: dbUser.role ?? 'student',
              provider: account.provider,
              accessToken: account?.access_token,
              accessTokenExpires: Date.now() + (account?.expires_in ?? 3600) * 1000,
              refreshToken: account?.refresh_token,
            };
          } catch (err) {
            console.error('Error handling Google user in jwt callback:', err);
          }
        }

        return {
          ...token,
          id: user._id?.toString() ?? user.id,
          role: user?.role ?? 'student',
          provider: account.provider,
          accessToken: account?.access_token,
          accessTokenExpires: Date.now() + (account?.expires_in ?? 3600) * 1000,
          refreshToken: account?.refresh_token,
        };
      }

      if (token?.provider !== 'google') return token;
      if (Date.now() < token?.accessTokenExpires) return token;
      return refreshAccessToken(token);
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.accessToken = token.accessToken;
        session.error = token.error;
      }
      return session;
    },
  },
});
