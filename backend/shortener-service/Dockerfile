FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

FROM base AS production
COPY src ./src
ENV NODE_ENV=production
USER node
EXPOSE 3001
CMD ["node", "--experimental-vm-modules", "src/app.js"]