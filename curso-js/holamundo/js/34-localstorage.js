'use strict'

// localstorage

//Comprobar disponibilidad del localstorage
if (typeof(Storage) !== 'undefined') {
  console.log("localstorage disponible");
}else {
  console.log("Incompatible con localstorage");
}

// Guardar datos
localStorage.setItem("titulo", "Curso de JS");

// Recuperar elemento
console.log(localStorage.getItem("titulo"));
document.querySelector("#peliculas").innerHTML = localStorage.getItem("titulo");

// Guardar Objetos
var usuario = {
  nombre: "Bistek",
  email: "bistek@corp.com",
  web: "elvis.com"
};

localStorage.setItem("usuario", JSON.stringify(usuario));

// Recuperar Objetos
console.log(localStorage.getItem("usuario"));

var userjs = JSON.parse(localStorage.getItem("usuario"));
console.log(userjs);
document.querySelector("#datos").append(userjs.web+" - "+userjs.nombre);

localStorage.removeItem("usuario");

localStorage.clear();
