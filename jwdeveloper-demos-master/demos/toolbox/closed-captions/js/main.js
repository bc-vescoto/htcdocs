jwplayer("player").setup({
    file: 'https://wowzaec2demo.streamlock.net/vod-multitrack/_definst_/smil:ElephantsDream/elephantsdream2.smil/playlist.m3u8',

    type: 'hls',
        hlslabels: {
        "415": "128p",
        "515": "160p",
        "650": "208p",
        "881":"252p",
        "1200":"332p",
        "1600": "432p",
        "2300": "560p",
        "3200":"720p"
        }
    });