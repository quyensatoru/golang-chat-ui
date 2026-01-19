# =========================
# Build stage
# =========================
FROM node:18-alpine AS builder

WORKDIR /app

# Copy dependency files trước để cache
COPY package*.json ./
RUN npm ci

# Copy source & build
COPY . .

RUN npm run build


# =========================
# Runtime stage
# =========================
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/build /usr/share/nginx/html

# Nginx config cho SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh
# Copy nginx config if needed, but use default

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
