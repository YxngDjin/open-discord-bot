# ============================================================
#  Stage 1: build
#  Installs all packages (incl. TypeScript etc.) and builds the bot.
# ============================================================
FROM node:22-alpine AS build

WORKDIR /app

# prisma generate (runs after npm ci via postinstall) only reads the URL,
# it never connects. ARG exists only while building, not in the image.
ARG DATABASE_URL=postgresql://build:build@localhost:5432/build

# Package files first: as long as they don't change, Docker reuses the
# cached npm ci below, even when the source code changes.
COPY package.json package-lock.json ./
COPY prisma7.config.ts ./
COPY prisma ./prisma
RUN npm ci

# Then the source code, and build it into dist/
COPY . .
RUN npm run build

# ============================================================
#  Stage 2: run
#  Starts empty and only gets what the bot needs at runtime.
# ============================================================
FROM node:22-alpine

WORKDIR /app
ENV NODE_ENV=production
ARG DATABASE_URL=postgresql://build:build@localhost:5432/build

# Only runtime packages, without devDependencies
COPY package.json package-lock.json ./
COPY prisma7.config.ts ./
COPY prisma ./prisma
RUN npm ci --omit=dev && npm cache clean --force

# The built bot from stage 1
COPY --from=build /app/dist ./dist

# Don't run as root
USER node

# Apply new database migrations, then start the bot.
# "exec" makes node the main process, so it receives the stop signal
# from Docker and can shut down cleanly.
CMD ["sh", "-c", "npx prisma migrate deploy && exec node dist/main.js"]
