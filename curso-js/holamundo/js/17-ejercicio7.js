'use strict'

/*
Tabla de multiplicar de un numero introducido por pantalla
*/

var numero = parseInt(prompt("Introduce un numero para saber su tabla de multiplicar"), 1);

while (isNaN(numero) || numero <= 0) {
  numero = parseInt(prompt("Introduce un numero para saber su tabla de multiplicar"));
}

document.write("<h1>Tabla del "+numero+"</h1>")
for (var i = 1; i <= 10; i++) {
  console.log(numero*i);
  document.write(i+" x "+numero+" = "+(i*numero)"<br/>");
}
