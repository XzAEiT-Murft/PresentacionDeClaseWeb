// La URL base de tu API que está corriendo en Docker
const API_URL = 'http://localhost:3000/api';

/**
 * Función para obtener TODAS las películas (Ruta Pública)
 * Esto es para tu catálogo.
 */
async function getMovies() {
  try {
    const response = await fetch(`${API_URL}/media`);
    
    if (!response.ok) {
      throw new Error('No se pudieron cargar las películas.');
    }
    
    const movies = await response.json();
    return movies;

  } catch (error) {
    console.error('Error en getMovies:', error);
    return []; // Devuelve un array vacío en caso de error
  }
}

/**
 * Función para Iniciar Sesión (Ruta Pública)
 */
async function login(email, password) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al iniciar sesión');
    }
    
    // Si el login es exitoso, guardamos el token en el navegador
    // (localStorage es un almacén simple en el navegador)
    if (data.token) {
      localStorage.setItem('peliplus_token', data.token);
      localStorage.setItem('peliplus_user_role', data.role);
    }
    
    return data;

  } catch (error) {
    console.error('Error en login:', error);
    return { error: error.message }; // Devuelve un objeto de error
  }
}

/**
 * Función para Registrar un nuevo usuario (Ruta Pública)
 */
async function register(name, email, password) {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al registrarse');
    }

    return data;

  } catch (error) {
    console.error('Error en register:', error);
    return { error: error.message };
  }
}

/**
 * Función para Verificar cuenta (Ruta Pública)
 */
async function verifyAccount(email, code) {
  try {
    const response = await fetch(`${API_URL}/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al verificar');
    return data;

  } catch (error) {
    console.error('Error en verify:', error);
    return { error: error.message };
  }
}

// (Aquí añadiremos las funciones de admin como createMovie, deleteMovie, etc.)