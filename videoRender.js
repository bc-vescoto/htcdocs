function urlDecode(){var e=window.location.href;e=e.replace(location.protocol+"//","").replace(location.hostname+"/","");return e}
function track(e,t){if(t===undefined){t=urlDecode()} ga('adb.send', 'event', 'Botones ooyala', e, t);}

OO.ready(function() {
    window.pp = OO.Player.create('videoRender', idVideo, {
        "pcode": "ExNG0yOnRifgmMP7XkFSmqPU8KiH",
        "playerBrandingId": "a5a950cbb70d4c208f14b342639ea1d9",
        //"autoplay": true,
        "iosPlayMode":"inline",
        "skin": {
            // Config contains the configuration setting for player skin. Change to your local config when necessary.
            "config": "/skinAme.json"
        },
        "google-ima-ads-manager": {
            "enableIosSkippableAds":true,
            "all_ads": [{
                "tag_url": googleIma
            }]
        },
        "ComScoreOoyalaPlugin":{
            "c2": "17731404", // Replace with your comScore Client ID value.
            "labelmapping": "c3=\"AMERICAENTRETENIMIENTO\", c4=\"*null\", c6=\"*null\", ns_st_st=\"América Entretenimiento\",ns_st_pu=\"América Televisión\", ns_st_pr=\""+metadata.ns_st_pr+"\", ns_st_ep=\"*null\",ns_st_sn=\"*null\",ns_st_en=\"*null\", ns_st_ge=\"Ven Baila Quinceañera, De Vuelta Al Barrio, La Banda Del Chino, Esto Es Guerra, El Reventonazo De La Chola, cumbia pop, en boca de todos, colorina\",ns_st_ti=\"*null\", ns_st_ia=\"0\", ns_st_ce=\"*null\",ns_st_ddt=\""+metadata.ns_st_ddt+"\", ns_st_tdt=\"*null\""
        },
        onCreate: onCreate
    });
});
/***/
function onCreate(player) {
    var videoStarted = false;
    var t25per = false;
    var t50per = false;
    var t75per = false;
    var t100per = false;
    var videoEnded = false;
    var publicidad = false;
    var adpause = false;
    player.mb.subscribe(OO.EVENTS.PLAYHEAD_TIME_CHANGED, "page", function(e, t, n) {
        if (n > 0) {
            var r = 1 * (n / 4);
            var i = 2 * (n / 4);
            var s = 3 * (n / 4);
            var p = 4 * (n / 4) - 1;
            if (t < 0) {
                cls.style.display = "none";
            } else if (t > p && !t100per){
                t25per = true;
                t50per = true;
                t75per = true;
                t100per = true;
                track("100% de reproduccion")
            } else if (t > s && !t75per) {
                t25per = true;
                t50per = true;
                t75per = true;
                track("75% de reproduccion")
            } else if (t > i && !t50per) {
                t25per = true;
                t50per = true;
                track("50% de reproduccion")
            } else if (t > r && !t25per) { //t = 852
                t25per = true;
                track("25% de reproduccion")
            }
        }
    });
    player.mb.subscribe("bitrateChanged", "page", function(e, t) {
        track("bitrate", t.bitrate)
    });
    player.mb.subscribe(OO.EVENTS.ERROR,'page', function(event, type) {
        //Namespaces Error
        if(type.code === OO.ERROR.UNPLAYABLE_CONTENT){
            track("videoError", 'OO.ERROR.UNPLAYABLE_CONTENT')
        }
        if(type.code === OO.ERROR.INVALID_EXTERNAL_ID){
            track("videoError", 'OO.ERROR.INVALID_EXTERNAL_ID')
        }
        if(type.code === OO.ERROR.EMPTY_CHANNEL){
            track("videoError", 'OO.ERROR.EMPTY_CHANNEL')
        }
        if(type.code === OO.ERROR.EMPTY_CHANNEL_SET){
            track("videoError", 'OO.ERROR.EMPTY_CHANNEL_SET')
        }
        if(type.code === OO.ERROR.CHANNEL_CONTENT){
            track("videoError", 'OO.ERROR.CHANNEL_CONTENT')
        }
        //End Namespaces error
        //Namespaces Api
        if(type.code === OO.ERROR.API.NETWORK){
            track("videoError", 'OO.ERROR.API.NETWORK')
        }
        if(type.code === OO.ERROR.API.CONTENT_TREE){
            track("videoError", 'OO.ERROR.API.CONTENT_TREE')
        }
        if(type.code === OO.ERROR.API.METADATA){
            track("videoError", 'OO.ERROR.API.METADATA')
        }
        //End Namespaces api
        //Namespaces Api Sas
        if(type.code === OO.ERROR.API.SAS.GENERIC){
            track("videoError", 'OO.ERROR.API.SAS.GENERIC')
        }
        if(type.code === OO.ERROR.API.SAS.GEO){
            track("videoError", 'OO.ERROR.API.SAS.GEO')
        }
        if(type.code === OO.ERROR.API.SAS.DOMAIN){
            track("videoError", 'OO.ERROR.API.SAS.DOMAIN')
        }
        if(type.code === OO.ERROR.API.SAS.FUTURE){
            track("videoError", 'OO.ERROR.API.SAS.FUTURE')
        }
        if(type.code === OO.ERROR.API.SAS.PAST){
            track("videoError", 'OO.ERROR.API.SAS.PAST')
        }
        if(type.code === OO.ERROR.API.SAS.DEVICE){
            track("videoError", 'OO.ERROR.API.SAS.DEVICE')
        }
        if(type.code === OO.ERROR.API.SAS.PROXY){
            track("videoError", 'OO.ERROR.API.SAS.PROXY')
        }
        if(type.code === OO.ERROR.API.SAS.CONCURRENT_STREAM){
            track("videoError", 'OO.ERROR.API.SAS.CONCURRENT_STREAM')
        }
        if(type.code === OO.ERROR.API.SAS.INVALID_HEARTBEAT){
            track("videoError", 'OO.ERROR.API.SAS.INVALID_HEARTBEAT')
        }
        if(type.code === OO.ERROR.API.SAS.ERROR_DEVICE_INVALID_AUTH_TOKEN){
            track("videoError", 'OO.ERROR.API.SAS.ERROR_DEVICE_INVALID_AUTH_TOKEN')
        }
        if(type.code === OO.ERROR.API.SAS.ERROR_DEVICE_LIMIT_REACHED){
            track("videoError", 'OO.ERROR.API.SAS.ERROR_DEVICE_LIMIT_REACHED')
        }
        if(type.code === OO.ERROR.API.SAS.ERROR_DEVICE_BINDING_FAILED){
            track("videoError", 'OO.ERROR.API.SAS.ERROR_DEVICE_BINDING_FAILED')
        }
        if(type.code === OO.ERROR.API.SAS.ERROR_DEVICE_ID_TOO_LONG){
            track("videoError", 'OO.ERROR.API.SAS.ERROR_DEVICE_ID_TOO_LONG')
        }
        if(type.code === OO.ERROR.API.SAS.ERROR_DRM_RIGHTS_SERVER_ERROR){
            track("videoError", 'OO.ERROR.API.SAS.ERROR_DRM_RIGHTS_SERVER_ERROR')
        }
        if(type.code === OO.ERROR.API.SAS.ERROR_DRM_GENERAL_FAILURE){
            track("videoError", 'OO.ERROR.API.SAS.ERROR_DRM_GENERAL_FAILURE')
        }
        if(type.code === OO.ERROR.API.SAS.ERROR_INVALID_ENTITLEMENTS){
            track("videoError", 'OO.ERROR.API.SAS.ERROR_INVALID_ENTITLEMENTS')
        }
        //End Namespaces api sas
        //Namespaces PLAYBACK
        if(type.code === OO.ERROR.PLAYBACK.GENERIC){
            track("videoError", 'OO.ERROR.PLAYBACK.GENERIC')
        }
        if(type.code === OO.ERROR.PLAYBACK.STREAM){
            track("videoError", 'OO.ERROR.PLAYBACK.STREAM')
        }
        if(type.code === OO.ERROR.PLAYBACK.LIVESTREAM){
            track("videoError", 'OO.ERROR.PLAYBACK.LIVESTREAM')
        }
        if(type.code === OO.ERROR.PLAYBACK.NETWORK){
            track("videoError", 'OO.ERROR.PLAYBACK.NETWORK')
        }
        //End Namespaces PLAYBACK
    });
    player.mb.subscribe(OO.EVENTS.PLAYING, "page", function() {
        if (!videoStarted) {
            videoStarted = true;
            if (videoEnded) {
                track("replay");
            } else {
                track("reproduccion");
                streamingAnalytics.playVideoContentPart(metadata,ns_.ReducedRequirementsStreamingAnalytics.ContentTypeContentType.LongFormOnDemandLongFormOnDemand);
            }
        } else if (videoStarted) {
            track("resume");
            streamingAnalytics.playVideoContentPart(metadata,ns_.ReducedRequirementsStreamingAnalytics.ContentTypeContentType.LongFormOnDemandLongFormOnDemand);
        }
    });
    player.mb.subscribe(OO.EVENTS.PAUSED, "page", function() {
        if (publicidad) {
            if (adpause) {
                adpause = false;
            } else {
                adpause = true;
            }
        }
        if (videoStarted) {
            track("pause");
            streamingAnalytics.stop();
        }
    });
    player.mb.subscribe(OO.EVENTS.PLAYED, "page", function() {
        t25per = false;
        t50per = false;
        t75per = false;
        t100per = false;
        videoStarted = false;
        videoEnded = true;
    });
    player.mb.subscribe(OO.EVENTS.ADS_PLAYED, "page", function() {
        publicidad = false;
        cls.style.display = "none";
    });
    player.mb.subscribe('*', 'page', function(eventName) {
        if (eventName == 'adsClicked') {
            //track("Click en publicidad");
        }
        if(eventName == 'reportDiscoveryClick'){
            if (!videoStarted) {
                videoStarted = true;
                if (videoEnded) {
                    track("reproduccion-discovery");
                } else {
                    //console.log("Click discovery = reproduccion");
                }
            } else if (videoStarted) {
                track("reproduccion-discovery");
            }
        }
    });
}