FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Final image
FROM node:18-alpine
WORKDIR /app
COPY --from=build /app .
EXPOSE 3000
CMD ["node", "server.js"]
