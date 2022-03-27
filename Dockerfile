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
  DATABASE_HOST=127.0.0.1 \
  DATABASE_PORT=5432 \
  DATABASE_USER=postgres \
  DATABASE_PASSWORD=postgres \
  DATABASE_NAME=postgres \
  JWT_SECRET=mysecret \
  SMTP_APIKEY_PUBLIC=publickey \
  SMTP_APIKEY_PRIVATE=privatekey \
  MAIL_SENDER=example@mail.com \
  MAIL_SENDER_NAME=CloudCoding \
  MAIL_RECEIVER=example@mail.com \
  FRONT_URL=http://localhost \
  FRONT_PORT=4200 \
  HELM_BRIDGE_URL=http://helm-bridge.default.svc.cluster.local:5000
# DB TYPE / NAME / SYNC unused yet

CMD ["node", "dist/main.js"]
