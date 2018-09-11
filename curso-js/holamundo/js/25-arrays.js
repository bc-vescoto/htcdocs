'use strict'

// Arrays

var nombre = "Victor Bistek";
var nombres = ["Victor", "Bistek", "Elvis"];

var lenguajes = new Array("PHP", "JS", "JAVA", "GO");
/*
var elemento = parseInt(prompt("Que elemento del array quieres??", 0));
if (elemento >= nombres.length) {
  alert("Introduce el numero correcto menor que " + nombres.length);
}else{
  alert("El usuario seleccionado es: "+nombres[elemento]);
}
alert(nombres[elemento]);
*/

console.log(nombres);
console.log(lenguajes);
console.log(nombres[2]);
console.log(nombres.length);

document.write("<h1>Lenguajes de programacion del 2018</h1>");
document.write("<ul>");

/*
for (var i = 0; i < lenguajes.length; i++) {
  document.write("<li>"+lenguajes[i]+"</li>");
}
*/

lenguajes.forEach((elemento, index, data)=>{
  console.log(data);
  document.write("<li>"+index+" - "+elemento+"</li>");
});
document.write("</ul>");
/*
for (let lenguaje in lenguajes) {
  document.write("<li>"+lenguajes[lenguaje]+"</li>");
}*/

// Busquedas
var precios = [10, 20, 50, 80, 12];

//var busqueda = lenguajes.find(lenguaje => lenguaje == "PHP");
var busqueda = precios.some(precio => precio >= 20);

console.log(busqueda);
