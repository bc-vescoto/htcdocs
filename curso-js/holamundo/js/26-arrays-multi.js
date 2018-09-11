'use strict'

// Array multidimensional

var categorias = ['Accion','Terror', 'Comedia'];
var peliculas = ['La verdad duele', 'La vida es bella', 'Gran torino'];

var cine = [categorias, peliculas];

console.log(cine);
console.log(cine[0][1]);
console.log(cine[1][2]);

/*
while(elemento != "ACABAR"){
  var elemento = prompt("Introduce tu pelicula:");
  peliculas.push(elemento)
}

peliculas.pop();
*/

var indice = peliculas.indexOf('Gran torino');
console.log(indice);

if (indice > -1) {
  peliculas.splice(indice, 1);
}

var peliculas_string = peliculas.join();

var cadena = "texto1, texto2, texto3";
var cadena_array = cadena.split(", ");

console.log(cadena);
console.log(cadena_array);
console.log(peliculas);
console.log(peliculas_string);

peliculas.sort();

console.log(peliculas);

peliculas.reverse();

console.log(peliculas);
