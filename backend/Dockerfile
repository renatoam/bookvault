# 🟢 Base stage: all stages will inherit from this
# We're using Alpine to keep the image lightweight and secure
FROM node:20-alpine AS base

# ────────────────────────────────
# 🟣 Deps stage: Install production dependencies ONLY
# This stage is not used for builds, just to isolate prod deps
# This helps us avoid copying dev dependencies into the final image
FROM base AS deps
# apk: Alpine's package manager
# libc6-compat: provides glibc compatibility for some npm modules that rely on glibc instead of musl (which Alpine uses)
# Why --no-cache? Prevents caching the package index, keeping image small and clean
RUN apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app

# Copy only dependency-related files to leverage caching
COPY package.json package-lock.json ./

# `npm ci` is faster and reproducible — installs exactly what's in package-lock.json
# `--only=production` ensures we only install runtime deps, not dev tools
RUN npm ci --only=production && npm cache clean --force

# ────────────────────────────────
# 🟠 Dev stage: used only for local development
# Includes full deps and source code for hot-reloading, debugging, etc.
FROM base AS dev
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

# This is optional but helpful when running locally (makes the container port visible)
EXPOSE 4000

# CMD is used to define the default command when the container is run
CMD ["npm", "run", "dev"]

# ────────────────────────────────
# 🔵 Builder stage: compiles and prepares app for production
# Installs all deps (incl. build tools), runs code generation and build
FROM base AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

# Run Prisma client generation if needed (e.g., if you're using it in your app)
RUN npm run generate

# Build your TypeScript or other static code
RUN npm run build

# ────────────────────────────────
# 🟢 Final production image: smallest, safest version
FROM base AS runner
WORKDIR /app

# 🔐 Create a non-root user for improved container security
# Even though containers are isolated, using root can still lead to privilege escalation if exploited
# --system is used to create a system user and group
# --gid is used to set the group ID
# --uid is used to set the user ID
# bookappgroup is the group name
# bookappuser is the user name
# The value 1001 is the group ID and user ID, defined by the user running the container, it is a best practice to use a high number but not too high to avoid conflicts with other users and could be any number
RUN addgroup --system --gid 1001 bookappgroup && \
    adduser --system --uid 1001 bookappuser

# Copy built application from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# Copy only production dependencies from deps (not builder!)
COPY --from=deps /app/node_modules ./node_modules

# Give ownership of app folder to non-root user
RUN chown -R bookappuser:bookappgroup /app

# Switch to non-root user
USER bookappuser

# Expose app port for deployments
EXPOSE 4000

# 🩺 Add health check (optional but highly recommended in prod)
# This runs every 30s, with a 3s timeout, giving the app 5s to start.
# It checks if the `/health` endpoint responds with 200. If not, container is considered unhealthy.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# CMD = container's default command (when you `docker run`)
# At runtime, runs the production server
CMD ["npm", "run", "start"]
