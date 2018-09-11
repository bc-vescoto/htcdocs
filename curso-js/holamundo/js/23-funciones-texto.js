'use strict'

// Transformacion de textos
var numero = 444;
var texto1 = "Bienvenido al curso de JavaScript de Victor";
var texto2 = "es muy buen curso";

var dato = numero.toString();
var datoLo = texto1.toLowerCase();
var datoUp = texto2.toUpperCase();

console.log(typeof dato);
console.log(datoLo);
console.log(datoUp);

// Calcular longitud
var nombre = "Victor";
var nombreArr = ["hola1", "hola2"];

console.log(nombre.length);
console.log(nombreArr.length);

//Concatenar - Unir textos

var textoTotal = texto1+ " " + texto2;

var textoConcat = texto1.concat(" "+texto2);

console.log(textoTotal);
console.log(textoConcat);
