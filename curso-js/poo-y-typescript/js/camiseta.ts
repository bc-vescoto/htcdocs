// clase (Molde)
class Camiseta{
  // Propiedades (caracteristicas del objeto)
  public color: string;
  public modelo: string;
  public marca: string;
  public talla: string;
  public precio: number;

  //  Metodos ( funciones o acciones del objeto )

}

// clase (Molde)
class CamisetaPriv{
  // Propiedades (caracteristicas del objeto)
  private color: string;
  private modelo: string;
  private marca: string;
  private talla: string;
  private precio: number;

  //  Metodos ( funciones o acciones del objeto )
  constructor(color, modelo, marca, talla, precio){
    this.color = color;
    this.modelo = modelo;
    this.marca = marca;
    this.talla = talla;
    this.precio = precio;
  }
  public cambiarColor(color){
    this.color = color;
  }

  public getColor(){
    return this.color;
  }
}

var camiseta = new Camiseta();

camiseta.color  = "Rojo";
camiseta.modelo = "Manga Larga";
camiseta.marca = "Nike";
camiseta.talla = "L";
camiseta.precio = 10;

var playera = new Camiseta();

playera.color  = "Azul";
playera.modelo = "Manga Corta";
playera.marca = "Adidas";
playera.talla = "L";
playera.precio = 15;

var camisetaPriv = new CamisetaPriv("rojo", "manga larga", "nike", "l", 14);
camisetaPriv.cambiarColor("Rojo");

console.log(camiseta);
console.log(playera);
console.log(camisetaPriv)
