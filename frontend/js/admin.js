// Variables globales
let allMovies = [];
let editMode = false;
const movieModalElement = document.getElementById('movieModal');
const movieModal = new bootstrap.Modal(movieModalElement);

document.addEventListener('DOMContentLoaded', async () => {
    
    // 1. PROTECCIÓN DE RUTA
    const token = localStorage.getItem('peliplus_token');
    const role = localStorage.getItem('peliplus_user_role');

    if (!token || role !== 'admin') {
        alert('Acceso denegado. Debes ser administrador.');
        window.location.href = '../login.html'; // Redirige al login
        return;
    }

    // Mostrar nombre (opcional, si lo guardaras en localStorage)
    // document.getElementById('adminName').textContent = ...;

    // 2. Cargar Películas
    await loadMoviesTable();

    // 3. Evento Submit del Formulario
    document.getElementById('movieForm').addEventListener('submit', handleFormSubmit);
});

// --- Función para Cargar la Tabla ---
async function loadMoviesTable() {
    const tableBody = document.getElementById('moviesTableBody');
    tableBody.innerHTML = '<tr><td colspan="5" class="text-center">Cargando...</td></tr>';

    // Usamos la función getMovies() de apiService.js
    // (Asegúrate de que apiService.js tenga la URL correcta)
    try {
        // Nota: Como apiService.js define API_URL relativo o absoluto, debería funcionar.
        // Pero si usas rutas relativas en fetch, cuidado porque estamos en /admin/
        // En apiService.js la URL es absoluta (http://localhost...), así que está bien.
        allMovies = await getMovies();
    } catch (error) {
        console.error(error);
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center text-danger">Error al cargar datos.</td></tr>';
        return;
    }

    if (allMovies.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center">No hay películas registradas.</td></tr>';
        return;
    }

    tableBody.innerHTML = ''; // Limpiar tabla

    allMovies.forEach(movie => {
        // Formatear géneros
        const genreNames = movie.genres.map(g => g.name).join(', ');

        const row = `
            <tr>
                <td>
                    <img src="../${movie.poster_image_url}" alt="Poster" style="width: 40px; height: 60px; object-fit: cover; border-radius: 4px;">
                </td>
                <td class="fw-bold">${movie.title}</td>
                <td>${movie.year}</td>
                <td><span class="badge bg-secondary">${genreNames}</span></td>
                <td class="text-end">
                    <button class="btn btn-sm btn-outline-info me-1" onclick="openEditModal('${movie._id}')">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteMovie('${movie._id}')">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// --- Manejar Submit (Crear o Editar) ---
async function handleFormSubmit(e) {
    e.preventDefault();
    
    // Obtener datos del form
    const title = document.getElementById('title').value;
    const year = document.getElementById('year').value;
    const synopsis = document.getElementById('synopsis').value;
    const posterUrl = document.getElementById('posterUrl').value;
    const videoUrl = document.getElementById('videoUrl').value;
    
    // Convertir string de géneros a Array (ej: "Acción, Drama" -> ["Acción", "Drama"])
    const genresInput = document.getElementById('genres').value;
    const genres = genresInput.split(',').map(g => g.trim()).filter(g => g !== '');

    const movieData = {
        title,
        year: parseInt(year),
        synopsis,
        poster_image_url: posterUrl,
        video_url: videoUrl,
        genres,
        type: 'movie' // Por ahora hardcodeamos 'movie'
    };

    const token = localStorage.getItem('peliplus_token');

    try {
        let response;
        if (editMode) {
            const id = document.getElementById('movieId').value;
            // PUT
            response = await fetch(`http://localhost:3000/api/media/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(movieData)
            });
        } else {
            // POST
            response = await fetch(`http://localhost:3000/api/media`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(movieData)
            });
        }

        if (response.ok) {
            alert(editMode ? 'Película actualizada' : 'Película creada');
            movieModal.hide();
            loadMoviesTable(); // Recargar tabla
        } else {
            const errorData = await response.json();
            alert('Error: ' + errorData.message);
        }

    } catch (error) {
        console.error(error);
        alert('Error de conexión');
    }
}

// --- Función para Borrar ---
async function deleteMovie(id) {
    if (!confirm('¿Estás seguro de eliminar esta película?')) return;

    const token = localStorage.getItem('peliplus_token');
    try {
        const response = await fetch(`http://localhost:3000/api/media/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            loadMoviesTable(); // Recargar
        } else {
            alert('No se pudo eliminar');
        }
    } catch (error) {
        console.error(error);
    }
}

// --- Helpers para el Modal ---
function resetForm() {
    editMode = false;
    document.getElementById('movieForm').reset();
    document.getElementById('movieModalLabel').textContent = 'Nueva Película';
}

// Esta función se llama desde el botón "Editar" de la tabla
// Necesitamos hacerla global (window) o definirla fuera del DOMContentLoaded si usamos onclick="" en HTML
window.openEditModal = (id) => {
    const movie = allMovies.find(m => m._id === id);
    if (!movie) return;

    editMode = true;
    document.getElementById('movieModalLabel').textContent = 'Editar Película';
    document.getElementById('movieId').value = movie._id;
    
    document.getElementById('title').value = movie.title;
    document.getElementById('year').value = movie.year;
    document.getElementById('synopsis').value = movie.synopsis;
    document.getElementById('posterUrl').value = movie.poster_image_url;
    document.getElementById('videoUrl').value = movie.video_url || '';
    
    // Convertir array de objetos géneros a string para el input
    const genreNames = movie.genres.map(g => g.name).join(', ');
    document.getElementById('genres').value = genreNames;

    movieModal.show();
};

// Hacer global la función delete también
window.deleteMovie = deleteMovie;

// Navegación simple entre secciones
window.showSection = (sectionId) => {
    document.getElementById('section-movies').style.display = 'none';
    document.getElementById('section-users').style.display = 'none';
    
    document.getElementById(`section-${sectionId}`).style.display = 'block';
    
    // Actualizar clase active del menú (simple)
    document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
    event.target.closest('.nav-link').classList.add('active');
};

window.logout = () => {
    localStorage.removeItem('peliplus_token');
    localStorage.removeItem('peliplus_user_role');
    window.location.href = '../index.html';
};