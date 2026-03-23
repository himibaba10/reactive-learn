export const authConfig = {
  session: {
    strategy: 'jwt',
  },
  providers: [],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user && account) {
        return {
          ...token,
          id: user._id?.toString() ?? user.id,
          role: user?.role ?? 'student',
          provider: account.provider,
        };
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
};
