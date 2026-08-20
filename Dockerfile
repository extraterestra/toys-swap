FROM node:22-alpine

WORKDIR /app

COPY backend/package.json backend/package-lock.json ./backend/
RUN cd backend && npm ci --omit=dev

COPY backend ./backend
COPY frontend ./frontend

RUN mkdir -p /app/backend/uploads

WORKDIR /app/backend

ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000

CMD ["node", "server.js"]
