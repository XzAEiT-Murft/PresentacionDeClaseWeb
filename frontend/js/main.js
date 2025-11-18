// Espera a que todo el HTML se cargue
document.addEventListener('DOMContentLoaded', () => {
  const carouselContainer = document.getElementById('carousel-inner-container');
  const catalogRowsContainer = document.getElementById('catalog-rows');

  // Llama a la API para obtener todas las películas (Promise)
  getMovies()
    .then(movies => {
      if (movies.length === 0) {
        catalogRowsContainer.innerHTML = '<p class="text-light">No hay películas en el catálogo.</p>';
        return;
      }
      
      // 1. Llena el carrusel (con las primeras 3 películas)
      populateCarousel(movies.slice(0, 3));
      
      // 2. Llena las filas de Netflix
      populateCatalogRows(movies);
      
    })
    .catch(error => {
      console.error('Error al cargar la página principal:', error);
      catalogRowsContainer.innerHTML = '<p class="text-danger">Error al cargar el contenido.</p>';
    });

  /**
   * Crea el HTML del Carrusel (Prime Video style)
   */
  function populateCarousel(carouselMovies) {
    carouselContainer.innerHTML = ''; // Limpia el "Cargando..."
    
    carouselMovies.forEach((movie, index) => {
      const isActive = index === 0 ? 'active' : ''; // Solo el primer slide es 'active'
      const itemHtml = `
        <div class="carousel-item ${isActive}">
          <img src="${movie.poster_image_url}" class="d-block w-100" alt="${movie.title}" style="max-height: 500px; object-fit: cover; filter: brightness(0.6);">
          <div class="carousel-caption d-none d-md-block text-start" style="bottom: 3rem;">
            <h1>${movie.title}</h1>
            <p>${movie.synopsis.substring(0, 150)}...</p>
            <a href="#" class="btn btn-primary btn-lg">Ver ahora</a>
          </div>
        </div>
      `;
      carouselContainer.innerHTML += itemHtml;
    });
  }

  /**
   * Crea las filas de categorías (Netflix style)
   */
  function populateCatalogRows(allMovies) {
    catalogRowsContainer.innerHTML = ''; // Limpia el contenedor

    // --- Lógica de Filtros (¡Aquí puedes ser creativo!) ---
    const dramaMovies = allMovies.filter(m => m.genres.includes('Drama'));
    const crimeMovies = allMovies.filter(m => m.genres.includes('Crimen'));
    
    const categories = [
      { title: 'Recomendadas para ti', movies: allMovies }, // Fila con todas
      { title: 'Dramas', movies: dramaMovies },
      { title: 'Crimen', movies: crimeMovies }
    ];

    // Recorremos las categorías y creamos el HTML
    categories.forEach(category => {
      if (category.movies.length > 0) {
        // 1. Crea el título de la fila (ej: "Dramas")
        catalogRowsContainer.innerHTML += `<h3 class="mt-4">${category.title}</h3>`;
        
        // 2. Crea el div para el scroll horizontal
        const rowScrollDiv = document.createElement('div');
        rowScrollDiv.className = 'movie-row-scroll';
        
        // 3. Llena la fila con las tarjetas de películas
        category.movies.forEach(movie => {
          rowScrollDiv.innerHTML += createHorizontalMovieCard(movie);
        });

        // 4. Añade la fila completa al contenedor
        catalogRowsContainer.appendChild(rowScrollDiv);
      }
    });
  }

  /**
   * Crea el HTML para una tarjeta de película HORIZONTAL
   */
  function createHorizontalMovieCard(movie) {
    return `
      <div class.card movie-card-inline" style="width: 220px;">
        <img src="${movie.poster_image_url}" class="card-img-top" alt="${movie.title}" style="height: 300px; object-fit: cover;">
        <div class="card-body">
          <h6 class="card-title text-truncate">${movie.title}</h6>
          <p class="card-text small text-body-secondary">${movie.year}</p>
        </div>
      </div>
    `;
  }
});