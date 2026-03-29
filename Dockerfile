FROM node:20-alpine AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /reactive-learn

COPY package.json package-lock.json* ./
RUN npm install --frozen-lockfile

FROM node:20-alpine AS builder

WORKDIR /reactive-learn

COPY --from=deps /reactive-learn/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_BASE_URL
ARG MONGODB_CONNECTION_STRING
ARG AUTH_SECRET
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ARG STRIPE_SECRET_KEY
ARG RESEND_API_KEY
ARG NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
ARG CLOUDINARY_API_KEY
ARG CLOUDINARY_API_SECRET

ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV MONGODB_CONNECTION_STRING=$MONGODB_CONNECTION_STRING
ENV AUTH_SECRET=$AUTH_SECRET
ENV GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
ENV GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ENV STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY
ENV RESEND_API_KEY=$RESEND_API_KEY
ENV NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=$NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
ENV CLOUDINARY_API_KEY=$CLOUDINARY_API_KEY
ENV CLOUDINARY_API_SECRET=$CLOUDINARY_API_SECRET

RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /reactive-learn

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /reactive-learn/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /reactive-learn/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /reactive-learn/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]