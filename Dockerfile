FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN apt-get update -y && apt-get install -y openssl
COPY package.json pnpm-lock.yaml /app/
WORKDIR /app


FROM base AS prod-deps
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm prisma generate
RUN pnpm run build

FROM base AS prod
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist
COPY --from=build /app/node_modules/.pnpm /app/node_modules/.pnpm
COPY --from=build /app/prisma /app/prisma


ENV NODE_ENV=production
EXPOSE 3333
CMD [ "pnpm", "start:migrate" ]