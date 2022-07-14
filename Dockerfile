FROM amd64/node:16-alpine as node-builder
WORKDIR /app
COPY --chown=node:node . .
RUN apk --no-cache --virtual build-dependencies add python3 make
RUN yarn install
RUN npm run build

FROM amd64/node:16-alpine
USER node
WORKDIR /app
COPY --from=node-builder --chown=node:node /app/package*.json ./
COPY --from=node-builder --chown=node:node /app/node_modules/ ./node_modules/
COPY --from=node-builder --chown=node:node /app/dist/ ./dist/

EXPOSE 3000

ENV \
  AMQP_HOST=localhost \
  AMQP_PASSWORD=guest \
  AMQP_PORT=5672 \
  AMQP_USER=guest \
  BASE_PATH_PROJECT=/data \
  CODE_RUNNER_DNS_SUFFIX=http://localhost:8000 \
  DATABASE_HOST=127.0.0.1 \
  DATABASE_NAME=postgres \
  DATABASE_PASSWORD=postgres \
  DATABASE_PORT=5432 \
  DATABASE_USER=postgres \
  FRONT_PORT=4200 \
  FRONT_URL=http://localhost \
  HELM_BRIDGE_URL=http://helm-bridge.default.svc.cluster.local:5000 \
  JWT_SECRET=mysecret \
  LOG_PATH_PROJECT=/data \
  MAIL_RECEIVER=example@mail.com \
  MAIL_SENDER=example@mail.com \
  MAIL_SENDER_NAME=CloudCoding \
  SERVER_PORT=3000 \
  SMTP_APIKEY_PRIVATE=privatekey \
  SMTP_APIKEY_PUBLIC=publickey \
  VERIF_REPO_PROJECT=false


CMD ["node", "dist/main.js"]
