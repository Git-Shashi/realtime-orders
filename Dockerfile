FROM node:20-alpine AS frontend-builder
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --production
COPY backend/src/ ./src/
COPY backend/sql/ ./sql/
COPY --from=frontend-builder /frontend/dist /frontend/dist
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "src/index.js"]
