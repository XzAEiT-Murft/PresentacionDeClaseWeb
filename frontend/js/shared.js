// Helpers de autenticación compartidos
export function getToken() {
  return localStorage.getItem("token");
}

export function saveAuthData(token, user) {
  // Guardamos el token JWT y la información del usuario en localStorage
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

export function clearAuthData() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function getCurrentUser() {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
}

export function isAdmin() {
  const user = getCurrentUser();
  return user && user.role === "admin";
}
