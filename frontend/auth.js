const API_URL = "http://localhost:3000";

// Helpers para token y rol guardados (para reutilizar en otras pantallas)
function getToken() {
  return localStorage.getItem("token");
}
function getCurrentUser() {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
}
function isAdmin() {
  const user = getCurrentUser();
  return user && user.roleName === "admin"; // Aquí comprobamos rol admin
}

const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const loginError = document.getElementById("login-error");
const registerError = document.getElementById("register-error");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  loginError.textContent = "";
  const formData = new FormData(loginForm);
  const payload = Object.fromEntries(formData.entries());

  try {
    // fetch devuelve una Promise; usamos await para esperar la respuesta del login
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Error en login");

    localStorage.setItem("token", data.token); // Guardamos el JWT
    localStorage.setItem("user", JSON.stringify(data.user));

    window.location.href = isAdmin() ? "./admin.html" : "./index.html"; // Redirección según rol
  } catch (error) {
    loginError.textContent = error.message;
  }
});

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  registerError.textContent = "";
  const formData = new FormData(registerForm);
  const payload = Object.fromEntries(formData.entries());

  try {
    // fetch devuelve una Promise; usamos await para crear el usuario
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Error al registrarse");

    // Registro exitoso, hacemos login automático con otra Promise usando async/await
    const loginRes = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: payload.email, password: payload.password }),
    });
    const loginData = await loginRes.json();
    if (!loginRes.ok) throw new Error(loginData.message || "Error en login automático");

    localStorage.setItem("token", loginData.token);
    localStorage.setItem("user", JSON.stringify(loginData.user));
    window.location.href = isAdmin() ? "./admin.html" : "./index.html";
  } catch (error) {
    registerError.textContent = error.message;
  }
});
