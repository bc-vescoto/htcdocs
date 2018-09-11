'use strict'

// DOM - Document Object Model

function cambiaColor(color){
  caja.style.background = color;
}

// Conseguir elementos con un ID concreto

//var caja = document.getElementById("micaja");
var caja = document.querySelector("#micaja");

caja.innerHTML = "TEXTO EN LA CAJA DESDE JS"
caja.style.background = "red";
caja.style.padding = "20px";
caja.style.color = "white";
caja.className = "hola";

// Conseguir elementos por su etiqueta
var todosLosDivs = document.getElementsByTagName('div');

var contenidoEnTexto = todosLosDivs[2];

console.log(contenidoEnTexto.textContent);

contenidoEnTexto.innerHTML = "Otro texto para el segundo elemento";
console.log(contenidoEnTexto);

console.log(todosLosDivs);

/*
todosLosDivs.forEach((valor, indice) => {
  var parrafo = document.createElemet("p");
  var texto = document.createTextNode(valor);
  parrafo.appendChild(texto);
  document.querySelector(#miseccion).appendChild(parrafo);

});
*/
var seccion = document.querySelector("#miseccion");
var hr = document.createElement("hr");

var valor;
for (valor in todosLosDivs) {
  if (typeof todosLosDivs[valor].textContent == 'string') {
    var parrafo = document.createElement("p");
    var texto = document.createTextNode(todosLosDivs[valor].textContent);
    parrafo.append(texto);
    seccion.append(parrafo);
  }
}
seccion.append(hr);
console.log(caja);
// Conseguir elementos por su clase css
var divsRojos = document.getElementsByClassName('rojo');
var divsAmarillos = document.getElementsByClassName('amarillo');

for (var div in divsRojos) {
  if (divsRojos[div].className == "rojo") {
    divsRojos[div].style.background = "red";
  }
}

for (var div in divsAmarillos) {
  if (divsAmarillos[div].className == "amarillo") {
    divsAmarillos[div].style.background = "yellow";
  }
}
console.log(divsRojos);

// Query selector
var id = document.querySelector("#encabezado");
console.log(id);

var claseRojo = document.querySelector("div.rojo");
console.log(claseRojo);

var claseAmarillo = document.querySelector("div.amarillo");
console.log(claseAmarillo);
