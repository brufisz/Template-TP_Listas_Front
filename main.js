/*
    Cargar comidas en memoria desde el JSON
*/
fetch('./data/comidas-extended.json')          // Ruta al archivo JSON
  .then(response => response.json())  // Convertir la respuesta en JSON
  .then(data => {                     // Aquí tienes acceso al JSON en formato de objeto JS
    comidas = data;        
    mostrarComidas(comidas);
    actualizarFiltros();
    filtrarComidas();
  })
  .catch(error => {                   // Manejo de errores al leer el archivo JSON
    console.error('Error al leer el archivo JSON:', error);
  });

let comidas = [];

const container = document.getElementById('comidaContainer');
function mostrarComidas(listaComidas) {
  container.innerHTML = '';
  listaComidas.forEach(comida => {
    let ingredientesHTML = '';
    comida.ingredientes.forEach(ingrediente => {
      ingredientesHTML += `
        <li>${ingrediente}</li>
       `;
    });
    container.innerHTML += `
      <article class="comida-card">
        <h2>${comida.nombre}</h2>
        <p class="categoria">Categoría: ${comida.categoria}</p>
        <p class="provincia">Provincia: ${comida.provincia}</p>
        <h3>Ingredientes</h3>
        <ul>
          ${ingredientesHTML}
        </ul>
        <button class="borrar" value="${comida.nombre}">&times;</button>
      </article>
    `;
  });
  actualizarBotones();
}

mostrarComidas(comidas);

const agregarComida = document.getElementById("comidaForm");
const botonAgregar = document.getElementById("botonAgregar");
const seccionAgregar = document.getElementById("seccionAgregar");
botonAgregar.addEventListener("click", () => {
  if (seccionAgregar.style.display === "block") {
    seccionAgregar.style.display = "none";
    botonAgregar.textContent = "Agregar comida";
    botonAgregar.classList.remove("cerrar");
  } else {
    seccionAgregar.style.display = "block";
    botonAgregar.textContent = "Cerrar";
    botonAgregar.classList.add("cerrar");
  }
});

agregarComida.addEventListener("submit", (event) => {
  event.preventDefault();
  const ingredientes = event.target.ingredientes.value.split(",");
    const nuevaComida = {
      nombre: event.target.nombre.value,
      categoria: event.target.categoria.value,
      provincia: event.target.provincia.value,
      ingredientes: ingredientes
    };
    comidas.push(nuevaComida);
    mostrarComidas(comidas);
    agregarComida.reset();
    actualizarFiltros();
    filtrarComidas();
})

function actualizarBotones() {
  const botones = document.querySelectorAll(".borrar");
  botones.forEach(boton => {
    boton.addEventListener("click", () => {
      const nombreABorrar = boton.value;
      let nuevasComidas = [];
      comidas.forEach(comida => {
        if (comida.nombre != nombreABorrar) {
          nuevasComidas.push(comida);
        }
      });
      comidas = nuevasComidas;
      mostrarComidas(comidas);
      filtrarComidas();
    });
  });
};

//FILTROS

const busqueda = document.getElementById('busqueda');
const filtroCategoria = document.getElementById('filtroCategoria');
const filtroProvincia = document.getElementById('filtroProvincia');

function actualizarFiltros() {
  const categoriaElegida = filtroCategoria.value;
  const provinciaElegida = filtroProvincia.value;
  filtroCategoria.innerHTML = '<option value="">Todos los tipos</option>';
  filtroProvincia.innerHTML = '<option value="">Todas las provincias</option>';

  let categorias = [];
  let provincias = [];

  comidas.forEach(comida => {
    if (!categorias.includes(comida.categoria)) {
      categorias.push(comida.categoria);
      filtroCategoria.innerHTML += `
        <option value="${comida.categoria}">${comida.categoria}</option>
      `;
    }
    if (!provincias.includes(comida.provincia)) {
      provincias.push(comida.provincia);
      filtroProvincia.innerHTML += `
        <option value="${comida.provincia}">${comida.provincia}</option>
      `;
    }
  });
  filtroCategoria.value = categoriaElegida;
  filtroProvincia.value = provinciaElegida;
}

function filtrarComidas() {
  const texto = busqueda.value.toLowerCase().trim();
  const categoria = filtroCategoria.value;
  const provincia = filtroProvincia.value;

  let comidasFiltradas = [];

  comidas.forEach(comida => {
    let coincideTexto =
      comida.nombre.toLowerCase().includes(texto) ||
      comida.categoria.toLowerCase().includes(texto) ||
      comida.provincia.toLowerCase().includes(texto);
    comida.ingredientes.forEach(ingrediente => {
      if (ingrediente.toLowerCase().includes(texto)) {
        coincideTexto = true;
      }
    });
    const coincideCategoria = categoria === "" || comida.categoria === categoria;
    const coincideProvincia = provincia === "" || comida.provincia === provincia;
    if (coincideTexto && coincideCategoria && coincideProvincia) {
      comidasFiltradas.push(comida);
    }
  });
  mostrarComidas(comidasFiltradas);
}

busqueda.addEventListener("input", filtrarComidas);
filtroCategoria.addEventListener("change", filtrarComidas);
filtroCategoria.addEventListener("change", actualizarFiltros);
filtroProvincia.addEventListener("change", filtrarComidas);
filtroProvincia.addEventListener("change", actualizarFiltros);

//RECETARIO

const formRecetario = document.getElementById("formRecetario");
const misIngredientes = document.getElementById("misIngredientes");
const resultadosRecetario = document.getElementById("resultadosRecetario");

formRecetario.addEventListener("submit", (event) => {
  event.preventDefault();
  let ingredientesUsuario = misIngredientes.value.toLowerCase().split(",");
  let posibles = [];
  let cercanos = [];
  comidas.forEach(comida => {
    let faltantes = [];
    let encontrados = 0;
    comida.ingredientes.forEach(ingrediente => {
      let tengo = false;
      ingredientesUsuario.forEach(ingredienteUsuario => {
        let buscado = ingredienteUsuario.trim();
        let necesario = ingrediente.toLowerCase().trim();
        if (buscado !== "" && (necesario.includes(buscado) || buscado.includes(necesario))) {
          tengo = true;
        }
      });
      if (tengo) {
        encontrados++;
      } else {
        faltantes.push(ingrediente);
      }
    });
    if (encontrados > 0) {
      if (faltantes.length === 0) {
        posibles.push(comida);
      } else if (faltantes.length <= 2) {
        cercanos.push({
          nombre: comida.nombre,
          faltantes: faltantes
        });
      }
    }
  });
  resultadosRecetario.innerHTML = "";
  if (posibles.length > 0) {
    resultadosRecetario.innerHTML += "<h3>Platos que podés preparar</h3>";
    posibles.forEach(comida => {
      resultadosRecetario.innerHTML += `
        <div class="resultado-receta">
          <strong>${comida.nombre}</strong>
          <p>Tenés todos los ingredientes.</p>
        </div>
      `;
    });
  }

  if (cercanos.length > 0) {
    resultadosRecetario.innerHTML += "<h3>Te faltan pocos ingredientes para preparar este plato</h3>";
    cercanos.forEach(comida => {
      resultadosRecetario.innerHTML += `
        <div class="resultado-receta">
          <strong>${comida.nombre}</strong>
          <p>Te faltan: ${comida.faltantes.join(", ")}</p>
        </div>
      `;
    });
  }
  if (posibles.length === 0 && cercanos.length === 0) {
    resultadosRecetario.innerHTML = "<p>No se encontraron platos con esos ingredientes.</p>";
  }
});