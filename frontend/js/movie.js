import { getToken } from 'shared.js';

const API_URL = "http://localhost:3000";

const titleEl = document.getElementById('movie-title');
const synopsisEl = document.getElementById('movie-synopsis');
const metaEl = document.getElementById('movie-meta');
const player = document.getElementById('movie-player');
const message = document.getElementById('movie-message');

function showMessage(text, type = 'info') {
  message.textContent = text;
  message.style.color = type === 'error' ? '#fca5a5' : '#a7f3d0';
}

function getIdFromQuery() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

async function loadMedia(id) {
  const token = getToken();
  if (!token) {
    // Validamos presencia de token JWT antes de solicitar reproducción protegida
    window.location.href = '../login.html';
    return;
  }
  try {
    // fetch devuelve una Promise; usamos async/await para esperar la respuesta protegida
    const res = await fetch(`${API_URL}/api/media/watch/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'No se pudo cargar el contenido');
    renderMedia(data);
  } catch (error) {
    showMessage(error.message, 'error');
  }
}

function renderMedia(media) {
  titleEl.textContent = media.title;
  synopsisEl.textContent = media.synopsis;
  metaEl.innerHTML = '';
  const yearChip = document.createElement('div');
  yearChip.className = 'chip';
  yearChip.textContent = media.year || 'Año N/D';
  const typeChip = document.createElement('div');
  typeChip.className = 'chip';
  typeChip.textContent = media.type === 'movie' ? 'Película' : 'Serie';
  metaEl.appendChild(yearChip);
  metaEl.appendChild(typeChip);
  if (media.genres?.length) {
    media.genres.forEach(g => {
      const chip = document.createElement('div');
      chip.className = 'chip';
      chip.textContent = g.name || g;
      metaEl.appendChild(chip);
    });
  }
  player.src = media.video_url || '';
}

const mediaId = getIdFromQuery();
if (!mediaId) {
  showMessage('ID de contenido inválido', 'error');
} else {
  loadMedia(mediaId);
}