# Multi-stage production image for SKYCOIN4444
FROM node:22-alpine AS builder

WORKDIR /app

# Match the packageManager declared in package.json.
RUN npm install -g pnpm@10.4.1

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM node:22-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

RUN apk add --no-cache dumb-init

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/drizzle ./drizzle

RUN addgroup -g 1001 -S nodejs \
  && adduser -S nodejs -u 1001 -G nodejs \
  && chown -R nodejs:nodejs /app

USER nodejs

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "const http=require('http');const req=http.get('http://127.0.0.1:3000/healthz',r=>process.exit(r.statusCode===200?0:1));req.on('error',()=>process.exit(1));req.setTimeout(8000,()=>{req.destroy();process.exit(1)})"

ENTRYPOINT ["/sbin/dumb-init", "--"]
CMD ["node", "dist/index.js"]

EXPOSE 3000
