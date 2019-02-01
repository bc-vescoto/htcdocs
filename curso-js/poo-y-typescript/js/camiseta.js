// clase (Molde)
var Camiseta = /** @class */ (function () {
    function Camiseta() {
    }
    return Camiseta;
}());
// clase (Molde)
var CamisetaPriv = /** @class */ (function () {
    //  Metodos ( funciones o acciones del objeto )
    function CamisetaPriv(color, modelo, marca, talla, precio) {
        this.color = color;
        this.modelo = modelo;
        this.marca = marca;
        this.talla = talla;
        this.precio = precio;
    }
    CamisetaPriv.prototype.cambiarColor = function (color) {
        this.color = color;
    };
    CamisetaPriv.prototype.getColor = function () {
        return this.color;
    };
    return CamisetaPriv;
}());
var camiseta = new Camiseta();
camiseta.color = "Rojo";
camiseta.modelo = "Manga Larga";
camiseta.marca = "Nike";
camiseta.talla = "L";
camiseta.precio = 10;
var playera = new Camiseta();
playera.color = "Azul";
playera.modelo = "Manga Corta";
playera.marca = "Adidas";
playera.talla = "L";
playera.precio = 15;
var camisetaPriv = new CamisetaPriv("rojo", "manga larga", "nike", "l", 14);
camisetaPriv.cambiarColor("Rojo");
console.log(camiseta);
console.log(playera);
console.log(camisetaPriv);
