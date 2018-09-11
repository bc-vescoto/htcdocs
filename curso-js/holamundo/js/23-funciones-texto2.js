'use strict'

// Transformacion de textos
var numero = 444;
var texto1 = "Bienvenido al curso de JavaScript";
var texto2 = "Es muy buen curso";

var busqueda = texto1.indexOf("curso");
var busqueda2 = texto1.lastIndexOf("curso");
var search = texto1.search("curso");
var matchTest = texto1.match(/curso/g);
var substrTest = text1.substr(14,5);
var busquedaChar = texto1.charAt(44);
var busquedaStart = texto1.startsWith("Bi");
var busquedaIncl = texto1.includes("JavaScript");
var busquedaReplace = texto1.replace("JavaScript", "Python");
var busquedaSlice = texto1.slice(14, 22);
var busquedaSplit = texto1.split(" ");
var busquedaTrim = texto1.trim();

console.log(busqueda);
console.log(busqueda2);
console.log(search);
console.log(substrTest);
console.log(busquedaChar);
console.log(busquedaStart);
console.log(busquedaIncl);
console.log(busquedaReplace);
console.log(busquedaSlice);
console.log(busquedaSplit);
console.log(busquedaTrim);
