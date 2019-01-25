$(document).ready(function(){
  var caja = $("#caja");
  console.log(caja);

  //$("#mostrar").hide();
  $("#ocultar").hide();

  $("#mostrar").click(function(){
    $(this).hide();
    //$("#caja").show('normal');
    //$("#caja").fadeIn('normal');
    caja.fadeTo('slow', 1);
    $("#ocultar").show();
  });

  $("#ocultar").click(function(){
    $(this).hide();
    //$("#caja").hide('normal');
    //$("#caja").fadeOut('normal');
    caja.slideUp('slow', function(){
      console.log("Cartel ocultado");
    });
    $("#mostrar").show();
  });

  $("#todoenuno").click(function(){
    caja.fadeToggle('fast');
  })

  $("#animame").click(function(){
    caja.animate({
      marginLeft: '500px',
      fontSize: '40px',
      height: '110px'
    }, 'slow')
    .animate({
      borderRadius: '900px',
      marginTop: '80px'
    }, 'slow')
    .animate({
      borderRadius: '0px',
      marginLeft: '0px'
    }, 'slow')
    .animate({
      borderRadius: '100px',
      marginTop: '0px'
    }, 'slow')
    .animate({
      marginLeft: '500px',
      fontSize: '40px',
      height: '110px'
    }, 'slow');
  });
});
