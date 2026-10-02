# 1. Base Image (Using Debian-based Node 20 to avoid Prisma musl/OpenSSL binary mismatch issues)
FROM node:20 AS builder
WORKDIR /app

# 2. Install dependencies
COPY package*.json ./
RUN npm ci

# 3. Copy source code, generate prisma, and build
COPY . .
RUN npx prisma generate
RUN npm run build

# 4. Production image
FROM node:20 AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]