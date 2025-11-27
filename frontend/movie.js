const API_URL = "http://localhost:3000";

// Helpers para token y rol guardados
function getToken() {
  return localStorage.getItem("token");
}
function getCurrentUser() {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
}

const token = getToken();
const user = getCurrentUser();
const container = document.getElementById("movie-container");
const logoutBtn = document.getElementById("logout-btn");

if (!token || !user) {
  window.location.href = "./login.html"; // Se exige JWT para ver el video
}

logoutBtn.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "./index.html";
});

const params = new URLSearchParams(window.location.search);
const movieId = params.get("id");

async function loadMovie() {
  try {
    // fetch devuelve una Promise; usamos await y enviamos Authorization con el JWT
    const res = await fetch(`${API_URL}/api/movies/watch/${movieId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Error al cargar película");

    const genres = (data.genres || []).map((g) => g.name || g).join(", ");
    container.innerHTML = `
      <h1>${data.title}</h1>
      <p>${data.description}</p>
      <p class="muted">${data.year || ""} · ${genres}</p>
      <iframe src="${data.videoUrl}" allowfullscreen></iframe>
    `;
  } catch (error) {
    container.innerHTML = `<p class="error">${error.message}</p>`;
  }
}

loadMovie();
