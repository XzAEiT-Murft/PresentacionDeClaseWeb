document.addEventListener('DOMContentLoaded', () => {
  const carouselContainer = document.getElementById('carousel-inner-container');
  const catalogRowsContainer = document.getElementById('catalog-rows');

  // 1. Cargar datos
  getMovies()
    .then(movies => {
      if (movies.length === 0) {
        catalogRowsContainer.innerHTML = '<p class="text-light">No hay películas en el catálogo.</p>';
        return;
      }
      
      // A. Llenar el Carrusel (Usamos las 3 más nuevas para que se vea fresco)
      // Ordenamos por año descendente primero
      const sortedMovies = [...movies].sort((a, b) => b.year - a.year);
      populateCarousel(sortedMovies.slice(0, 3));
      
      // B. Llenar la Cuadrícula Principal (Sin repetir categorías)
      populateMainGrid(sortedMovies);
    })
    .catch(error => {
      console.error('Error:', error);
      catalogRowsContainer.innerHTML = '<p class="text-danger">Error al cargar contenido.</p>';
    });

  // --- FUNCIÓN CARRUSEL ---
  function populateCarousel(carouselMovies) {
    carouselContainer.innerHTML = ''; 
    
    carouselMovies.forEach((movie, index) => {
      const isActive = index === 0 ? 'active' : '';
      const itemHtml = `
        <div class="carousel-item ${isActive}">
          <img src="${movie.poster_image_url}" class="d-block w-100" alt="${movie.title}">
          <div class="carousel-caption d-none d-md-block text-start">
            <h1 class="fw-bold" style="text-shadow: 2px 2px 4px #000;">${movie.title}</h1>
            <p class="lead" style="text-shadow: 1px 1px 2px #000;">${movie.synopsis.substring(0, 120)}...</p>
            <a href="detalle.html?id=${movie._id}" class="btn btn-primary btn-lg shadow">Ver ahora</a>
          </div>
        </div>
      `;
      carouselContainer.innerHTML += itemHtml;
    });
  }

  // --- FUNCIÓN GRID ÚNICA (Limpia y ordenada) ---
  function populateMainGrid(allMovies) {
    catalogRowsContainer.innerHTML = ''; 

    // Título de la sección
    catalogRowsContainer.innerHTML += `<h3 class="mt-5 mb-4 border-bottom border-secondary pb-2">Explora nuestro catálogo</h3>`;
    
    // Creamos el contenedor "row"
    const rowDiv = document.createElement('div');
    rowDiv.className = 'row g-4'; // g-4 da un espaciado uniforme
    
    allMovies.forEach(movie => {
      rowDiv.innerHTML += createGridCard(movie);
    });

    catalogRowsContainer.appendChild(rowDiv);
  }

  // --- HTML DE LA TARJETA (GRID 4 por fila) ---
  function createGridCard(movie) {
    // col-6 (2 en móvil), col-md-4 (3 en tablet), col-lg-3 (4 en desktop)
    return `
      <div class="col-6 col-md-4 col-lg-3">
        <div class="card h-100 shadow border-0" style="background-color: #2b2b2b; color: white;">
          
          <div class="overflow-hidden rounded-top">
            <img src="${movie.poster_image_url}" class="card-img-top" alt="${movie.title}">
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
});