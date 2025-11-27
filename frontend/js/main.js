// frontend/js/main.js

// 1. Evento principal: Se ejecuta cuando todo el HTML ha cargado
document.addEventListener('DOMContentLoaded', () => {
  
  // A. VERIFICACIÓN DE USUARIO
  // Lo primero es revisar si hay alguien logueado para ajustar el menú
  checkAuthStatus();

  // B. LÓGICA DE PELÍCULAS
  const carouselContainer = document.getElementById('carousel-inner-container');
  const catalogRowsContainer = document.getElementById('catalog-rows');

  // Llama a la API para obtener todas las películas
  if (typeof getMovies === 'function') { // Pequeña seguridad por si apiService no cargó
    getMovies()
      .then(movies => {
        if (movies.length === 0) {
          if(catalogRowsContainer) catalogRowsContainer.innerHTML = '<p class="text-light">No hay películas en el catálogo.</p>';
          return;
        }
        
        // 1. Llenar el Carrusel (Usamos las 3 más nuevas)
        const sortedMovies = [...movies].sort((a, b) => b.year - a.year);
        if(carouselContainer) populateCarousel(sortedMovies.slice(0, 3));
        
        // 2. Llenar la Cuadrícula Principal
        if(catalogRowsContainer) populateMainGrid(sortedMovies);
      })
      .catch(error => {
        console.error('Error:', error);
        if(catalogRowsContainer) catalogRowsContainer.innerHTML = '<p class="text-danger">Error al cargar contenido.</p>';
      });
  }

  // --- FUNCIONES INTERNAS (Para pintar el HTML de las pelis) ---

  function populateCarousel(carouselMovies) {
    carouselContainer.innerHTML = ''; 
    
    carouselMovies.forEach((movie, index) => {
      const isActive = index === 0 ? 'active' : '';
      // Nota: Ajusta las rutas de imagen si es necesario (ej. si usas base64 o url externa)
      const itemHtml = `
        <div class="carousel-item ${isActive}">
          <img src="${movie.poster_image_url}" class="d-block w-100" alt="${movie.title}" style="max-height: 500px; object-fit: cover;">
          <div class="carousel-caption d-none d-md-block text-start" style="background: rgba(0,0,0,0.5); padding: 20px; border-radius: 10px;">
            <h1 class="fw-bold text-white">${movie.title}</h1>
            <p class="lead text-white">${movie.synopsis ? movie.synopsis.substring(0, 120) + '...' : ''}</p>
            <a href="detalle.html?id=${movie._id}" class="btn btn-primary btn-lg shadow">Ver ahora</a>
          </div>
        </div>
      `;
      carouselContainer.innerHTML += itemHtml;
    });
  }

  function populateMainGrid(allMovies) {
    catalogRowsContainer.innerHTML = ''; 
    catalogRowsContainer.innerHTML += `<h3 class="mt-5 mb-4 border-bottom border-secondary pb-2 text-white">Explora nuestro catálogo</h3>`;
    
    const rowDiv = document.createElement('div');
    rowDiv.className = 'row g-4'; 
    
    allMovies.forEach(movie => {
      rowDiv.innerHTML += createGridCard(movie);
    });

    catalogRowsContainer.appendChild(rowDiv);
  }

  function createGridCard(movie) {
    return `
      <div class="col-6 col-md-4 col-lg-3">
        <div class="card h-100 shadow border-0" style="background-color: #2b2b2b; color: white;">
          <div class="overflow-hidden rounded-top position-relative">
            <img src="${movie.poster_image_url}" class="card-img-top" alt="${movie.title}" style="height: 300px; object-fit: cover;">
          </div>
          
          <div class="card-body d-flex flex-column">
            <div class="d-flex justify-content-between align-items-start mb-2">
                <h5 class="card-title text-truncate m-0" title="${movie.title}">${movie.title}</h5>
                <span class="badge bg-warning text-dark">${movie.year}</span>
            </div>
            
            <p class="card-text small text-info mb-3">
                ${movie.genres && movie.genres.length > 0 ? movie.genres[0].name : 'General'}
            </p>

            <a href="detalle.html?id=${movie._id}" class="btn btn-outline-light btn-sm w-100 mt-auto stretched-link">
                <i class="fa-solid fa-play"></i> Ver Detalles
            </a>
          </div>
        </div>
      </div>
    `;
  }

}); // Fin del DOMContentLoaded


// ---------------------------------------------------------
// FUNCIONES GLOBALES (Fuera del evento para ser accesibles desde HTML)
// ---------------------------------------------------------

/**
 * Revisa localStorage para ver si mostramos menú de usuario o de invitado
 */
function checkAuthStatus() {
    const token = localStorage.getItem('peliplus_token');
    const role = localStorage.getItem('peliplus_user_role');

    // Referencias a los elementos del Navbar (Asegúrate de tener estos IDs en tu index.html)
    const guestNav = document.getElementById('guest-nav');
    const userNav = document.getElementById('user-nav');
    const adminBtn = document.getElementById('admin-btn');
    const userNameDisplay = document.getElementById('user-name-display'); // Opcional

    if (token) {
        // --- USUARIO LOGUEADO ---
        if(guestNav) guestNav.classList.add('d-none');
        if(userNav) userNav.classList.remove('d-none');

        // Mostrar botón admin solo si es admin
        if (role === 'admin') {
            if(adminBtn) adminBtn.classList.remove('d-none');
        }
    } else {
        // --- INVITADO ---
        if(guestNav) guestNav.classList.remove('d-none');
        if(userNav) userNav.classList.add('d-none');
    }
}

/**
 * Cierra sesión y redirige
 */
function logout() {
    localStorage.removeItem('peliplus_token');
    localStorage.removeItem('peliplus_user_role');
    window.location.href = 'index.html';
}