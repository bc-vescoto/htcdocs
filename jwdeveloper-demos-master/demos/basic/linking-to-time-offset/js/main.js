var timeIntervalUrl = window.location.href + '#t=30';
var playerContainer = document.querySelector('.timeContainer');

function forceRefresh(){
  location.reload();
}

playerContainer.innerHTML = '<a href="' + timeIntervalUrl + '" onclick="forceRefresh()">Click here</a> to reload the page with a time offset of 30 seconds. The link simply appends #t=30 to the URL.'

var offset;
var shouldPlay;


if(window.location.hash) {
     offset = window.location.hash.substr(3);
     shouldPlay = true;
}

jwplayer().on('ready', function(event){
 if(shouldPlay === true){
   jwplayer().play();
 }
});

jwplayer().on('firstFrame', function() { 
jwplayer().seek(offset)
});