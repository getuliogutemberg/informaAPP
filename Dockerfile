# Construção do Frontend
FROM node:18 AS build-frontend
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install
COPY frontend ./
RUN npm run build

# Construção do Backend
FROM node:18 AS build-backend
WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json ./
RUN npm install
COPY backend ./
RUN npm run build

# Container final para rodar a aplicação
FROM node:18
WORKDIR /app

# Copia o backend para o container final
COPY --from=build-backend /app/backend ./backend

# Copia o frontend buildado para o backend (se for um servidor tipo Express servindo o frontend)
COPY --from=build-frontend /app/frontend/dist ./backend/public

# Instala dependências do backend
WORKDIR /app/backend
RUN npm install --only=production

# Porta do backend
EXPOSE 3000
CMD ["node", "server.js"]