# 1. Base Image
FROM node:20-alpine AS builder
WORKDIR /app

# 2. Install dependencies
COPY package*.json ./
RUN npm ci

# 3. Copy source code and build
COPY . .
RUN npm run build

# 4. Production image
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]