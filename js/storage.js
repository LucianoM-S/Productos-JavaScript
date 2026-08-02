// STORAGE

// PRODUCTOS

function obtenerProductosGuardados() {
    return JSON.parse(localStorage.getItem("productos")) || [];
}

function guardarProductos(productos) {
    localStorage.setItem(
        "productos",
        JSON.stringify(productos)
    );
}

// CARRITO

function obtenerCarritoGuardado() {
    return JSON.parse(localStorage.getItem("carrito")) || [];
}

function guardarCarritoStorage(carrito) {
    localStorage.setItem(
        "carrito",
        JSON.stringify(carrito)
    );
}

