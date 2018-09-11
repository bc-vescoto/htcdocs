'use strict'

// Fetch (ajax) y peticiones a servicios / apis rest

var div_usuarios = document.querySelector("#usuarios");
var usuarios = [];

fetch('https://api.ooyala.com/v2/players?expires=1536338212&signature=mQsrwwu0dTwzN652X67OXl6HNsYKP%2Bemsi0zUq0WJ%2F8&api_key=NuZ2MyOnXVD0abcUYy8uaxOhX085.tFGSl')
  .then(data => data.json())
  .then(users => {
    usuarios = users.data;
    console.log(usuarios);

    usuarios.map((users, i) => {
      let nombre = document.createElement('h2');
      nombre.innerHTML = i + " " +users.first_name + " " + users.last_name;
      div_usuarios.appendChild(nombre);

      document.querySelector(".loading").style.display = 'none';
    });
  });
