/*
    Cargar comidas en memoria desde el JSON
*/
fetch('./data/comidas.json')          // Ruta al archivo JSON
  .then(response => response.json())  // Convertir la respuesta en JSON
  .then(data => {                     // Aquí tienes acceso al JSON en formato de objeto JS
    comidas = data;        
    mostrarComidas(comidas);
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
        <button class="borrar" value="${comida.nombre}">Borrar comida</button>
      </article>
    `;
  });
  actualizarBotones();
}

mostrarComidas(comidas);

const agregarComida = document.getElementById("comidaForm");

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
    agregarComida.reset()
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
    });
  });
};