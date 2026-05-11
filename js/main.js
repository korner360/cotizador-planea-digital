let catalogoServicios = []; // Agrega esto para guardar los datos del JSON

// 1. Variables y Selección de elementos del DOM
const contenedor = document.getElementById('contenedor-servicios');
const listaCarrito = document.getElementById('lista-carrito');
const totalLabel = document.getElementById('total-presupuesto');
const btnFinalizar = document.getElementById('btn-finalizar');

let carrito = []; // Aquí guardaremos lo que el usuario elija

// 2. Función para obtener datos (FETCH)
async function cargarServicios() {
    try {
        const response = await fetch('./data/servicios.json'); 
        
        if (!response.ok) {
            throw new Error("No se pudo cargar el archivo JSON");
        }

        // --- CAMBIO AQUÍ ---
        catalogoServicios = await response.json(); // Guardamos los datos en la variable global
        renderizarServicios(catalogoServicios);    // Pasamos la variable a la función de dibujo
        // -------------------

    } catch (error) {
        console.error("Error detallado:", error);
    }
}

// 3. Función para mostrar los servicios en el HTML (DOM)
function renderizarServicios(lista) {
    lista.forEach(servicio => {
        const div = document.createElement('div');
        div.classList.add('card-servicio');
        div.innerHTML = `
            <img src="${servicio.imagen}" alt="${servicio.nombre}">
            <h3>${servicio.nombre}</h3>
            <p>Precio: $${servicio.precio}</p>
            <button class="btn-cotizar" onclick="agregarAlCarrito(${servicio.id})">Agregar</button>
        `;
        contenedor.appendChild(div);
    });
}


// paso agregar "carrito"
function agregarAlCarrito(id) {
    // 1. Buscamos el servicio en el catálogo usando .find() (Requisito técnico)
    const servicioElegido = catalogoServicios.find(s => s.id === id);
    
    if (servicioElegido) {
        carrito.push(servicioElegido); // Agregamos a la lista
        
        // 2. Persistencia: Guardamos en LocalStorage
        localStorage.setItem('carrito', JSON.stringify(carrito));
        
        // 3. Actualizamos la vista
        actualizarResumenHTML();

        // 4. Librería: Mostramos un aviso discreto con Toastify o SweetAlert
        Swal.fire({
            title: '¡Agregado!',
            text: `${servicioElegido.nombre} se sumó al presupuesto.`,
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
        });
    }
}

function actualizarResumenHTML() {
    listaCarrito.innerHTML = ""; // Limpiamos para no duplicar
    let total = 0;

    carrito.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `${item.nombre} - $${item.precio} 
                        <button onclick="eliminarDelCarrito(${index})" style="color:red; background:none; border:none; cursor:pointer;">[x]</button>`;
        listaCarrito.appendChild(li);
        total += item.precio;
    });

    totalLabel.innerText = total;
}

function eliminarDelCarrito(index) {
    // 1. Obtenemos el nombre antes de borrarlo para el mensaje
    const nombreProducto = carrito[index].nombre;

    // 2. Eliminamos del array
    carrito.splice(index, 1);

    // 3. Actualizamos Storage y HTML
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarResumenHTML();

    // 4. Notificación discreta (Toast)
    Swal.fire({
        title: 'Eliminado',
        text: `Se quitó ${nombreProducto} de la cotización`,
        icon: 'info',
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
        background: '#1e1e1e',
        color: '#fff'
    });
}
// BOTÓN FINALIZAR (Usando SweetAlert2 para eliminar el Alert/Prompt)
btnFinalizar.onclick = () => {
    if (carrito.length === 0) {
        Swal.fire('Carrito vacío', 'Agrega algún servicio primero', 'warning');
        return;
    }

    const totalFinal = totalLabel.innerText;
    Swal.fire({
        title: '¿Confirmar Presupuesto?',
        text: `El total de tu proyecto en Planea Digital es de $${totalFinal}`,
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Sí, enviar cotización',
        cancelButtonText: 'Seguir editando'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire('¡Enviado!', 'Nos pondremos en contacto contigo pronto.', 'success');
            carrito = []; // Limpiamos el carrito
            localStorage.clear();
            actualizarResumenHTML();
        }
    });
};


// Inicializar la app
cargarServicios();






