'use strict'

// Fetch (ajax) y peticiones a servicios / apis rest

var div_usuarios = document.querySelector("#usuarios");
var div_profesor = document.querySelector("#profesor");
var div_usuario = document.querySelector("#usuario");
//var usuarios = [];

getUsuarios()
  .then(data => data.json())
  .then(users => {
    //usuarios = users.data;
    console.log(usuarios);
    listadoUsuarios(users.data);

    return getInfo();
/*
    usuarios.map((users, i) => {
      let nombre = document.createElement('h3');
      nombre.innerHTML = i + " " +users.first_name + " " + users.last_name;
      div_usuarios.appendChild(nombre);
      document.querySelector(".loading").style.display = 'none';
    });*/
  })
  .then(data => {
    div_profesor.innerHTML = data;
    console.log(data);

    return getUsuario();
  })
  .then(data => data.json())
  .then(user => {
    mostrarUsuario(user.data);
  })
  .catch(error => {
    console.log(error);
  });


function getUsuarios(){
  return fetch('https://reqres.in/api/users');
}

function getUsuario(){
  return fetch('https://reqres.in/api/users/2');
}

function getInfo(){

  var profesor = {
    nombre: 'Victor',
    apellidos: 'Robles',
    url: 'https://victorroblesweb.es'
  };

  return new Promise((resolve, reject) =>{
    var profesor_string = "";

    setTimeout(function(){
      profesor_string = JSON.stringify(profesor);

      if (typeof profesor_string != 'string' || profesor_string == '') {
        return reject('error');
      }

      return resolve(profesor_string);
    }, 3000);

  });
}

function listadoUsuarios(usuarios){
  usuarios.map((user, i) => {
    let nombre = document.createElement('h3');
    nombre.innerHTML = i + " " +user.first_name + " " + user.last_name;
    div_usuarios.appendChild(nombre);
    document.querySelector(".loading").style.display = 'none';
  });
};

function mostrarUsuario(user){
  console.log(user);
  let nombre = document.createElement('h4');
  let avatar = document.createElement('img');

  nombre.innerHTML = user.first_name + " " + user.last_name;
  avatar.src = user.avatar;
  avatar.width = '100';

  div_usuario.appendChild(nombre);
  div_usuario.appendChild(avatar);
  document.querySelector("#usuario .loading").style.display = 'none';
};
