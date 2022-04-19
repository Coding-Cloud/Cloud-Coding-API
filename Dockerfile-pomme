FROM node:16-alpine as node-builder
WORKDIR /app
COPY --chown=node:node . .
RUN npm install \
    && npm run build \
    && npm prune --production

FROM node:16-alpine
USER node
WORKDIR /app
COPY --from=node-builder --chown=node:node /app/package*.json ./
COPY --from=node-builder --chown=node:node /app/node_modules/ ./node_modules/
COPY --from=node-builder --chown=node:node /app/dist/ ./dist/

ENV \
 DATABASE_TYPE=postgres \
 DATABASE_HOST=127.0.0.1 \
 DATABASE_PORT=5432 \
 DATABASE_NAME=dbname \
 DATABASE_USER=user \
 DATABASE_PASSWORD=password \
 DATABASE_SYNC=false \
 JWT_SECRET=mysecret

# DB TYPE / NAME / SYNC unused yet

CMD ["node", "dist/main.js"]
