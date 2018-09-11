'use strict'

/*
Que nos diga si un numero es par o impar
1. Ventana prompt
2. Si no es valido que nos pida de nuevo el numero
*/

var numero = parseInt(prompt("Introduce un numero para determinar si es par o impar: "));

while (isNaN(numero) || numero <= 0) {
  numero = parseInt(prompt("Introduce un numero para determinar si es par o impar: "));
}

if ((numero%2)==0) {
  alert("El numero es par");
}else if((numero%2)!=0){
  alert("El numero es impar");
}
