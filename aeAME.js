var objAt = {
    init: function() {
        objAt.menuAe(), objAt.search(), objAt.lazyLoad(), objAt.loadMasLeidas(), null != document.getElementById("show-list-am") && objAt.menuAmericaMusica(), null != document.getElementById("facebook") && objAt.comentar(), objAt.socialEvent(), null != document.getElementById("cntRelacionados") && objAt.notasRelacionadas(), null != document.getElementById("aGallery") && objAt.initPhotoSwipeFromDOM(".am-gallery"), null != document.getElementById("videoImagen") && objAt.renderVideo(), null != document.getElementById("sinopsis") && objAt.collapseSinopsis(), null != document.getElementById("listProgramas") && objAt.activeDias(), null != document.getElementById("cargar-mas") && objAt.loadNoticias()
    },
    lazyLoad: function() {
        new Blazy
    },
    menuAe: function() {
        var e = document.querySelector("#wrapper");
        if (document.getElementsByClassName("banner-top").length) var t = document.querySelector(".banner-top");
        var n = new Slideout({
            panel: document.getElementById("wrapper"),
            menu: document.getElementById("menu"),
            tolerance: 70
        });
        n.disableTouch(), document.querySelector(".js-slideout-toggle").addEventListener("click", function(e) {
            e.preventDefault(), n.toggle()
        }), n.on("translate", function(e) {}), n.on("beforeopen", function() {
            document.getElementsByClassName("banner-top").length && (t.style.transition = "transform 300ms ease", t.style.transform = "translateX(280px)"), e.style.transform = "translateX(280px)"
        }), n.on("beforeclose", function() {
            document.getElementsByClassName("banner-top").length && (t.style.transition = "transform 300ms ease", t.style.transform = "translateX(0px)"), e.style.transform = "translateX(0px)"
        }), n.on("open", function() {
            document.getElementsByClassName("banner-top").length && (t.style.transition = "")
        }), n.on("close", function() {
            document.getElementsByClassName("banner-top").length && (t.style.transition = "")
        }), window.addEventListener("resize", function() {
            screen.width >= 992 && n.close()
        })
    },
    search: function() {
        var e = document.getElementsByClassName("btn_busqueda")[0],
            t = document.getElementsByClassName("seeker")[0];
        e && e.addEventListener("click", function(n) {
            n.preventDefault(), e.classList.toggle("mm-close"), "none" == t.style.display ? t.style.display = "block" : t.style.display = "none"
        })
    },
    comentar: function() {
        var e = document.getElementById("facebook"),
            t = document.getElementsByClassName("cont-comentarios")[0],
            n = t.getElementsByTagName("a")[0],
            a = document.getElementsByClassName("coment-tabs")[0];
        n.addEventListener("click", function(o) {
            o.preventDefault();
            var l = n.dataset.href,
                i = document.createElement("div");
            i.classList.add("fb-comments"), i.setAttribute("data-href", l), i.setAttribute("data-width", "100%"), i.setAttribute("data-numposts", 5), i.setAttribute("data-colorscheme", "light"), i.setAttribute("data-orderBy", "reverse_time"), "block" == t.style.display ? t.style.display = "none" : t.style.display = "block", "none" == a.style.display ? a.style.display = "block" : a.style.display = "none", e.appendChild(i), FB.XFBML.parse()
        })
    },
    f_popup: function(e, t) {
        t.preventDefault ? t.preventDefault() : t.returnValue = !1;
        window.open(e.getAttribute("href"), "gec_popup", "width=500,height=450,menubar=no,status=no,location=no,toolbar=no,scrollbars=yes,directories=no")
    },
    initPhotoSwipeFromDOM: function(e) {
        for (var t = function(e) {
                for (var t, n, a, o, l = e.childNodes, i = l.length, s = [], c = 0; c < i; c++) t = l[c], 1 === t.nodeType && (n = t.children[0], a = n.getAttribute("data-size").split("x"), o = {
                    src: n.getAttribute("href"),
                    w: parseInt(a[0], 10),
                    h: parseInt(a[1], 10)
                }, t.children.length > 1 && (o.title = t.children[1].innerHTML), n.children.length > 0 && (o.msrc = n.children[0].getAttribute("src")), o.el = t, s.push(o));
                return s
            }, n = function d(e, t) {
                return e && (t(e) ? e : d(e.parentNode, t))
            }, a = function(e) {
                e = e || window.event, e.preventDefault ? e.preventDefault() : e.returnValue = !1;
                var t = e.target || e.srcElement,
                    a = n(t, function(e) {
                        return e.tagName && "FIGURE" === e.tagName.toUpperCase()
                    });
                if (a) {
                    for (var o, i = a.parentNode, s = a.parentNode.childNodes, c = s.length, r = 0, d = 0; d < c; d++)
                        if (1 === s[d].nodeType) {
                            if (s[d] === a) {
                                o = r;
                                break
                            }
                            r++
                        }
                    return o >= 0 && l(o, i), !1
                }
            }, o = function() {
                var e = window.location.hash.substring(1),
                    t = {};
                if (e.length < 5) return t;
                for (var n = e.split("&"), a = 0; a < n.length; a++)
                    if (n[a]) {
                        var o = n[a].split("=");
                        o.length < 2 || (t[o[0]] = o[1])
                    }
                return t.gid && (t.gid = parseInt(t.gid, 10)), t
            }, l = function(e, n, a, o) {
                var l, i, s, c = document.querySelectorAll(".pswp")[0];
                if (s = t(n), i = {
                        galleryUID: n.getAttribute("data-pswp-uid"),
                        getThumbBoundsFn: function(e) {
                            var t = s[e].el.getElementsByTagName("img")[0],
                                n = window.pageYOffset || document.documentElement.scrollTop,
                                a = t.getBoundingClientRect();
                            return {
                                x: a.left,
                                y: a.top + n,
                                w: a.width
                            }
                        }
                    }, o)
                    if (i.galleryPIDs) {
                        for (var r = 0; r < s.length; r++)
                            if (s[r].pid == e) {
                                i.index = r;
                                break
                            }
                    } else i.index = parseInt(e, 10) - 1;
                else i.index = parseInt(e, 10);
                isNaN(i.index) || (a && (i.showAnimationDuration = 0), l = new PhotoSwipe(c, PhotoSwipeUI_Default, s, i), document.getElementById("wrapper").style.cssText = "will-change: inherit", l.init(), l.listen("destroy", function() {
                    document.getElementById("wrapper").style.cssText = "will-change: transform"
                }))
            }, i = document.querySelectorAll(e), s = 0, c = i.length; s < c; s++) i[s].setAttribute("data-pswp-uid", s + 1), i[s].onclick = a;
        var r = o();
        r.pid && r.gid && l(r.pid, i[r.gid - 1], !0, !0)
    },
    loadCss: function(e, t) {
        if (null == document.getElementById(e)) {
            var n = document.createElement("link");
            n.id = e, n.rel = "stylesheet", n.href = t, document.getElementsByTagName("head")[0].appendChild(n)
        }
    },
    loadJs: function(e, t, n) {
        if (null == document.getElementById(e)) {
            var a = document.createElement("script");
            a.id = e, a.src = t, a.async = n, document.getElementsByTagName("head")[0].appendChild(a)
        }
    },
    renderVideo: function() {
        var e = document.getElementById("videoImagen"),
            t = document.getElementById("videoIframe");
        document.getElementById("backContent");
        e.addEventListener("click", function(n) {
            objAt.loadCss("skinOoyala", "//player.ooyala.com/static/v4/production/latest/skin-plugin/html5-skin.min.css?v1"), objAt.loadJs("core", "//player.ooyala.com/static/v4/production/latest/core.min.js?v1", !1), objAt.loadJs("html5", "//player.ooyala.com/static/v4/production/latest/video-plugin/main_html5.min.js?v1", !1), objAt.loadJs("html5-skin", "//player.ooyala.com/static/v4/production/latest/skin-plugin/html5-skin.min.js?v1", !1), objAt.loadJs("bit-wrapper", "//player.ooyala.com/static/v4/production/latest/video-plugin/bit_wrapper.min.js?v1", !1), objAt.loadJs("core", "//player.ooyala.com/static/v4/production/latest/other-plugin/discovery_api.min.js?v1", !1), objAt.loadJs("google-ima", "//player.ooyala.com/static/v4/production/latest/ad-plugin/google_ima.min.js?v1", !1), objAt.loadJs("video-metrix", "https://sb.scorecardresearch.com/c2/plugins/streamingtag_plugin_ooyalav4.js?v3", !1), objAt.loadJs("load-video", videoRender.js, e.style.display = "none", t.style.display = "block"
        })
    },
    loadNoticias: function() {
        var e = this;
        document.getElementById("ver-mas").addEventListener("click", function(t) {
            t.preventDefault();
            var n = this,
                a = n.getAttribute("href"),
                o = {
                    pagina: n.getAttribute("data-pagina"),
                    offset: n.getAttribute("data-offset"),
                    seccion: n.getAttribute("data-seccion"),
                    key: n.getAttribute("data-key")
                };
            e.getURL(a + "?" + e.paramURL(o), function(e) {
                e = JSON.parse(e), e.empty ? document.getElementById("ver-mas").remove() : (n.setAttribute("data-pagina", e.pagina), document.getElementById("cargar-mas").innerHTML += e.html, setTimeout(function() {
                    objAt.lazyLoad()
                }, 100)), n.hidden = e.empty
            }, function(e) {
                console.log("error", e)
            })
        })
    },
    getURL: function(e, t, n) {
        if (window.XMLHttpRequest) {
            var a = new XMLHttpRequest;
            a.onreadystatechange = function() {
                if (4 === a.readyState) {
                    if (200 !== a.status) return void(n && "function" == typeof n && n(a.responseText, a));
                    t && "function" == typeof t && t(a.responseText, a)
                }
            }, a.open("GET", e), a.setRequestHeader("X-Requested-With", "XMLHttpRequest"), a.send()
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
                    null !== t.html && (a[e].innerHTML = t.html, setTimeout(function() {}, 100))
                })
            }
            for (var n = $.extend({
                    url: "",
                    div: "ajax-load-get"
                }, e), a = document.getElementsByClassName(n.div), o = 0; o < a.length; o++)
                if (null != a[o]) {
                    var l = void 0 == n.url || "" == n.url ? a[o].dataset.url : n.url;
                    null !== l && (delete a[o].dataset.url, t(o, l, a[o].dataset))
                }
        }
        e()
    },
    socialEvent: function() {
        function e() {
            var e = window.location.href;
            return e = e.replace(location.protocol + "//", "").replace(location.hostname + "/", "")
        }

        function t(t, n, a) {
            void 0 === a && (a = e()), ga("adb.send", "event", t, n, a)
        }

        function n(t, n, a) {
            void 0 === a && (a = e()), ga("adb.send", "event", t, n, a, {
                transport: "beacon"
            })
        }
        var a = document.getElementsByClassName("fb");
        Array.prototype.forEach.call(a, function(e) {
            e.getElementsByTagName("a")[0].addEventListener("click", function() {
                var e = window.location.href;
                e = e.replace(location.protocol + "//", "").replace(location.hostname + "/", ""), ga("adb.send", "social", "Facebook", "compartir", e), t("Social Interaction", "click_button_facebook")
            })
        });
        var o = document.getElementsByClassName("tw");
        Array.prototype.forEach.call(o, function(e) {
            e.getElementsByTagName("a")[0].addEventListener("click", function() {
                var e = window.location.href;
                e = e.replace(location.protocol + "//", "").replace(location.hostname + "/", ""), ga("adb.send", "social", "Twitter", "compartir", e), t("Social Interaction", "click_button_twitter")
            })
        });
        var l = document.getElementsByClassName("gp");
        Array.prototype.forEach.call(l, function(e) {
            e.getElementsByTagName("a")[0].addEventListener("click", function() {
                var e = window.location.href;
                e = e.replace(location.protocol + "//", "").replace(location.hostname + "/", ""), ga("adb.send", "social", "Google", "compartir", e), t("Social Interaction", "click_button_google")
            })
        });
        var i = document.getElementsByClassName("wha");
        Array.prototype.forEach.call(i, function(e) {
            e.getElementsByTagName("a")[0].addEventListener("click", function() {
                var e = window.location.href;
                e = e.replace(location.protocol + "//", "").replace(location.hostname + "/", ""), ga("adb.send", "social", "Whatsapp", "compartir", e), t("Social Interaction", "click_button_whatsapp")
            })
        });
        var s = document.getElementsByClassName("em");
        Array.prototype.forEach.call(s, function(e) {
            e.getElementsByTagName("a")[0].addEventListener("click", function() {
                var e = window.location.href;
                e = e.replace(location.protocol + "//", "").replace(location.hostname + "/", ""), ga("adb.send", "social", "Correo", "compartir", e), t("Social Interaction", "click_button_mail")
            })
        });
        var c = document.getElementsByClassName("m_menu");
        c[0].addEventListener("click", function() {
            t("Menu", "clic_menu")
        });
        var r = document.getElementsByClassName("clic_seccion");
        Array.prototype.forEach.call(r, function(e) {
            e.getElementsByTagName("a")[0].addEventListener("click", function() {
                n("Menu", "clic_seccion")
            })
        });
        var d = document.getElementsByClassName("clic_club");
        Array.prototype.forEach.call(d, function(e) {
            e.getElementsByTagName("a")[0].addEventListener("click", function() {
                n("Menu", "clic_botonclub")
            })
        })
    },
    notasRelacionadas: function() {
        document.addEventListener("DOMContentLoaded", function() {
            function e() {
                objAt.lazyLoad()
            }
            var t = document.querySelector(".relacionados_w");
            t.addEventListener("before.lory.slide", e), t.addEventListener("on.lory.touchmove", e), lory(t, {
                rewind: !0
            })
        })
    },
    collapseSinopsis: function() {
        document.getElementsByClassName("event-acc")[0].addEventListener("click", function() {
            var e = document.getElementsByClassName("content-sinopsis")[0];
            "none" == e.style.display ? (e.classList.remove("slide-up"), e.classList.add("slide-down"), this.classList.add("open"), e.style.display = null, setTimeout(function() {
                e.style.display = "block"
            }, 500)) : (e.classList.remove("slide-down"), e.classList.add("slide-up"), this.classList.remove("open"), setTimeout(function() {
                e.style.display = "none"
            }, 500))
        })
    },
    menuAmericaMusica: function() {
        var e = $("#show-menu span");
        e.click(function() {
            $("#show-list-am").show()
        });
        var t = $("#hide-list-am span");
        t.click(function() {
            $("#show-list-am").hide()
        })
    },
    activeDias: function() {
        var e = document.getElementsByClassName("scrollyeah")[0].getElementsByTagName("ul")[0].getElementsByTagName("li"),
            t = document.getElementsByClassName("tab-content");
        Array.prototype.forEach.call(e, function(e) {
            e.getElementsByTagName("a")[0].addEventListener("click", function() {
                var e = this.dataset.id;
                Array.prototype.forEach.call(t, function(e) {
                    e.style.display = "none"
                }), document.getElementById(e).style = "block"
            })
        })
    }
};