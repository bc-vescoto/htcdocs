'use strict'

/*
Programa que pida dos numeros y que nos diga cual es el mayor,
el menor y si son iguales.
PLUS: Si los numeros no son un numero o son menores o iguales a cero, nos los vuelva a pedir
*/

var numero1 = parseInt(prompt("Introduce el primer numero", 0));
var numero2 = parseInt(prompt("Introduce el segundo numero", 0));

console.log(numero1, numero2);

while (numero1 <= 0 || numero2 <= 0 || isNaN(numero1) || isNaN(numero2)) {
  numero1 = parseInt(prompt("Introduce el primer numero", 0));
  numero2 = parseInt(prompt("Introduce el segundo numero", 0));
}

if (numero1 > numero2) {
  console.log("El primer numero: "+ numero1 +" Es mayor al segundo numero: "+ numero2);
}else if (numero2 > numero1) {
  console.log("El segundo numero: "+ numero2 +" Es mayor al primer numero: "+ numero1);
}else if (numero1 == numero2) {
  console.log("El primer numero: "+ numero1 +" y el segundo numero: "+ numero2 +" son iguales.");
}else {
  alert("Introduce numeros correctos");
}
