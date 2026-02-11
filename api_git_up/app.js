const GITHUB_USERNAME = 'jesusPro28'; 

async function fetchUserProfile() {
    try {
        const url = `https://api.github.com/users/${GITHUB_USERNAME}`;
        console.log('Obteniendo perfil desde:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const user = await response.json();
        console.log('Perfil obtenido:', user);
        
        displayProfile(user);
        
    } catch (error) {
        console.error('Error al obtener perfil:', error);
        displayError('No se pudo cargar el perfil de usuario');
    }
}

function displayProfile(user) {
    const profileHTML = `
        <div class="profile-section">
            <img src="${user.avatar_url}" alt="${user.name || user.login}" class="profile-avatar">
            <div class="profile-info">
                <h1>${user.name || user.login}</h1>
                <p class="bio">${user.bio || 'No solo son variables'}</p>
                <p class="location">${user.location || 'En algún lugar del mundo'}</p>
            </div>
        </div>
    `;
    
    const profileElement = document.getElementById('profile');
    profileElement.innerHTML = profileHTML;
    profileElement.style.display = 'block';
}

async function fetchTopRepositories() {
    try {
        const params = new URLSearchParams({
            sort: 'updated',       
            per_page: '6',         
            type: 'owner',         
            direction: 'desc'      
        });
        
        const url = `https://api.github.com/users/${GITHUB_USERNAME}/repos?${params}`;
        console.log(' Obteniendo repositorios desde:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const repos = await response.json();
        console.log('Repositorios obtenidos:', repos.length, 'proyectos');
        
        displayProjects(repos);
        
    } catch (error) {
        console.error('Error al obtener repositorios:', error);
        displayError('No se pudieron cargar los proyectos');
    }
}

function displayProjects(repos) {
    const projectsHTML = repos.map(repo => {
        const updatedDate = new Date(repo.updated_at).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        return `
            <div class="project-card">
                <h3>${repo.name}</h3>
                <p class="description">${repo.description || 'Sin descripción disponible'}</p>
                
                <div class="project-meta">
                    ${repo.language ? `<span class="language-badge">${repo.language}</span>` : ''}
                    <span class="meta-item">${repo.stargazers_count}</span>
                    <span class="meta-item">${repo.forks_count}</span>
                    <span class="meta-item">${updatedDate}</span>
                </div>
                
                <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="project-link">
                    Ver Proyecto →
                </a>
            </div>
        `;
    }).join('');
    
    document.getElementById('projects').innerHTML = projectsHTML;
    document.getElementById('projects-container').style.display = 'block';
}
async function fetchFollowers() {
    try {
        const url = `https://api.github.com/users/${GITHUB_USERNAME}/followers?per_page=5`;
        console.log('Obteniendo seguidores desde:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const followers = await response.json();
        console.log('Seguidores obtenidos:', followers.length);
        
        if (followers.length > 0) {
            displayCommunity(followers);
        }
        
    } catch (error) {
        console.error('Error al obtener seguidores:', error);
        console.log('No se pudieron cargar los seguidores');
    }
}

function displayCommunity(followers) {
    const followersHTML = followers.map(follower => `
        <div class="follower-card">
            <a href="${follower.html_url}" target="_blank" rel="noopener noreferrer">
                <img src="${follower.avatar_url}" alt="${follower.login}" class="follower-avatar">
                <p class="follower-name">${follower.login}</p>
            </a>
        </div>
    `).join('');
    
    const communityHTML = `
        <div class="community-section">
            <h2> Mi Comunidad</h2>
            <div class="followers-grid">
                ${followersHTML}
            </div>
        </div>
    `;
    
    const communityElement = document.getElementById('community');
    communityElement.innerHTML = communityHTML;
    communityElement.style.display = 'block';
}

function displayError(message) {
    const errorHTML = `
        <div class="error-message">
            <h2>Error</h2>
            <p>${message}</p>
            <p>Por favor, verifica tu conexión e intenta nuevamente.</p>
        </div>
    `;
    
    document.getElementById('loading').innerHTML = errorHTML;
}
async function initPortfolio() {
    try {
        console.log('Iniciando carga del portafolio...');
        console.log('Usuario:', GITHUB_USERNAME);
        await Promise.all([
            fetchUserProfile(),
            fetchTopRepositories(),
            fetchFollowers()
        ]);
        document.getElementById('loading').style.display = 'none';
        console.log('Portafolio cargado exitosamente');
        
    } catch (error) {
        console.error('Error al inicializar portafolio:', error);
        displayError('Error al cargar el portafolio');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('%cPortafolio Dinámico con GitHub API', 'color: #667eea; font-size: 20px; font-weight: bold;');
    console.log('%c═══════════════════════════════════════', 'color: #667eea;');
    console.log('%cEndpoints utilizados:', 'color: #667eea; font-weight: bold;');
    console.log('1️ Perfil:', `https://api.github.com/users/${GITHUB_USERNAME}`);
    console.log('2️Repos:', `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6&type=owner&direction=desc`);
    console.log('3️Followers:', `https://api.github.com/users/${GITHUB_USERNAME}/followers?per_page=5`);
    console.log('%c═══════════════════════════════════════', 'color: #667eea;');
        initPortfolio();
});
