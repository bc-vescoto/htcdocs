require.config({
  urlArgs: "bust=" + cacheBuster,
  baseUrl: "https://www.atpworldtour.com/assets/atpwt/scripts",
  waitSeconds: 1000,
  paths: {
    "jquery": "vendor/jquery.min",
    "jquery.migrate": "vendor/migrate",
    "jquery.mobile.events": "vendor/mobile.events",
    "jquery.royalslider": "vendor/jquery.royalslider",
    "backbone": "vendor/backbone-min",
    "underscore": "vendor/underscore-min",
    "htmlParser": "vendor/htmlParser",
    "postscribe": "vendor/postscribe.min",
    "isInViewport": "vendor/isInViewport.min",
    "waypoints": "vendor/jquery.waypoints",
    "waypoints-sticky": "vendor/waypoints-sticky.min",
    "chart": "vendor/Chart.min",
    "chart2": "vendor/Chart2.min",
    "signalr.min": "vendor/jquery.signalr-2.1.0.min",
    "zeroclipboard": "vendor/ZeroClipboard.min",
    "counterup": "vendor/jquery.counterup.min",
    "ooyalaApi": "vendor/ooyala-api",
    "jquery.cookie": "vendor/jquery.cookie",
    "breakpoints": "vendor/breakpoints",
    /*"ooyalaCore": "https://player.ooyala.com/static/v4/production/core.min",
    "ooyalaHtml5": "https://player.ooyala.com/static/v4/production/video-plugin/main_html5.min",
    "ooyalaHtml5Skin": "https://player.ooyala.com/static/v4/production/skin-plugin/html5-skin.min",
    "ooyalaBitWrapper": "https://player.ooyala.com/static/v4/production/video-plugin/bit_wrapper.min",*/
    "ooyalaCore": "https://player.ooyala.com/static/v4/stable/4.26.10/core.min",
    "ooyalaHtml5": "https://player.ooyala.com/static/v4/stable/4.26.10/video-plugin/main_html5.min",
    "ooyalaHtml5Skin": "https://player.ooyala.com/static/v4/stable/4.26.10/skin-plugin/html5-skin.min",
    "ooyalaBitWrapper": "https://player.ooyala.com/static/v4/stable/4.26.10/video-plugin/bit_wrapper.min",
    "getChantPoll": "vendor/getchant.polling",
    "axios": "vendor/axios.min",
    "vue": "vendor/vue",
    "vuex": "vendor/vuex",
    "vueRouter": "vendor/vue-router.min"
  },
  shim: {
    "jquery.migrate": {
      deps: ["jquery"]
    },
    "breakpoints": {
      deps: ["jquery"]
    },
    "jquery.mobile.events": {
      deps: ["jquery"]
    },
    "jquery.royalslider": {
      deps: ["jquery"]
    },
    "isInViewport": {
      deps: ["jquery"]
    },
    "waypoints-sticky": {
      deps: ["waypoints"]
    },
    "signalr.min": {
      deps: ["jquery"]
    },
    "counterup": {
      deps: ["waypoints"]
    },
    "jquery.cookie": {
      deps: ["jquery"]
    },
    "ooyalaBitWrapper": {
      deps: ["ooyalaCore"]
    },
    "ooyalaHtml5": {
      deps: ["ooyalaBitWrapper", "ooyalaHtml5Skin"]
    },
    "ooyalaHtml5Skin": {
      deps: ["ooyalaCore"]
    }
  }
});

require(["util/init"]);
