const container = document.getElementById('characters-container');
const searchInput = document.getElementById('search-input');
let characters = [];


async function fetchCharacters() {
    try {
        const response = await fetch('https://hp-api.onrender.com/api/characters');
        characters = await response.json();

        displayCharacters(characters.filter(char => char.image));
    } catch (error) {
        console.error('Error al obtener datos:', error);
        container.innerHTML = '<p>No se pudo cargar la magia...</p>';
    }
}


function displayCharacters(list) {
    container.innerHTML = '';
    list.forEach(char => {
        const card = document.createElement('div');
        card.classList.add('card');
        if (char.house) card.classList.add(char.house);

        card.innerHTML = `
            <img src="${char.image}" alt="${char.name}">
            <h3>${char.name}</h3>
            <p>Casa: ${char.house || 'N/A'}</p>
            <p>Actor: ${char.actor}</p>
        `;
        container.appendChild(card);
    });
}


searchInput.addEventListener('input', (e) => {
    const value = e.target.value.toLowerCase();
    const filtered = characters.filter(char => 
        char.name.toLowerCase().includes(value) && char.image
    );
    displayCharacters(filtered);
});

fetchCharacters();