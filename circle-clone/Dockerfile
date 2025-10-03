# Stage 1: Build client
FROM node:18 AS builder
WORKDIR /app
COPY client ./client
WORKDIR /app/client
RUN npm install && npm run build

# Stage 2: Setup server
FROM node:18
WORKDIR /app
COPY package.json ./
RUN npm install
COPY server ./server
COPY --from=builder /app/client/dist ./client/dist

ENV PORT=3000
EXPOSE 3000
CMD ["node", "server/index.js"]
