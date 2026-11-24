
class Guardia {
    constructor(id, sector, valorHora, cuposDisponibles) {
        this.id = id;
        this.sector = sector;
        this.valorHora = Number(valorHora);
        this.cuposDisponibles = Number(cuposDisponibles);
    }
}

let guardias = [
    new Guardia(1, "Guardia Diurna", 6500, 5),
    new Guardia(2, "Guardia Nocturna / Feriado", 8500, 4),
    new Guardia(3, "Guardia de Refuerzo", 7500, 6),
    new Guardia(4, "Terapia Intensiva", 9200, 2)
];

const formGuardia = document.querySelector("#form-guardia");
const inputSector = document.getElementById("input-sector");
const inputValor = document.getElementById("input-valor");
const inputCupos = document.getElementById("input-cupos");
const inputBuscar = document.querySelector("#input-buscar");
const contenedorGuardias = document.getElementById("contenedor-guardias");
const feedbackVisual = document.querySelector("#feedback-visual");
const totalGuardiasEl = document.getElementById("total-guardias");
const totalValoresEl = document.getElementById("total-valores");

function mostrarFeedback(mensaje, tipo = "exito") {
    feedbackVisual.textContent = mensaje;
    feedbackVisual.className = `feedback ${tipo}`;

    setTimeout(() => {
        feedbackVisual.classList.add("oculto");
    }, 3000);
}

function actualizarResumen(lista) {
    totalGuardiasEl.textContent = lista.length;
    const sumaValores = lista.reduce((acc, item) => acc + item.valorHora, 0);
    totalValoresEl.textContent = `$${sumaValores.toLocaleString("es-AR")}`;
}

function renderizarGuardias(lista, idResaltado = null) {
    contenedorGuardias.innerHTML = "";
    actualizarResumen(lista);

    if (lista.length === 0) {
        contenedorGuardias.innerHTML = `
            <div class="vacio-mensaje">
                <p>No se encontraron guardias que coincidan con la búsqueda.</p>
            </div>
        `;
        return;
    }

    lista.forEach((guardia) => {
        const claseExtra = guardia.id === idResaltado ? "destacada" : "";
        contenedorGuardias.innerHTML += `
            <article class="tarjeta-guardia ${claseExtra}" data-id="${guardia.id}">
                <div class="tarjeta-info">
                    <h3>${guardia.sector}</h3>
                    <p>Valor hora: $${guardia.valorHora.toLocaleString("es-AR")} — Cupos: ${guardia.cuposDisponibles}</p>
                </div>
                <button type="button" class="btn btn-eliminar" data-eliminar="${guardia.id}">Eliminar</button>
            </article>
        `;
    });

    const botonesEliminar = contenedorGuardias.querySelectorAll(".btn-eliminar");
    botonesEliminar.forEach((boton) => {
        boton.addEventListener("click", () => {
            const idEliminar = Number(boton.dataset.eliminar);
            eliminarGuardia(idEliminar);
        });
    });
}

function eliminarGuardia(id) {
    const guardiaEliminada = guardias.find((item) => item.id === id);
    guardias = guardias.filter((item) => item.id !== id);

    const textoFiltro = inputBuscar.value.trim().toLowerCase();
    const listaFiltrada = guardias.filter((item) =>
        item.sector.toLowerCase().includes(textoFiltro)
    );

    renderizarGuardias(listaFiltrada);

    if (guardiaEliminada) {
        mostrarFeedback(`Se eliminó "${guardiaEliminada.sector}" de la lista.`, "aviso");
    }
}

formGuardia.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const sector = inputSector.value.trim();
    const valorHora = Number(inputValor.value);
    const cupos = Number(inputCupos.value);

    if (!sector || isNaN(valorHora) || valorHora <= 0 || isNaN(cupos) || cupos < 0) {
        mostrarFeedback("Completá un sector válido, valor mayor a 0 y cupos de 0 o más.", "aviso");
        return;
    }

    const nuevoId = guardias.length > 0 ? Math.max(...guardias.map((g) => g.id)) + 1 : 1;
    const nuevaGuardia = new Guardia(nuevoId, sector, valorHora, cupos);
    guardias.push(nuevaGuardia);

    inputBuscar.value = "";
    renderizarGuardias(guardias, nuevaGuardia.id);
    mostrarFeedback(`Se agregó "${nuevaGuardia.sector}" al listado.`, "exito");

    formGuardia.reset();
    inputSector.focus();
});

inputBuscar.addEventListener("keyup", () => {
    const termino = inputBuscar.value.trim().toLowerCase();
    const filtradas = guardias.filter((guardia) =>
        guardia.sector.toLowerCase().includes(termino)
    );
    renderizarGuardias(filtradas);
});

renderizarGuardias(guardias);