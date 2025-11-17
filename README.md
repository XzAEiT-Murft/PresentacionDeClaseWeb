# 🎬 Peli+ (Proyecto de Páginas Web)

> Proyecto universitario para la clase de Páginas Web. El objetivo es construir una aplicación web tipo "Cuevana" para gestionar un catálogo de películas, demostrando el uso de **Promises en JavaScript** para operaciones asíncronas.



---

## 🚀 Tecnologías Utilizadas

Este proyecto está construido con una arquitectura moderna separando el cliente del servidor.

* **Frontend (Cliente):**
    * HTML5
    * CSS3 (con **Bootstrap 5**)
    * JavaScript (Vanilla) con `fetch` y Promises
* **Backend (Servidor):**
    * Node.js
    * Express.js (para la API REST)
* **Base de Datos:**
    * MongoDB
    * Mongoose (para modelar los datos)
* **Entorno de Desarrollo:**
    * Docker
    * Docker Compose

---

## 📂 Estructura del Proyecto

El proyecto está organizado en dos componentes principales:

* `./frontend/`: Contiene todo el código del cliente. Es un sitio estático (HTML, CSS, JS) que consume la API del backend.
* `./backend/`: Contiene la API REST construida con Node.js. Es responsable de toda la lógica de negocio (CRUD) y la comunicación con la base de datos.

---

## 🏁 Cómo Empezar (Desarrollo Local)

Este proyecto está 100% contenedorizado con Docker para asegurar un entorno de desarrollo consistente y evitar el "en mi máquina funciona".

**Requisitos Previos:**
* Tener [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y en ejecución.

**Pasos para levantar el proyecto:**

1.  Clona este repositorio:
    ```bash
    git clone [https://github.com/XzAEiT-Murft/PresentacionDeClaseWeb.git]
    ```
2.  Navega a la carpeta del proyecto:
    ```bash
    cd PresentacionDeClaseWeb
    ```
3.  Asegúrate de que Docker Desktop esté corriendo.
4.  Levanta todos los servicios (API + Base de Datos) con un solo comando:
    ```bash
    docker-compose up --build
    ```

¡Y listo!
* Tu **API de Peli+** estará corriendo en `http://localhost:3000`.
* Tu **Base de Datos MongoDB** estará disponible en `localhost:27017`.

**Nota**
> Devido a la actividad asignada por el maestro esta web estara hosteada en algun 
servicio en la nuve pero el repo fue creado con fines de provar la web y sus servicios 
de forma local antes de ser hosteada

---

## 👥 Equipo

* **Luis Garcia Cruz**
* **Manuel Alejandro Jimenez Rodriguez**