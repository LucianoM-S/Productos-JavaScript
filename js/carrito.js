// CARRITO

let carrito = obtenerCarritoGuardado();

const listaCarrito = document.getElementById("listaCarrito");
const total = document.getElementById("total");
const cantidadCarrito = document.getElementById("cantidadCarrito");
const btnVaciar = document.getElementById("vaciarCarrito");
const btnFinalizar = document.getElementById("finalizarCompra");

// AGREGAR AL CARRITO

function agregarAlCarrito(producto) {
    if (producto.stock <= 0) {
        Swal.fire({
            icon: "warning",
            title: "Sin stock",
            text: "No hay unidades disponibles."
        });
        return;
    }
    producto.stock--;

    const existe = carrito.find(item => item.id === producto.id);
    if (existe) {
        existe.cantidad++;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            cantidad: 1
        });
    }
    guardarTodo();
}

// RENDERIZAR CARRITO

function renderizarCarrito() {
    listaCarrito.innerHTML = "";
    carrito.forEach(producto => {
        crearItemCarrito(producto);
    });
    actualizarTotales();
}

// CREAR UN PRODUCTO DEL CARRITO

function crearItemCarrito(producto) {
    const li = document.createElement("li");
    li.className = "list-group-item";

// NOMBRE

const nombre = document.createElement("h6");
    nombre.textContent = producto.nombre;

// PRECIO

const precio = document.createElement("p");
    precio.textContent =
        "$" +
        (producto.precio * producto.cantidad)
            .toLocaleString("es-AR");

// CONTENEDOR BOTONES

const controles = document.createElement("div");
    controles.className =
        "d-flex justify-content-center align-items-center gap-2";

// BOTON -

const btnMenos = document.createElement("button");
    btnMenos.className =
        "btn btn-outline-danger btn-sm";
    btnMenos.textContent = "-";

// CANTIDAD

const cantidad = document.createElement("span");
    cantidad.textContent = producto.cantidad;

// BOTON +

const btnMas = document.createElement("button");
    btnMas.className =
        "btn btn-outline-success btn-sm";
    btnMas.textContent = "+";

// BOTON ELIMINAR

const btnEliminar = document.createElement("button");
    btnEliminar.className =
        "btn btn-danger btn-sm mt-2";
    btnEliminar.textContent = "Eliminar";

// EVENTOS

btnMas.addEventListener("click", () => {
        sumarCantidad(producto.id);
    });
btnMenos.addEventListener("click", () => {
        restarCantidad(producto.id);
    });
btnEliminar.addEventListener("click", () => {
        eliminarProducto(producto.id);
    });

// ARMAR EL HTML

    controles.appendChild(btnMenos);
    controles.appendChild(cantidad);
    controles.appendChild(btnMas);
    li.appendChild(nombre);
    li.appendChild(precio);
    li.appendChild(controles);
    li.appendChild(btnEliminar);
    listaCarrito.appendChild(li);
    }

// SUMAR CANTIDAD

function sumarCantidad(id) {
    const productoCarrito =
        carrito.find(p => p.id === id);
    const producto =
        productos.find(p => p.id === id);
    if (producto.stock <= 0) {
        Swal.fire({
            icon: "warning",
            title: "No hay más stock"
        });
        return;
    }
    producto.stock--;
    productoCarrito.cantidad++;
    guardarTodo();
}

// RESTAR CANTIDAD

function restarCantidad(id) {
    const productoCarrito =
        carrito.find(p => p.id === id);
    const producto =
        productos.find(p => p.id === id);
    producto.stock++;
    productoCarrito.cantidad--;
    if (productoCarrito.cantidad <= 0) {
        carrito =
            carrito.filter(p => p.id !== id);
    }
    guardarTodo();
}

// ELIMINAR PRODUCTO

function eliminarProducto(id) {
    const productoCarrito =
        carrito.find(p => p.id === id);
    const producto =
        productos.find(p => p.id === id);
    producto.stock += productoCarrito.cantidad;
    carrito =
        carrito.filter(p => p.id !== id);
    guardarTodo();
}

// GUARDAR Y REFRESCAR

function guardarTodo() {
    guardarProductos(productos);
    guardarCarritoStorage(carrito);
    renderizarCarrito();
    refrescarCatalogo();
}

// TOTALES

function actualizarTotales() {
    const importe = carrito.reduce((acumulador, producto) => {
        return acumulador + (producto.precio * producto.cantidad);
    }, 0);
    total.textContent = importe.toLocaleString("es-AR");
    const cantidad = carrito.reduce((acumulador, producto) => {
        return acumulador + producto.cantidad;
    }, 0);
    cantidadCarrito.textContent = cantidad;
}

// VACIAR CARRITO

btnVaciar.addEventListener("click", () => {
    if (carrito.length === 0) {
        Swal.fire({
            icon: "info",
            title: "El carrito ya está vacío."
        });
        return;
    }
    Swal.fire({
        title: "¿Vaciar carrito?",
        text: "Todos los productos volverán al stock.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Vaciar",
        cancelButtonText: "Cancelar"
    }).then(resultado => {
        if (!resultado.isConfirmed) return;
        carrito.forEach(item => {
            const producto = productos.find(p => p.id === item.id);
            if (producto) {
                producto.stock += item.cantidad;
            }
        });
        carrito = [];
        guardarTodo();
        Swal.fire({
            icon: "success",
            title: "Carrito vacio"
        });
    });
});

// FINALIZAR COMPRA

btnFinalizar.addEventListener("click", () => {
    if (carrito.length === 0) {
        Swal.fire({
            icon: "warning",
            title: "No hay productos en el carrito."
        });
        return;
    }
    Swal.fire({
        title: "¿Confirmar compra?",
        text: "La compra quedará registrada.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Comprar",
        cancelButtonText: "Cancelar"
    }).then(resultado => {
        if (!resultado.isConfirmed) return;
        carrito = [];
        guardarTodo();
        Swal.fire({
            icon: "success",
            title: "¡Compra realizada!",
            text: "Gracias por elegir LS Insumos."
        });
    });
});

// INICIALIZACION

renderizarCarrito();