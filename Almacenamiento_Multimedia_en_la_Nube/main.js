const cloudname = "djnmqgvgr"   
const preset    = "DLCRUZ"    

const inputf = document.getElementById("fileinput")
const imagen = document.getElementById("imagen")

const btnSubir       = document.getElementById("btnSubir")
const loadingText    = document.getElementById("loadingText")
const alertError     = document.getElementById("alertError")
const errorTexto     = document.getElementById("errorTexto")
const previewImg     = document.getElementById("previewImg")
const resultSection  = document.getElementById("resultSection")
const urlTexto       = document.getElementById("urlTexto")

// Vista previa al seleccionar archivo
inputf.addEventListener("change", function () {
    const foto = inputf.files[0]

    ocultarError()
    btnSubir.disabled = true
    previewImg.classList.add("hidden")

    if (!foto) return

    // Validar que sea imagen
    if (!foto.type.startsWith("image/")) {
        mostrarError("El archivo seleccionado no es una imagen. Elige un JPG, PNG, GIF o WEBP.")
        inputf.value = ""
        return
    }

    // Mostrar vista previa local
    const reader = new FileReader()
    reader.onload = function (e) {
        previewImg.src = e.target.result
        previewImg.classList.remove("hidden")
        btnSubir.disabled = false
    }
    reader.readAsDataURL(foto)
})
// FUNCIÓN PRINCIPAL: subirimg()

const subirimg = () => {

    const foto = inputf.files[0]

    // Validaciones
    if (!foto) {
        mostrarError("Por favor selecciona una imagen primero.")
        return
    }

    if (!foto.type.startsWith("image/")) {
        mostrarError("El archivo no es una imagen válida.")
        return
    }

    if (cloudname === "" || preset === "") {
        mostrarError("Configura tu cloudname y preset en main.js.")
        return
    }
    const formdata = new FormData()
    formdata.append('file', foto)
    formdata.append('upload_preset', preset)

    // Desactivar botón y mostrar "Subiendo..."
    btnSubir.disabled = true
    btnSubir.textContent = "Subiendo..."
    loadingText.classList.remove("hidden")
    ocultarError()


    fetch(`https://api.cloudinary.com/v1_1/${cloudname}/image/upload`, {
        method: 'POST',
        body: formdata
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Falla al subir la imagen")
        }
        return response.json()
    })
    .then(data => {
        // Éxito: mostrar imagen con la URL de Cloudinary
        loadingText.classList.add("hidden")
        btnSubir.textContent = "Cargar imagen"
        btnSubir.disabled = false

        imagen.src = data.secure_url
        urlTexto.textContent = data.secure_url
        resultSection.classList.remove("hidden")
    })
    .catch(error => {
        // Captura de errores: red, respuesta fallida.
        loadingText.classList.add("hidden")
        btnSubir.textContent = "Cargar imagen"
        btnSubir.disabled = false
        mostrarError("Error al subir: " + error.message)
    })
}


function mostrarError(msg) {
    errorTexto.textContent = msg
    alertError.classList.remove("hidden")
}

function ocultarError() {
    alertError.classList.add("hidden")
    errorTexto.textContent = ""
}

function resetear() {
    inputf.value = ""
    imagen.src = ""
    previewImg.src = ""
    previewImg.classList.add("hidden")
    resultSection.classList.add("hidden")
    btnSubir.disabled = true
    ocultarError()
    window.scrollTo({ top: 0, behavior: "smooth" })
}