const pokemonContainer = document.querySelector(".pokemon-container");
const searchInput = document.querySelector("#searchInput");

let allPokemons = [];

// Función para obtener un Pokémon por su ID
function fetchPokemon(id) {
  return fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
    .then((res) => res.json())
    .then((data) => data);
}

// Función para cargar todos los Pokémon
async function fetchAllPokemons(limit) {
  for (let i = 1; i <= limit; i++) {
    const pokemon = await fetchPokemon(i);
    allPokemons.push(pokemon);
    createPokemon(pokemon);
  }
}

// Función para crear una tarjeta de Pokémon
function createPokemon(pokemon) {
  const flipCard = document.createElement("div");
  flipCard.classList.add("flip-card");

  const cardContainer = document.createElement("div");
  cardContainer.classList.add("card-container");

  flipCard.appendChild(cardContainer);

  // Parte frontal
  const card = document.createElement("div");
  card.classList.add("pokemon-block");

  const spriteContainer = document.createElement("div");
  spriteContainer.classList.add("img-container");

  const sprite = document.createElement("img");
  sprite.src = pokemon.sprites.front_default;

  spriteContainer.appendChild(sprite);

  const number = document.createElement("p");
  number.textContent = `#${pokemon.id.toString().padStart(3, 0)}`;

  const name = document.createElement("p");
  name.classList.add("name");
  name.textContent = pokemon.name;

  card.appendChild(spriteContainer);
  card.appendChild(number);
  card.appendChild(name);

  // Parte trasera
  const cardBack = document.createElement("div");
  cardBack.classList.add("pokemon-block-back");

  const types = document.createElement("p");
  types.textContent = `Tipo: ${pokemon.types.map((type) => type.type.name).join(", ")}`;

  const abilities = document.createElement("p");
  abilities.textContent = `Habilidades: ${pokemon.abilities.map((ab) => ab.ability.name).join(", ")}`;

  const statsContainer = document.createElement("div");
  statsContainer.classList.add("stats-container");

  statsContainer.appendChild(createStatBar("Vida", pokemon.stats[0].base_stat));
  statsContainer.appendChild(createStatBar("Ataque", pokemon.stats[1].base_stat));
  statsContainer.appendChild(createStatBar("Defensa", pokemon.stats[2].base_stat));

  cardBack.appendChild(types);
  cardBack.appendChild(abilities);
  cardBack.appendChild(statsContainer);

  cardContainer.appendChild(card);
  cardContainer.appendChild(cardBack);
  pokemonContainer.appendChild(flipCard);
}

// Función para crear barra de progreso
function createStatBar(label, value) {
  const statContainer = document.createElement("div");
  statContainer.classList.add("stat-container", "mb-2");

  const statLabel = document.createElement("p");
  statLabel.textContent = `${label}: ${value}`;
  statLabel.classList.add("mb-1");

  const progress = document.createElement("div");
  progress.classList.add("progress");

  const progressBar = document.createElement("div");
  progressBar.classList.add("progress-bar");
  progressBar.style.width = `${Math.min(value / 2, 100)}%`;
  progressBar.textContent = `${value}`;

  progress.appendChild(progressBar);
  statContainer.appendChild(statLabel);
  statContainer.appendChild(progress);

  return statContainer;
}

// Función para eliminar nodos hijos
function removeChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

// Filtrar Pokémon por nombre
searchInput.addEventListener("input", (event) => {
  const searchTerm = event.target.value.toLowerCase();
  const filteredPokemons = allPokemons.filter((pokemon) =>
    pokemon.name.includes(searchTerm)
  );
  removeChildNodes(pokemonContainer);
  filteredPokemons.forEach((pokemon) => createPokemon(pokemon));
});

// Cargar todos los Pokémon (por ejemplo, los primeros 151)
fetchAllPokemons(500);
