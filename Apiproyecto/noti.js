// hosting
const urlApi = "https://grupoahost.com/institutouthh/API/api_noticias.php";

const cargarNoticias = () => {
    const errorTxt = document.getElementById("error-mensaje");
    const contenedor = document.getElementById("contenedor-publicaciones");
    
    errorTxt.innerText = ""; 
    contenedor.innerHTML = "<p>Cargando publicaciones...</p>";

    fetch(urlApi)
        .then(respuesta => {
            if (!respuesta.ok) throw new Error("No se pudo obtener respuesta del servidor (Status: " + respuesta.status + ")");
            return respuesta.json();
        })
        .then(noticias => {
            console.log("Datos recibidos:", noticias);
            mostrarNoticias(noticias);
        })
        .catch(error => {
            console.error("Error en Fetch:", error);
            contenedor.innerHTML = "";
            errorTxt.innerText = "Error al conectar con la API: " + error.message;
        });
}

const mostrarNoticias = (noticias) => {
    const contenedor = document.getElementById("contenedor-publicaciones");
    contenedor.innerHTML = ""; 

    if (noticias.length === 0) {
        contenedor.innerHTML = "<p>No hay noticias para mostrar.</p>";
        return;
    }

    noticias.forEach(noticia => {
        const tarjeta = document.createElement("div");
        tarjeta.classList.add("card");
        

        tarjeta.innerHTML = `
            ${noticia.imagen ? `<img src="${noticia.imagen}" alt="Imagen noticia">` : '<div style="height:180px; background:#ddd; display:flex; align-items:center; justify-content:center;">Sin Imagen</div>'}
            <div class="card-body">
                <span class="fecha">${noticia.fecha}</span>
                <h3>${noticia.titulo}</h3>
                <p>${noticia.contenido}</p>
            </div>
        `;
        
        contenedor.appendChild(tarjeta);
    });
}


document.getElementById("btn-cargar").addEventListener("click", cargarNoticias);