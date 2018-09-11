var player1 = jwplayer("player1");
var player2 = jwplayer("player2");
var player3 = jwplayer("player3");

// When a player size is set to a fixed height of 40px, the player will enter audio mode.

player1.setup({
  file: "//content.jwplatform.com/videos/1b02B03R-g8UjtXW6.m4a",
});

player2.setup({
  file: "//content.jwplatform.com/videos/kbs0WLBI-g8UjtXW6.m4a",
});

player3.setup({
  file: "//content.jwplatform.com/videos/KJKBQC7h-g8UjtXW6.m4a",
});

player1.on('play', function() {
  pausePlayers(1);
});

player2.on('play', function() {
  pausePlayers(2);
});

player3.on('play', function() {
  pausePlayers(3);
});

function pausePlayers(playing) {
  for (var i = 1; i < 4; i++) {
   if (i != playing) {
     jwplayer("player" + i).pause(true);
   }
  }
};
