function load_noticias(e, t, n, o) {
    return contCall > 2 ? (location.href = $(e).data("urlbuscamas") + "buscar", !1) : ($("#loading").show(), $("#loading").attr({
        style: "display: inline-block;"
    }), $.ajax({
        type: "GET",
        url: $(e).attr("href"),
        data: {
            last: t,
            length: n,
            seccion: o
        },
        dataType: "json",
        success: function(e) {
            e.empty ? $(".cnt_foto_videos").children().last().remove() : (contCall++, $(".cnt_foto_videos").children().last().remove(), $(".cnt_foto_videos").append(e.flujo_noticia_last), setTimeout(function() {
                $.fn.matchHeight._apply(".contenedor_all_grid .white_ae_all")
            }, 300)), $("#loading").hide()
        }
    }), !1)
}

function sticky_relocate() {
    var e = $(window).scrollTop(),
        t = $("#sticky-anchor").offset().top;
    e > t ? $(".nav_permanente").show() : $(".nav_permanente").hide()
}
var contCall = 2;
$(function() {
    $("#sticky-anchor").length > 0 && ($(window).scroll(sticky_relocate), sticky_relocate())
});
var accordion = function() {
    function e(e) {
        this.nm = e, this.arr = []
    }

    function t(e, t) {
        e.tm = setInterval(function() {
            n(e, t)
        }, o)
    }

    function n(e, t) {
        var n = e.offsetHeight,
            o = e.mh,
            a = 1 == t ? o - n : n;
        e.style.height = n + Math.ceil(a / sp) * t + "px", e.style.opacity = n / o, e.style.filter = "alpha(opacity=" + 100 * n / o + ")", 1 == t && n >= o ? clearInterval(e.tm) : 1 != t && 1 == n && (e.style.display = "none", clearInterval(e.tm))
    }
    var o = sp = 10;
    return e.prototype.init = function(e, t, n) {
        var o, a, i, r, l;
        for (o = document.getElementById(e), this.sl = n ? n : "", a = o.getElementsByTagName("dt"), i = o.getElementsByTagName("dd"), this.l = a.length, l = 0; l < this.l; l++) {
            var c = a[l];
            this.arr[l] = c, c.onclick = new Function(this.nm + ".pro(this)"), t == l && (c.className = this.sl)
        }
        for (r = i.length, l = 0; l < r; l++) {
            var c = i[l];
            c.mh = c.offsetHeight, t != l && (c.style.height = 0, c.style.display = "none")
        }
    }, e.prototype.pro = function(e) {
        for (var n = 0; n < this.l; n++) {
            var o = this.arr[n],
                a = o.nextSibling;
            a = 1 != a.nodeType ? a.nextSibling : a, clearInterval(a.tm), o == e && "none" == a.style.display ? (a.style.display = "", t(a, 1), o.className = this.sl) : "" == a.style.display && (t(a, -1), o.className = "")
        }
    }, {
        slider: e
    }
}();
if ($("#accordion").length > 0) {
    var slider1 = new accordion.slider("slider1");
    slider1.init("slider", 0, "open")
}
aeObj = {
    init: function() {
        aeObj.loadMasLeidas(), null != document.getElementById("ooyalaplayer") && aeObj.videoRender()
    },
    sidebarFull: function() {
        $(".sidebarFull").stickit({
            screenMinWidth: 960
        })
    },
    lazyload: function() {
        new Blazy
    },
    bannerHome: function() {
        $(".flexslider-custom-home").flexslider({
            animation: "fade",
            easing: "swing",
            directionNav: !0,
            controlNav: !0,
            slideshow: !0,
            start: function(e) {
                $("body").removeClass("loading"), $(".flex-next").click(function() {
                    var e = $("li:has(.flex-active)").index(".flex-control-nav li") + 1;
                    ga("new.send", "event", "SliderHome", "Next", e)
                }), $(".flex-prev").click(function() {
                    var e = $("li:has(.flex-active)").index(".flex-control-nav li") + 1;
                    ga("new.send", "event", "SliderHome", "Prev", e)
                }), $(".flex-control-nav li a").click(function() {
                    var e = $("li:has(.flex-active)").index(".flex-control-nav li") + 1;
                    ga("new.send", "event", "SliderHome", "Paginador", e)
                })
            }
        })
    },
    videosVistos: function() {
        function e(e) {
            this.$owlItems.removeClass("active"), this.$owlItems.eq(this.currentItem).addClass("active")
        }
        var t = $("#galeria_video");
        t.owlCarousel({
            navigation: !1,
            slideSpeed: 300,
            paginationSpeed: 400,
            singleItem: !0,
            autoHeight: !0,
            afterAction: e,
            afterMove: function() {
                var e = $("#galeria_video .owl-item.active .item").attr("data-url"),
                    t = $("#galeria_video .owl-item.active .item").attr("data-title");
                $("#title_all_v").html(t), $("#galeria_video").next(".btn").attr("href", e)
            }
        }), $(".next_v").click(function(e) {
            e.preventDefault(), t.trigger("owl.next")
        }), $(".prev_v").click(function(e) {
            e.preventDefault(), t.trigger("owl.prev")
        })
    },
    fotosVistos: function() {
        function e(e) {
            this.$owlItems.removeClass("active"), this.$owlItems.eq(this.currentItem).addClass("active")
        }
        var t = $("#galeria_foto");
        t.owlCarousel({
            navigation: !1,
            slideSpeed: 300,
            paginationSpeed: 400,
            singleItem: !0,
            autoHeight: !0,
            afterAction: e,
            afterMove: function() {
                var e = $("#galeria_foto .owl-item.active .item").attr("data-url"),
                    t = $("#galeria_foto .owl-item.active .item").attr("data-title");
                $("#title_all_g").html(t), $("#galeria_foto").next(".btn").attr("href", e)
            }
        }), $(".next_v_g").click(function(e) {
            e.preventDefault(), t.trigger("owl.next")
        }), $(".prev_v_g").click(function(e) {
            e.preventDefault(), t.trigger("owl.prev")
        })
    },
    galeriaFotos: function() {
        function e(e) {
            var t = this.currentItem;
            $("#gallery-owl").find(".owl-item").removeClass("synced").eq(t).addClass("synced");
            var n = $("#gallery-owl .owl-item.synced .item").data("num"),
                o = $("#gallery-owl .owl-item.synced .item .info-g").html();
            $(".current-slide").empty(), $(".info-gallery p").empty(), $(".current-slide").append(n), $(".info-gallery p").append(o)
        }
        $("#gallery-owl").owlCarousel({
            navigation: !0,
            slideSpeed: 300,
            pagination: !1,
            singleItem: !0,
            autoHeight: !0,
            afterAction: e
        })
    },
    f_popup: function(e, t) {
        t.preventDefault ? t.preventDefault() : t.returnValue = !1;
        window.open(e.getAttribute("href"), "gec_popup", "width=500,height=450,menubar=no,status=no,location=no,toolbar=no,scrollbars=yes,directories=no")
    },
    f_slider_programa_one: function() {
        var e = 0;
        if ($("div.cont_active_pro").hasClass("cont_active_pro")) {
            var e = $("#prodiariaslider").children().index($("div.cont_active_pro")[0]);
            e = e > 2 ? e - 2 : e
        }
        $("#prodiariaslider").length > 0 && (console.log(e), $("#prodiariaslider").bxSlider({
            nextSelector: "#slider-next",
            prevSelector: "#slider-prev",
            slideWidth: 216,
            minSlides: 4,
            maxSlides: 4,
            moveSlides: 1,
            slideMargin: 28,
            startSlide: e,
            pager: !1
        }))
    },
    f_socialRequest: function(e) {
        var t = $(e),
            n = t.data("count"),
            o = function(e) {
                e.hasClass("fb") ? $.ajax({
                    url: "http://graph.facebook.com/?id=" + n,
                    dataType: "jsonp",
                    success: function(t) {
                        var n = 0;
                        t.shares && (n = t.shares), n > 0 && e.parent().addClass("count"), e.find(".count_impresa").html(n)
                    }
                }) : e.hasClass("twitter") || e.hasClass("tw") ? $.ajax({
                    url: "http://urls.api.twitter.com/1/urls/count.json?url=" + encodeURIComponent(n),
                    dataType: "jsonp",
                    success: function(t) {
                        t.count > 0 && e.parent().addClass("count"), e.find(".count_impresa").html(t.count)
                    }
                }) : (e.hasClass("gplus") || e.hasClass("gp")) && $.ajax({
                    url: dominio + "socialnetwork/shared_google",
                    data: {
                        url: n
                    },
                    type: "GET",
                    dataType: "json",
                    success: function(t) {
                        t.count > 0 && e.parent().addClass("count"), e.find(".count_impresa").html(t.count)
                    }
                })
            };
        t.data("done") || (t.data("done", !0), t.find(".social").each(function() {
            o($(this))
        }))
    },
    fixed_h: function() {
        $(".colfix_ae").fixTo("#box-main-fixed")
    },
    validate_form_e: function() {
        $("#datoscasting").validate({
            rules: {
                nombre: "required",
                edad: {
                    required: !0
                },
                deporte: {
                    required: !0
                },
                email: {
                    required: !0,
                    email: !0
                },
                estudio: {
                    required: !0
                },
                userfile: {
                    required: !0
                },
                userfile2: {
                    required: !0
                },
                userk: {
                    required: !0
                }
            },
            messages: {
                nombre: "Ingrese su nombre completo",
                edad: {
                    required: "Ingrese su edad y talla"
                },
                deporte: {
                    required: "Ingrese el deporte que practica"
                },
                email: {
                    required: "Ingrese su correo electrónico",
                    email: "Ingrese un correo electrónico valido"
                },
                estudio: {
                    required: "Ingrese su nivel de estudio"
                },
                userfile: {
                    required: "Sube una foto"
                },
                userfile2: {
                    required: "Sube una foto"
                },
                userk: {
                    required: "hola"
                }
            },
            submitHandler: function(e) {
                e.submit()
            }
        })
    },
    scrollInfinite: function() {
        var e = 1,
            t = $.ias({
                container: ".content_list_ul",
                item: ".space_box_25",
                pagination: "#pagination",
                next: ".next a"
            }).on("rendered", function() {
                var t = $("#pagination").data("category");
                ga("new.send", "event", t, "scroll", e), aeObj.lazyload(), e++
            });
        t.extension(new IASSpinnerExtension), t.extension(new IASNoneLeftExtension({
            text: ""
        }))
    },
    sliderRelacionado: function() {
        var e = $("#owl-relacionados");
        e.owlCarousel({
            items: 3,
            navigation: !1,
            pagination: !1,
            itemsDesktop: !1,
            itemsDesktopSmall: !1,
            itemsTablet: !1,
            itemsMobile: !1
        }), $(".next_v_r").click(function(t) {
            t.preventDefault(), e.trigger("owl.next")
        }), $(".prev_v_r").click(function(t) {
            t.preventDefault(), e.trigger("owl.prev")
        })
    },
    timeMask: function() {
        $(".timeMask").mask("00/00/0000", {
            placeholder: "dd/mm/yyyy"
        })
    },
    sharedCorreo: function() {
        $("li.f-ms a").on("click", function(e) {
            e.preventDefault(), $(this).parents(".f-ms").find(".box_sendfriend").css("display", "block")
        }), $("input#box_sendfriend_cancel").click(function() {
            return $(this).parents(".f-ms").find(".box_sendfriend").css("display", "none"), !1
        }), $("#Form_SendFriend1, #Form_SendFriend2").submit(function(e) {
            e.preventDefault(), $("span.msg-form").html(""), $.ajax({
                type: "POST",
                url: dominio + "send-mail-friend",
                data: $(this).serialize(),
                success: function(e) {
                    $("span.msg-form").html(e)
                }
            })
        })
    },
    showBtnEncuesta: function() {
        $("#aTerCon").is(":checked") ? ($(".btnformencNew").removeClass("disabled"), $(".btnformencNew").attr("disabled", !1)) : ($(".btnformencNew").addClass("disabled"), $(".btnformencNew").attr("disabled", !0)), $("#aTerCon").change(function() {
            this.checked ? ($(".btnformencNew").removeClass("disabled"), $(".btnformencNew").attr("disabled", !1)) : ($(".btnformencNew").addClass("disabled"), $(".btnformencNew").attr("disabled", !0))
        })
    },
    videoRender: function() {
        function e() {
            var e = window.location.href;
            return e = e.replace(location.protocol + "//", "").replace(location.hostname + "/", "")
        }

        function t(t, n) {
            void 0 === n && (n = e()), ga("adb.send", "event", "Botones ooyala", t, n)
        }

        function n(t, n) {
            void 0 === n && (n = e()), ga("bPublicidad.send", "event", "Botones ooyala", t, n)
        }

        function o(e) {
            var o = !1,
                a = !1,
                i = !1,
                r = !1,
                l = !1,
                c = !1,
                s = !1,
                d = !1;
            e.mb.subscribe(OO.EVENTS.PLAYHEAD_TIME_CHANGED, "page", function(e, n, o) {
                if (o > 0) {
                    var c = 1 * (o / 4),
                        s = 2 * (o / 4),
                        d = 3 * (o / 4),
                        u = 4 * (o / 4) - 1;
                    n < 0 ? cls.style.display = "none" : n > u && !l ? (a = !0, i = !0, r = !0, l = !0, t("100% de reproduccion")) : n > d && !r ? (a = !0, i = !0, r = !0, t("75% de reproduccion")) : n > s && !i ? (a = !0, i = !0, t("50% de reproduccion")) : n > c && !a && (a = !0, t("25% de reproduccion"))
                }
            }), e.mb.subscribe("bitrateChanged", "page", function(e, t) {
                n("bitrate", t.bitrate)
            }), e.mb.subscribe(OO.EVENTS.ERROR, "page", function(e, n) {
                n.code === OO.ERROR.UNPLAYABLE_CONTENT && t("videoError", "OO.ERROR.UNPLAYABLE_CONTENT"), n.code === OO.ERROR.INVALID_EXTERNAL_ID && t("videoError", "OO.ERROR.INVALID_EXTERNAL_ID"), n.code === OO.ERROR.EMPTY_CHANNEL && t("videoError", "OO.ERROR.EMPTY_CHANNEL"), n.code === OO.ERROR.EMPTY_CHANNEL_SET && t("videoError", "OO.ERROR.EMPTY_CHANNEL_SET"), n.code === OO.ERROR.CHANNEL_CONTENT && t("videoError", "OO.ERROR.CHANNEL_CONTENT"), n.code === OO.ERROR.API.NETWORK && t("videoError", "OO.ERROR.API.NETWORK"), n.code === OO.ERROR.API.CONTENT_TREE && t("videoError", "OO.ERROR.API.CONTENT_TREE"), n.code === OO.ERROR.API.METADATA && t("videoError", "OO.ERROR.API.METADATA"), n.code === OO.ERROR.API.SAS.GENERIC && t("videoError", "OO.ERROR.API.SAS.GENERIC"), n.code === OO.ERROR.API.SAS.GEO && t("videoError", "OO.ERROR.API.SAS.GEO"), n.code === OO.ERROR.API.SAS.DOMAIN && t("videoError", "OO.ERROR.API.SAS.DOMAIN"), n.code === OO.ERROR.API.SAS.FUTURE && t("videoError", "OO.ERROR.API.SAS.FUTURE"), n.code === OO.ERROR.API.SAS.PAST && t("videoError", "OO.ERROR.API.SAS.PAST"), n.code === OO.ERROR.API.SAS.DEVICE && t("videoError", "OO.ERROR.API.SAS.DEVICE"), n.code === OO.ERROR.API.SAS.PROXY && t("videoError", "OO.ERROR.API.SAS.PROXY"), n.code === OO.ERROR.API.SAS.CONCURRENT_STREAM && t("videoError", "OO.ERROR.API.SAS.CONCURRENT_STREAM"), n.code === OO.ERROR.API.SAS.INVALID_HEARTBEAT && t("videoError", "OO.ERROR.API.SAS.INVALID_HEARTBEAT"), n.code === OO.ERROR.API.SAS.ERROR_DEVICE_INVALID_AUTH_TOKEN && t("videoError", "OO.ERROR.API.SAS.ERROR_DEVICE_INVALID_AUTH_TOKEN"), n.code === OO.ERROR.API.SAS.ERROR_DEVICE_LIMIT_REACHED && t("videoError", "OO.ERROR.API.SAS.ERROR_DEVICE_LIMIT_REACHED"), n.code === OO.ERROR.API.SAS.ERROR_DEVICE_BINDING_FAILED && t("videoError", "OO.ERROR.API.SAS.ERROR_DEVICE_BINDING_FAILED"), n.code === OO.ERROR.API.SAS.ERROR_DEVICE_ID_TOO_LONG && t("videoError", "OO.ERROR.API.SAS.ERROR_DEVICE_ID_TOO_LONG"), n.code === OO.ERROR.API.SAS.ERROR_DRM_RIGHTS_SERVER_ERROR && t("videoError", "OO.ERROR.API.SAS.ERROR_DRM_RIGHTS_SERVER_ERROR"), n.code === OO.ERROR.API.SAS.ERROR_DRM_GENERAL_FAILURE && t("videoError", "OO.ERROR.API.SAS.ERROR_DRM_GENERAL_FAILURE"), n.code === OO.ERROR.API.SAS.ERROR_INVALID_ENTITLEMENTS && t("videoError", "OO.ERROR.API.SAS.ERROR_INVALID_ENTITLEMENTS"), n.code === OO.ERROR.PLAYBACK.GENERIC && t("videoError", "OO.ERROR.PLAYBACK.GENERIC"), n.code === OO.ERROR.PLAYBACK.STREAM && t("videoError", "OO.ERROR.PLAYBACK.STREAM"), n.code === OO.ERROR.PLAYBACK.LIVESTREAM && t("videoError", "OO.ERROR.PLAYBACK.LIVESTREAM"), n.code === OO.ERROR.PLAYBACK.NETWORK && t("videoError", "OO.ERROR.PLAYBACK.NETWORK")
            }), e.mb.subscribe(OO.EVENTS.PLAYING, "page", function() {
                o ? o && (t("resume"), streamingAnalytics.playVideoContentPart(metadata, ns_.ReducedRequirementsStreamingAnalytics.ContentTypeContentType.LongFormOnDemandLongFormOnDemand)) : (o = !0, c ? t("replay") : (t("reproduccion"), streamingAnalytics.playVideoContentPart(metadata, ns_.ReducedRequirementsStreamingAnalytics.ContentTypeContentType.LongFormOnDemandLongFormOnDemand)))
            }), e.mb.subscribe(OO.EVENTS.PAUSED, "page", function() {
                s && (d = !d), o && (t("pause"), streamingAnalytics.stop())
            }), e.mb.subscribe(OO.EVENTS.PLAYED, "page", function() {
                a = !1, i = !1, r = !1, l = !1, o = !1, c = !0
            }), e.mb.subscribe(OO.EVENTS.ADS_PLAYED, "page", function() {
                s = !1, cls.style.display = "none"
            }), e.mb.subscribe("*", "page", function(e) {
                "reportDiscoveryClick" == e && (o ? o && t("reproduccion-discovery") : (o = !0, c && t("reproduccion-discovery")))
            })
        }
        OO.ready(function() {
            window.pp = OO.Player.create("ooyalaplayer", idVideo, {
                pcode: "ExNG0yOnRifgmMP7XkFSmqPU8KiH",
                playerBrandingId: "a5a950cbb70d4c208f14b342639ea1d9",
                skin: {
                    config: "/skinAme.json"
                },
                "google-ima-ads-manager": {
                    all_ads: [{
                        //tag_url: googleIma
                        tag_url: "https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dlinear&correlator="
                    }],
                    useGoogleCountdown: !0
                },
                onCreate: o
            })
        })
    },
    loadNoticias: function() {
        var e = this;
        document.getElementById("ver-mas").addEventListener("click", function(t) {
            t.preventDefault();
            var n = this,
                o = n.getAttribute("href"),
                a = {
                    pagina: n.getAttribute("data-pagina"),
                    offset: n.getAttribute("data-offset"),
                    seccion: n.getAttribute("data-seccion"),
                    key: n.getAttribute("data-key")
                };
            e.getURL(o + "?" + e.paramURL(a), function(e) {
                e = JSON.parse(e), e.empty ? document.getElementById("ver-mas").remove() : (n.setAttribute("data-pagina", e.pagina), document.getElementById("cargar-mas").innerHTML += e.html), n.hidden = e.empty
            }, function(e) {
                console.log("error", e)
            })
        })
    },
    getURL: function(e, t, n) {
        if (window.XMLHttpRequest) {
            var o = new XMLHttpRequest;
            o.onreadystatechange = function() {
                if (4 === o.readyState) {
                    if (200 !== o.status) return void(n && "function" == typeof n && n(o.responseText, o));
                    t && "function" == typeof t && t(o.responseText, o)
                }
            }, o.open("GET", e), o.setRequestHeader("X-Requested-With", "XMLHttpRequest"), o.send()
        }
    },
    paramURL: function(e) {
        var t = "";
        for (var n in e) e.hasOwnProperty(n) && (t.length > 0 && (t += "&"), t += encodeURI(n + "=" + e[n]));
        return t
    },
    loadMasLeidas: function() {
        function e(e) {
            function t(e, t, n) {
                $.ajax({
                    url: t,
                    data: n
                }).done(function(t) {
                    null !== t.html && (o[e].innerHTML = t.html, setTimeout(function() {
                        aeObj.lazyload()
                    }, 100))
                })
            }
            for (var n = $.extend({
                    url: "",
                    div: "ajax-load-get"
                }, e), o = document.getElementsByClassName(n.div), a = 0; a < o.length; a++)
                if (null != o[a]) {
                    var i = void 0 == n.url || "" == n.url ? o[a].dataset.url : n.url;
                    null !== i && (delete o[a].dataset.url, t(a, i, o[a].dataset))
                }
        }
        e()
    },
    eventSocial: function() {
        function e() {
            var e = window.location.href;
            return e = e.replace(location.protocol + "//", "").replace(location.hostname + "/", "")
        }

        function t(t, n, o, a) {
            void 0 === a && (a = e()), ga("adb.send", "event", t, n, a)
        }
        console.log("dentrando"), $(".f-fb a").click(function() {
            var e = window.location.href;
            e = e.replace(location.protocol + "//", "").replace(location.hostname + "/", ""), ga("adb.send", "social", "Facebook", "compartir", e), t("Social Interaction", "click_button_facebook")
        }), $(".f-tw a").click(function() {
            var e = window.location.href;
            e = e.replace(location.protocol + "//", "").replace(location.hostname + "/", ""), ga("adb.send", "social", "Twitter", "compartir", e), t("Social Interaction", "click_button_twitter")
        }), $(".f-gp").click(function() {
            var e = window.location.href;
            e = e.replace(location.protocol + "//", "").replace(location.hostname + "/", ""), ga("adb.send", "social", "Google", "compartir", e), t("Social Interaction", "click_button_google")
        }), $(".f-ms").click(function() {
            console.log("Click orreo");
            var e = window.location.href;
            e = e.replace(location.protocol + "//", "").replace(location.hostname + "/", ""), ga("adb.send", "social", "Correo", "enviar", e), t("Social Interaction", "click_button_mail")
        })
    }
}, $(document).ready(function() {
    function e() {
        $(".contenedor_all_grid").each(function() {
            $(this).children(".white_ae_all").matchHeight()
        })
    }
    $("#searchClick").click(function() {
        $(".cnt-search-b").addClass("searchUtilDown"), $(".cnt-search-b").removeClass("searchUtilUp"), $("#searchClick").addClass("searchBtn"), $(".cnt-search-b span").show()
    }), $(".cnt-search-b span").click(function() {
        $(".cnt-search-b").removeClass("searchUtilDown"), $(".cnt-search-b").addClass("searchUtilUp"), $("#searchClick").removeClass("searchBtn"), $(".cnt-search-b span").hide()
    });
    new Blazy;
    $(document).ajaxStop(function() {}), $("a[href='#gotop']").click(function() {
        return $("html, body").animate({
            scrollTop: 0
        }, "fast"), !1
    }), e(), $(".contenedor_all_grid .white_ae_all").find("img").on("load", e), aeObj.init()
});