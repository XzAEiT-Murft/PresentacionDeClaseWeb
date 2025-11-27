const API_URL = "http://localhost:3000";

// Helpers para leer token y rol desde localStorage
function getToken() {
  return localStorage.getItem("token");
}
function getCurrentUser() {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
}
function isAdmin() {
  const user = getCurrentUser();
  return user && user.roleName === "admin"; // Validación de rol admin
}

const token = getToken();
const user = getCurrentUser();
const movieList = document.getElementById("movie-list");
const movieForm = document.getElementById("movie-form");
const formTitle = document.getElementById("form-title");
const resetBtn = document.getElementById("reset-btn");
const formMessage = document.getElementById("form-message");
const genresSelect = document.getElementById("genres-select");
const logoutBtn = document.getElementById("logout-btn");

if (!token || !user || !isAdmin()) {
  window.location.href = "./login.html";
}

logoutBtn.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "./index.html";
});

let editingId = null;

async function fetchGenres() {
  try {
    // fetch devuelve una Promise; usamos await para obtener la lista de géneros
    const res = await fetch(`${API_URL}/api/genres`);
    const data = await res.json();
    genresSelect.innerHTML = "";
    data.forEach((genre) => {
      const option = document.createElement("option");
      option.value = genre._id;
      option.textContent = genre.name;
      genresSelect.appendChild(option);
    });
  } catch (error) {
    formMessage.textContent = "No se pudieron cargar los géneros";
  }
}

async function fetchMovies() {
  try {
    // fetch devuelve una Promise; aquí esperamos con await para traer el catálogo
    const res = await fetch(`${API_URL}/api/movies/public`);
    const data = await res.json();
    movieList.innerHTML = "";
    data.forEach((movie) => {
      const item = document.createElement("div");
      item.className = "list-item";
      item.innerHTML = `
        <div>
          <strong>${movie.title}</strong>
          <p class=\"muted\">${movie.type} · ${movie.year || "N/A"}</p>
        </div>
        <div class=\"actions\">
          <button class=\"secondary\" data-action=\"edit\">Editar</button>
          <button class=\"primary\" data-action=\"delete\">Eliminar</button>
        </div>
      `;
      item.querySelector("[data-action='edit']").addEventListener("click", () => handleEdit(movie));
      item.querySelector("[data-action='delete']").addEventListener("click", () => handleDelete(movie._id));
      movieList.appendChild(item);
    });
  } catch (error) {
    movieList.innerHTML = `<p class="error">Error al cargar catálogo</p>`;
  }
}

function handleEdit(movie) {
  editingId = movie._id;
  formTitle.textContent = "Editar contenido";
  movieForm.title.value = movie.title || "";
  movieForm.description.value = movie.description || "";
  movieForm.year.value = movie.year || "";
  movieForm.posterUrl.value = movie.posterUrl || "";
  movieForm.videoUrl.value = movie.videoUrl || "";
  movieForm.type.value = movie.type || "movie";
  Array.from(genresSelect.options).forEach((opt) => {
    opt.selected = movie.genres?.some((g) => g === opt.value || g?._id === opt.value);
  });
}

async function handleDelete(id) {
  if (!confirm("¿Eliminar este contenido?")) return;
  try {
    // fetch devuelve una Promise; se envía JWT en Authorization para rol admin
    const res = await fetch(`${API_URL}/api/movies/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "No se pudo eliminar");
    formMessage.textContent = data.message || "Eliminado";
    await fetchMovies(); // Uso de async/await encadenado a la Promise fetch
  } catch (error) {
    formMessage.textContent = error.message;
  }
}

movieForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(movieForm);
  const payload = Object.fromEntries(formData.entries());
  payload.genres = Array.from(genresSelect.selectedOptions).map((o) => o.value);

  try {
    // fetch devuelve una Promise; usamos await para crear o actualizar
    const res = await fetch(editingId ? `${API_URL}/api/movies/${editingId}` : `${API_URL}/api/movies`, {
      method: editingId ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Error al guardar");

    formMessage.textContent = editingId ? "Actualizado con éxito" : "Creado con éxito";
    movieForm.reset();
    editingId = null;
    formTitle.textContent = "Crear nuevo contenido";
    Array.from(genresSelect.options).forEach((opt) => (opt.selected = false));
    await fetchMovies();
  } catch (error) {
    formMessage.textContent = error.message;
  }
});

resetBtn.addEventListener("click", () => {
  editingId = null;
  formTitle.textContent = "Crear nuevo contenido";
  movieForm.reset();
  Array.from(genresSelect.options).forEach((opt) => (opt.selected = false));
});

fetchGenres();
fetchMovies();
