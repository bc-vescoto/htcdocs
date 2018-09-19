'use strict'

$(document).ready(function(){

  // selector de ID
  var rojo = $("#rojo").css("background", "red")
                       .css("color", "white");
  console.log(rojo);

  var amarillo = $("#amarillo").css("background", "yellow")
                               .css("color", "green");

  var verde = $("#verde").css("background", "green")
                         .css("color", "white");

  // Selectores de clases
  var mi_clase = $(".zebra").css("padding", "5px");

  //mi_clase.css("border", "5px dashed black");

  console.log(mi_clase.eq(0));

  $('.sin_borde').click(function(){
    console.log("Click dado");
    $(this).addClass('zebra');
  });

  // Selectores de etiqueta
  var parrafos = $('p');

  parrafos.click(function(){
    var that = $(this).css("cursor", "pointer");

    if(!that.hasClass('grande')){
      that.addClass('grande');
    }else {
      that.removeClass('grande');
    }
  });

  // Selector por atributo
  $('[title="Google"]').css('background', '#ccc');
  $('[title="Facebook"]').css('background', 'blue');

  // Otros
  //$('p, a').addClass('margen-superior');

  var busqueda = $('.caja').find('.resaltado');
  console.log(busqueda);

  var busqueda2 = $('.caja .resaltado').eq(0).parent().parent().parent().find('[title="Google"]');
  console.log(busqueda2);
});
