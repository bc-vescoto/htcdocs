import {CamisetaPriv} from './camiseta'

class Main{
  constructior(){
    console.log("Aplicacion JS cargada");
  }
  getCamiseta(){
    return new CamisetaPriv("rojo", "manga larga", "nike", "l", 14);
  }
}

var main = new Main();
