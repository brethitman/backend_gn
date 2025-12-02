# ==========================
# 1. Imagen base oficial de Node
# ==========================
FROM node:18-alpine

# ==========================
# 2. Crear carpeta de trabajo
# ==========================
WORKDIR /app

# ==========================
# 3. Copiar solo package.json y package-lock.json
# ==========================
COPY package*.json ./

# ==========================
# 4. Instalar dependencias
# ==========================
RUN npm install

# ==========================
# 5. Copiar todo el proyecto
# ==========================
COPY . .

# ==========================
# 6. Compilar TypeScript
# ==========================
RUN npm run build

# ==========================
# 7. Exponer puerto del servidor
# ==========================
EXPOSE 3000

# ==========================
# 8. Ejecutar el servidor
# ==========================
CMD ["node", "dist/index.js"]
