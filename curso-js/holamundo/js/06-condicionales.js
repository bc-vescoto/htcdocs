'use strict'

//Condicional IF
// Si A es igual a B haz algo

var edad1 = 30;
var edad2 = 12;
if (edad1 > edad2) {
  console.log("Edad uno es mayor que Edad dos");
}else {
  conole.log("Edad dos es mayor que Edad uno");
}

var edad = 18;
var nombre = "David Suarez";

if (edad >= 18) {
  console.log(nombre+" tiene "+edad+" a;os, es mayor de edad");
}else {
  console.log(nombre+" tiene "+edad+" a;os, es menor de edad");
}

/*
 // Operadores logicos
 AND: &&
 OR: ||
 Negacion: !

 */

var year = 2018;

// Negacion
if (year != 2016) {
  console.log("El a;o no es 2016 realmente es: "+year);
}

// AND
if (year >= 2000 && year <= 2020 &&year != 2018) {
  console.log("Estamos en la era actual");
}else {
  console.log("Estamos en la era post moderna");
}

// OR
if (year == 2008 || (year == 2018 && year == 2028)) {
  console.log("El a;o acaba en 8");
}else {
  console.log("A;O NO REGISTRADO");
}
