var player = jwplayer();

function resizePlayer() {
    if (player.getWidth() > 480) {
        player.resize(480, 270);
    } else {
        player.resize(640, 360);
    }
}