FROM --platform=linux/amd64 node:22-bookworm-slim

RUN DEBIAN_FRONTEND=noninteractive apt update -y \
    && DEBIAN_FRONTEND=noninteractive apt install -y npm git curl
RUN npx -y n 22.11.0 \
    && npm install -g npm@11.0.0
RUN curl -L -o migrate.linux-amd64.tar.gz https://github.com/golang-migrate/migrate/releases/download/v4.18.1/migrate.linux-amd64.tar.gz \
    && tar -zxvf migrate.linux-amd64.tar.gz migrate \
    && mv migrate /usr/local/bin/migrate \
    && rm migrate.linux-amd64.tar.gz
RUN npm i -g @nestjs/cli@10.4.9
WORKDIR /workspace
