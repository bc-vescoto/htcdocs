"use strict";
exports.__esModule = true;
var camiseta_1 = require("./camiseta");
var Main = /** @class */ (function () {
    function Main() {
    }
    Main.prototype.constructior = function () {
        console.log("Aplicacion JS cargada");
    };
    Main.prototype.getCamiseta = function () {
        return new camiseta_1.CamisetaPriv("rojo", "manga larga", "nike", "l", 14);
    };
    return Main;
}());
var main = new Main();
