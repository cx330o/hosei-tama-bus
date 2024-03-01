FROM node:20-bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init && apt-get clean && rm -rf /var/lib/apt/lists/*
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY --chown=node:node package*.json ./
RUN npm ci
COPY --chown=node:node . .
USER node
EXPOSE 9003
CMD ["dumb-init", "npm", "start"]
