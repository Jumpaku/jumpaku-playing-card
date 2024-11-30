FROM node:22-bookworm-slim

RUN DEBIAN_FRONTEND=noninteractive apt update -y \
    && DEBIAN_FRONTEND=noninteractive apt install -y npm git curl
RUN npx -y n 22.11.0 \
    && npm install -g npm@10.9.0

WORKDIR /workspace
