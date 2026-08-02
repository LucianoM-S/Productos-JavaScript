// PRODUCTOS

let productos = [];

const contenedorProductos = document.getElementById("contenedorProductos");
const buscador = document.getElementById("buscador");
const categoria = document.getElementById("categoria");
const ordenar = document.getElementById("ordenar");
const limpiarFiltros = document.getElementById("limpiarFiltros");

// CARGAR PRODUCTOS

async function cargarProductos() {
    try {
        const productosGuardados = obtenerProductosGuardados();
        if (productosGuardados.length > 0) {
            productos = productosGuardados;
        } else {
            const respuesta = await fetch("../data/productos.json");
            if (!respuesta.ok) {
                throw new Error("No se pudieron cargar los productos.");
            }
            productos = await respuesta.json();
            guardarProductos(productos);
        }

        actualizarProductos();

    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: error.message
        });
    }
}

// MOSTRAR PRODUCTOS

function mostrarProductos(lista) {
    contenedorProductos.innerHTML = "";
    if (lista.length === 0) {
        contenedorProductos.innerHTML = `
            <div class="alert alert-warning text-center"> No se encontraron productos. </div>`;
        return;
    }
    lista.forEach(crearTarjeta);
}

// CREAR TARJETAS

function crearTarjeta(producto) {
    const tarjeta = document.createElement("div");
    tarjeta.className = "box";
    let estadoStock = "";
    let botonDeshabilitado = "";
    if (producto.stock === 0) {
        estadoStock = `<span class="badge bg-danger"> Sin stock </span>`;
        botonDeshabilitado = "disabled";
    }
    else if (producto.stock <= 3) {
        estadoStock = `<span class="badge bg-warning text-dark"> Stock: ${producto.stock} </span>`;
    }
    else {
        estadoStock = `<span class="badge bg-success"> Stock: ${producto.stock} </span>`;
    }
    tarjeta.innerHTML = `
        <img src="${producto.imagen}" class="foto" alt="${producto.nombre}">
        <h5>${producto.nombre}</h5>
        <p>$${producto.precio.toLocaleString("es-AR")}</p>
        ${estadoStock}
        <br><br>
        <button class="btn btn-primary w-100"> ${producto.stock === 0 ? "Sin stock" : "Agregar"} </button>
    `;
    const boton = tarjeta.querySelector("button");
    boton.disabled = producto.stock === 0;
    boton.addEventListener("click", () => {
        agregarAlCarrito(producto);
    });
    contenedorProductos.appendChild(tarjeta);
}

// ACTUALIZAR CATÁLOGO

function actualizarProductos() {
    let lista = [...productos];

    const texto = buscador.value.toLowerCase().trim();
    if (texto !== "") {
        lista = lista.filter(producto =>
            producto.nombre.toLowerCase().includes(texto)
        );
    }
    if (categoria.value !== "todos") {
        lista = lista.filter(producto =>
            producto.categoria === categoria.value
        );
    }
    switch (ordenar.value) {
        case "menor":
            lista.sort((a, b) => a.precio - b.precio);
            break;
        case "mayor":
            lista.sort((a, b) => b.precio - a.precio);
            break;
        case "az":
            lista.sort((a, b) => a.nombre.localeCompare(b.nombre));
            break;
        case "za":
            lista.sort((a, b) => b.nombre.localeCompare(a.nombre));
            break;
    }
    mostrarProductos(lista);
}

// EVENTOS

buscador.addEventListener("input", actualizarProductos);
categoria.addEventListener("change", actualizarProductos);
ordenar.addEventListener("change", actualizarProductos);

// LIMPIAR FILTROS

limpiarFiltros.addEventListener("click", () => {
    buscador.value = "";
    categoria.value = "todos";
    ordenar.value = "";
    actualizarProductos();
});

// RECARGAR EL CATALOGO

function refrescarCatalogo() {
    actualizarProductos();
}