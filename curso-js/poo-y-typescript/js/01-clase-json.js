var bicicleta ={
  color: 'Rojo',
  modelo: 'BMX',
  frenos: 'De disco',
  velocidadMaxima: '60km',
  cambiaColor: function(nuevo_color){
    this.color = nuevo_color;
  }
};
console.log(bicicleta);

bicicleta.cambiaColor("Azul");

console.log(bicicleta);
