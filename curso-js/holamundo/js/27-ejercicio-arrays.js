'use strict'

/*
1. Pida 6 numeros por pantalla y los meta en un arrays
2. Mostrar el array entero (todos sus elementos) en el cuerpo de la pagina y en
la consola
3. Ordenarlo y mostrarlo
4. Invertir su orden y mostrarlo
5. Mostrar cuantos elementos tiene el arrays
6.Busqueda de un valor introducido por el usuario, que nos diga si lo encuentra
y su indice (Se valorara el uso de funciones)
*/

// Pedir 6 numeros
var numeros = new Array(6);

for (var i = 0; i <= 5; i++) {
  numeros[i] = parseInt(prompt("Introduce un numero", 0));
}

// Mostrar array en la consola
console.log(numeros);

function mostrarArray(elementos, textoCustom = ""){
  // Mostrar array en la pagina
  document.write("<h1>Arreglo "+textoCustom+"</h1>");
  document.write("<ul>");
  for (let numero in numeros){
    document.write("<li>"+numeros[numero]+"</li>");
  }
  document.write("</ul>");
}

mostrarArray(numeros);

// Ordenar array
numeros.sort();
console.log(numeros);
mostrarArray(numeros, "Ordenado");
//Invertir array
numeros.reverse();
console.log(numeros);
mostrarArray(numeros, "Invertido");
//Mostrar el numero de elementos del array
console.log(numeros.length);


var busqueda = parseInt(prompt("Introduce un numero a buscar: ", 0));
var posicion = numeros.findIndex(numero => numero == busqueda);

if (posicion && posicion != -1 ) {
  console.log("Encontrado");
  console.log("Posicion de la busqueda: "+posicion);
}else {
  console.log("No encontrado");
}
