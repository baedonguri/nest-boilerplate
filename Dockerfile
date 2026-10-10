# syntax=docker/dockerfile:1
# one image, two uses: `node dist/main.js` serves the API, the same image runs migrations as a one-off before rollout

FROM node:24.19.0-slim AS base
ENV PNPM_HOME=/pnpm PATH=/pnpm:$PATH
RUN npm install --global pnpm@10.34.5
WORKDIR /app
COPY package.json pnpm-lock.yaml ./

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM node:24.19.0-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --chown=node:node package.json ./
COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
USER node
EXPOSE 3000
CMD ["node", "dist/main.js"]
