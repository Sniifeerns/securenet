FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

ENV NODE_ENV=production
EXPOSE 3001

# Ajusta si tu entrypoint es distinto:
CMD ["node", "server/metrics-server.cjs"]