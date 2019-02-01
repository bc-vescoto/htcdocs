type alfanumerico = string | number;

// string
let cadena: alfanumerico = "Victor Bistek";

// number

let number: number = 12;

// Boolean
let verdadero_falso: boolean = true;

// Any

let cualquiera: any = "hola";

// Arrays
var lenguajes: Array<string> = ["PHP", "JS", "CSS"];

let years: number[] = [12,13,14];

// Let vs verdadero_falso
var numero1 = 10;
var numero2 = 12;

if (numero1 == 10){
  let numero1 = 44;
  var numero2 = 55;

  console.log(numero1, numero2);
}

console.log(numero1, numero2);

console.log(cadena, number, verdadero_falso, cualquiera, lenguajes, years);
