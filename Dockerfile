FROM node:16-alpine as node-builder
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

ENV \
  DATABASE_HOST=cc-database.default.svc.cluster.local \
  DATABASE_PORT=5432 \
  DATABASE_USER=postgres \
  DATABASE_PASSWORD=postgres \
  DATABASE_NAME=postgres \
  JWT_SECRET=B[T@6-M2ux^u),<7D9hsu99x.2-}bX_2bUXgnW?#5YT*cn$d{HjvBW^#Jfs]e \
  SMTP_APIKEY_PUBLIC=f9f246ddb2c06d89813365e1cdb1d565 \
  SMTP_APIKEY_PRIVATE=07a7d42ac56b10437f0ba7dd78619df2 \
  MAIL_SENDER=remymachavoine@gmail.com \
  MAIL_SENDER_NAME=CloudCoding \
  MAIL_RECEIVER=rmachavoine@myges.fr \
  FRONT_URL=http://localhost/ \
  FRONT_PORT=4200 \
  HELM_BRIDGE_URL=http://helm-bridge.default.svc.cluster.local:5000/ \
  BASE_PATH_PROJECT=/data \
  LOG_PATH_PROJECT=/data

# DB TYPE / NAME / SYNC unused yet

CMD ["node", "dist/main.js"]
