# ---- build stage ----
FROM node:20-alpine AS builder
WORKDIR /app

# Install deps (cache efficiently)
COPY package*.json ./
RUN npm ci

# Copy source & build
COPY . .
RUN npm run build   # produces /app/dist

# ---- serve stage ----
FROM nginx:alpine
# SPA-friendly config
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Static files
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
