const API_URL = "http://localhost:3000";

// Helpers para JWT y roles guardados en localStorage
function getToken() {
  return localStorage.getItem("token");
}
function getCurrentUser() {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
}
function isAdmin() {
  const user = getCurrentUser();
  return user && user.roleName === "admin"; // Aquí validamos el rol admin
}

const moviesContainer = document.getElementById("movies");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const adminBtn = document.getElementById("admin-btn");

function updateSessionButtons() {
  const user = getCurrentUser();
  if (user) {
    loginBtn.classList.add("hidden");
    logoutBtn.classList.remove("hidden");
    if (isAdmin()) {
      adminBtn.classList.remove("hidden");
    } else {
      adminBtn.classList.add("hidden");
    }
  } else {
    loginBtn.classList.remove("hidden");
    logoutBtn.classList.add("hidden");
    adminBtn.classList.add("hidden");
  }
}

loginBtn.addEventListener("click", () => {
  window.location.href = "./login.html";
});

logoutBtn.addEventListener("click", () => {
  localStorage.clear();
  updateSessionButtons();
});

adminBtn.addEventListener("click", () => {
  window.location.href = "./admin.html";
});

async function loadMovies() {
  try {
    // fetch devuelve una Promise; aquí usamos await para esperar la respuesta HTTP
    const res = await fetch(`${API_URL}/api/movies/public`);
    const data = await res.json();
    moviesContainer.innerHTML = "";

    data.forEach((movie) => {
      const card = document.createElement("article");
      card.className = "card";
      card.innerHTML = `
        <img src="${movie.posterUrl || "https://placehold.co/400x600"}" alt="${movie.title}">
        <div class="card-body">
          <h3>${movie.title}</h3>
          <p>${(movie.description || "").slice(0, 110)}...</p>
          <div class="actions">
            <button class="secondary" data-id="${movie._id}">Ver</button>
          </div>
        </div>
      `;
      card.querySelector("button").addEventListener("click", () => {
        window.location.href = `./movie.html?id=${movie._id}`;
      });
      moviesContainer.appendChild(card);
    });
  } catch (error) {
    moviesContainer.innerHTML = `<p class="error">Error cargando películas</p>`;
  }
}

updateSessionButtons();
loadMovies();
