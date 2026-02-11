const API_URL = 'https://dummyjson.com/products';

let skip = 0;
const limit = 10;
let totalProductos = 0;
let productos = [];
let categoriaSeleccionada = '';
let busquedaActual = '';
let ordenActual = '';

const productoTbody = document.getElementById('producto-tbody');
const searchInput = document.getElementById('search');
const btnBuscar = document.getElementById('btnBuscar');
const filtroCategoria = document.getElementById('filtroCategoria');
const ordenarPor = document.getElementById('ordenarPor');
const btnAnterior = document.getElementById('btnAnterior');
const btnSiguiente = document.getElementById('btnSiguiente');
const infoPagina = document.getElementById('infoPagina');
const totalProductosSpan = document.getElementById('totalProductos');

async function cargarProductos() {
    let url = '';
 
    if (busquedaActual) {
        url = `${API_URL}/search?q=${busquedaActual}&limit=${limit}&skip=${skip}`;
    } 
    else if (categoriaSeleccionada) {
        url = `${API_URL}/category/${categoriaSeleccionada}?limit=${limit}&skip=${skip}`;
    } 
    else {
        url = `${API_URL}?limit=${limit}&skip=${skip}`;
    }

    if (ordenActual) {
        const [campo, orden] = ordenActual.split('-');
        url += `&sortBy=${campo}&order=${orden}`;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        productos = data.products || [];
        totalProductos = data.total || 0;
        
        renderizarTabla(productos);
        actualizarPaginacion();
        actualizarInfoResultados();
    } catch (error) {
        productoTbody.innerHTML = '<tr><td colspan="7" class="error">Error al cargar productos</td></tr>';
        console.error('Error:', error);
    }
}

function renderizarTabla(lista) {
    productoTbody.innerHTML = '';
    
    if (lista.length === 0) {
        productoTbody.innerHTML = '<tr><td colspan="7" class="sin-resultados">No se encontraron productos</td></tr>';
        return;
    }

    lista.forEach(p => {
        const fila = document.createElement('tr');
        
        fila.innerHTML = `
            <td>${p.id}</td>
            <td><img src="${p.thumbnail || (p.images && p.images[0]) || ''}" alt="${p.title}" class="img-tabla"></td>
            <td class="producto-titulo">${p.title}</td>
            <td class="precio">$${p.price}</td>
            <td><span class="badge-categoria">${p.category}</span></td>
            <td>${p.stock}</td>
            <td class="acciones">
                <button class="btn-accion btn-editar" onclick="editarProducto(${p.id})">
                    Editar
                </button>
                <button class="btn-accion btn-eliminar" onclick="eliminarProducto(${p.id}, '${p.title}')">
                    Eliminar
                </button>
            </td>
        `;
        
        productoTbody.appendChild(fila);
    });
}

function actualizarPaginacion() {
    const paginaActual = Math.floor(skip / limit) + 1;
    const totalPaginas = Math.ceil(totalProductos / limit);
    
    infoPagina.textContent = `Página ${paginaActual} de ${totalPaginas}`;
    
    
    btnAnterior.disabled = skip === 0;
    
    btnSiguiente.disabled = skip + limit >= totalProductos;
}

function actualizarInfoResultados() {
    totalProductosSpan.textContent = `${totalProductos} producto${totalProductos !== 1 ? 's' : ''} encontrado${totalProductos !== 1 ? 's' : ''}`;
}

btnAnterior.addEventListener('click', () => {
    if (skip >= limit) {
        skip -= limit;
        cargarProductos();
    }
});

btnSiguiente.addEventListener('click', () => {
    if (skip + limit < totalProductos) {
        skip += limit;
        cargarProductos();
    }
});

function realizarBusqueda() {
    const query = searchInput.value.trim();
    busquedaActual = query;
    skip = 0; // Reiniciar a la primera página
    categoriaSeleccionada = ''; // Limpiar filtro de categoría al buscar
    filtroCategoria.value = '';
    cargarProductos();
}

searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        realizarBusqueda();
    }
});

btnBuscar.addEventListener('click', realizarBusqueda);

searchInput.addEventListener('input', () => {
    if (searchInput.value.trim() === '') {
        busquedaActual = '';
        skip = 0;
        cargarProductos();
    }
});

async function cargarCategorias() {
    try {
        const response = await fetch(`${API_URL}/category-list`);
        const categorias = await response.json();
        
        categorias.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
            filtroCategoria.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar categorías:', error);
    }
}

filtroCategoria.addEventListener('change', () => {
    categoriaSeleccionada = filtroCategoria.value;
    skip = 0; // Reiniciar a la primera página
    busquedaActual = ''; // Limpiar búsqueda al filtrar
    searchInput.value = '';
    cargarProductos();
});

ordenarPor.addEventListener('change', () => {
    ordenActual = ordenarPor.value;
    skip = 0; // Reiniciar a la primera página
    cargarProductos();
});

function editarProducto(id) {
    window.location.href = `editar.html?id=${id}`;
}


async function eliminarProducto(id, titulo) {
    const confirmacion = confirm(`¿Estás seguro de que deseas eliminar el producto:\n\n"${titulo}"?\n\nNota: Esta es una simulación, el producto no se eliminará permanentemente del servidor.`);
    
    if (!confirmacion) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        const resultado = await response.json();
        
        console.log('Producto eliminado (simulado):', resultado);
        
   
        productos = productos.filter(p => p.id !== id);
        totalProductos--;
        
   
        if (productos.length === 0 && skip > 0) {
            skip -= limit;
        }
        
        renderizarTabla(productos);
        actualizarPaginacion();
        actualizarInfoResultados();
        
        alert(` Producto "${titulo}" eliminado exitosamente.\n\n(Simulación - DummyJSON no elimina realmente los datos)`);
        
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        alert('❌ Error al eliminar el producto.');
    }
}


async function inicializar() {
    await cargarCategorias();
    await cargarProductos();
}


inicializar();
