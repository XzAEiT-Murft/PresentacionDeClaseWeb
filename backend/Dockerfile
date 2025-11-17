# 1. Imagen base: Le decimos que use la versión de Node que pediste.
# 'alpine' es una versión muy ligera, lo cual es bueno.
FROM node:24-alpine

# 2. Directorio de trabajo: Crea una carpeta DENTRO del contenedor
# donde vivirá nuestro código.
WORKDIR /usr/src/app

# 3. Copiar dependencias: Copia solo el package.json y package-lock.json
# (Esto es un truco de caché: si no cambian, Docker no reinstala todo)
COPY package*.json ./

# 4. Instalar dependencias: Ejecuta npm install DENTRO del contenedor
RUN npm install

# 5. Copiar tu código: Copia el resto de los archivos del backend
COPY . .

# 6. Exponer el puerto: Abre el puerto 3000 del contenedor
# (para que podamos acceder a él desde nuestra laptop)
EXPOSE 3000

# 7. Comando de inicio: El comando que se ejecuta cuando el contenedor arranca
CMD [ "node", "server.js" ]