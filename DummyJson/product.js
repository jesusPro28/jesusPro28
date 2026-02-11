const API_URL = 'https://dummyjson.com/products';

const productGrid = document.getElementById('producto-grid');
const detailView = document.getElementById('detail');
const catalogView = document.getElementById('catalogo');
const backButton = document.getElementById('back');
const searchInput = document.getElementById('search');
 
let products = [];

async function fetchProducts() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        products = data.products || [];
        renderProducts(products);
    } catch (error) {
        productGrid.innerHTML = '<p class="error">Error cargando productos.</p>';
        console.error(error);
    }
}

function renderProducts(list) {
    productGrid.innerHTML = '';
    if (list.length === 0) {
        productGrid.innerHTML = '<p class="muted">No se encontraron productos.</p>';
        return;
    }
    list.forEach(p => {
        const card = document.createElement('div');
        card.className = 'card';

        const img = document.createElement('img');
        img.src = p.images && p.images.length ? p.images[0] : '';
        img.alt = p.title;
        img.className = 'thumb';

        img.addEventListener('click', () => showDetails(p.id));
        
        const title = document.createElement('h3');
        title.textContent = p.title;

        const price = document.createElement('p');
        price.className = 'price';
        price.textContent = `$${p.price}`;

        const category = document.createElement('p');
        category.className = 'muted';
        category.textContent = p.category;

        const qtyWrap = document.createElement('div');
        qtyWrap.className = 'qty';
        
        const minus = document.createElement('button');
        minus.className = 'btn small';
        minus.textContent = '-';
        
        const plus = document.createElement('button');
        plus.className = 'btn small';
        plus.textContent = '+';
        
        const counter = document.createElement('span');
        counter.textContent = '0';
        counter.className = 'counter';

        minus.addEventListener('click', () => {
            let v = Number(counter.textContent);
            if (v > 0) v--;
            counter.textContent = v;
        });
        
        plus.addEventListener('click', () => {
            let v = Number(counter.textContent);
            v++;
            counter.textContent = v;
        });
        
        qtyWrap.append(minus, counter, plus);
        card.append(img, title, price, category, qtyWrap);
        productGrid.appendChild(card);
    });
}

async function showDetails(id) {
    const p = products.find(x => x.id === id);
    if (!p) return;

    // Poblar detalles
    document.getElementById('detail-img').src = p.images && p.images.length ? p.images[0] : '';
    document.getElementById('detail-title').textContent = p.title;
    document.getElementById('detail-brand').textContent = `Marca: ${p.brand || 'N/A'}`;
    document.getElementById('detail-price').textContent = `Precio: $${p.price}`;
    document.getElementById('detail-description').textContent = p.description;
    document.getElementById('detail-extra').textContent = `Categoría: ${p.category} | Stock: ${p.stock}`;
    document.getElementById('detail-opinios').textContent = `Opiniones (rating): ${p.rating}`;

    // Cambiar vistas
    catalogView.classList.add('hidden');
    detailView.classList.remove('hidden');
    window.scrollTo({top: 0, behavior: 'smooth'});
}

backButton.addEventListener('click', () => {
    detailView.classList.add('hidden');
    catalogView.classList.remove('hidden');
});

const searchbtn = document.getElementById('btnBuscar');

function doSearch() {
    const q = searchInput.value.trim().toLowerCase();
    // Buscar solamente por nombre del producto
    const filtered = products.filter(p => p.title.toLowerCase().includes(q));
    renderProducts(filtered);
}

// Búsqueda por nombre
searchInput.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    const filtered = products.filter(p => p.title.toLowerCase().includes(q));
    renderProducts(filtered);
});

// Enter buscar
searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') doSearch();
});

// Click en botón buscar
if (searchbtn) {
    searchbtn.addEventListener('click', doSearch);
}

// Inicialización
fetchProducts();