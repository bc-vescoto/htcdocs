'use strict'

// Pruebas con Let y var

var numero = 40; // valor 40

if (true) {
  var numero = 50;
  console.log(numero); // valor 50
}

console.log(numero); // valor 50

// Prueba con Let

var texto = "Curso JS Victor"
console.log(texto); // valor "

if (true) {
  let texto = "Curso Laravel";
  console.log(texto); // valor Laravel
}

console.log(texto); // valor js
