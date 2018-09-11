'use strict'

/*
Mostrar todos los numeros impares que hay entre dos numeros
introducidos por el usuario
*/

var numero1 = parseInt(prompt("Introduce el primer numero", 0));
var numero2 = parseInt(prompt("Introduce el segundo numero", 0));

if (numero1 < numero2) {
  var num_menor = numero1;
  var num_mayor = numero2;
  document.write("<h1>De"+numero1+ " a "+numero2+" estan estos numeros:</h1>");
  for (var i = numero1; i <= numero2; i++) {
    if ((i%2) != 0) {
      document.write(i+"<br/>");
      console.log(i);
    }
  }
}

if (numero2 < numero1) {
  var num_menor = numero2;
  var num_mayor = numero1;
  document.write("<h1>De"+numero2+ " a "+numero1+" estan estos numeros:</h1>");
  for (var i = numero2; i <= numero1; i++) {
    if ((i%2) != 0) {
      document.write(i+"<br/>");
      console.log(i);
    }
  }
}
