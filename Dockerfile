# Imagen base
FROM node:20-alpine

# Crear directorio app
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar TODO el código (incluye src y tsconfig.json)
COPY . .

# Compilar TypeScript
RUN npm run build

# Exponer puerto
EXPOSE 3000

# Ejecutar el servidor compilado
CMD ["node", "dist/index.js"]
