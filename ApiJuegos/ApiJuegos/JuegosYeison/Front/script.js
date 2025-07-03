const API_KEY = '72a6331dd04948acb28eb06930aaf34b'; 
const API_URL = `https://api.rawg.io/api/games?key=${API_KEY}&page_size=30`;
let currentPage = 1;
let games = [];

const container = document.getElementById('games-container');
const pageIndicator = document.getElementById('page-indicator');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

async function fetchGames() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    games = data.results;
    renderPage(currentPage);
  } catch (error) {
    console.error('Error al obtener los juegos:', error);
  }
}

function renderPage(page) {
  container.innerHTML = '';
  const start = (page - 1) * 10;
  const end = start + 10;
  const currentGames = games.slice(start, end);

  currentGames.forEach(game => {
    const card = document.createElement('div');
    card.classList.add('card');

    card.innerHTML = `
      <img src="${game.background_image}" alt="${game.name}">
      <h3>${game.name}</h3>
      <p><strong>Lanzamiento:</strong> ${game.released || 'No disponible'}</p>
      <p><strong>Última actualización:</strong> ${game.updated || 'No disponible'}</p>
      <p class="platforms"><strong>Plataformas:</strong> ${game.platforms.map(p => p.platform.name).join(', ')}</p>
      <p class="stores"><strong>Tiendas:</strong> ${game.stores?.map(store => 
        `<a href="https://${store.store.domain}" target="_blank">${store.store.name}</a>`).join(', ') || 'No disponible'}
      </p>
    `;

    container.appendChild(card);
  });

  pageIndicator.textContent = `Página ${page}`;
  prevBtn.disabled = page === 1;
  nextBtn.disabled = end >= games.length;
}

prevBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    renderPage(currentPage);
  }
});

nextBtn.addEventListener('click', () => {
  if (currentPage * 10 < games.length) {
    currentPage++;
    renderPage(currentPage);
  }
});

fetchGames();
