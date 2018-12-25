$("#trailer-transcript dd").collapse("hide");
var courseViewer = angular.module("courseViewer", ["ui.bootstrap.tpls", "ui.bootstrap.popover", "ui.router", "ngResource", "urlRoot", "courseViewerDirectives", "courseResources", "userResources", "AAPageData", "ooyalaPlayer", "Captions", "feedback", "courseTemplates", "dialogs", "storage", "request"]);
courseViewer.config(["$stateProvider", "$urlRouterProvider", "urlRoot", function(e, t, n) {
    e.state("course", {
        controller: "CourseBaseCtrl",
        template: "<ui-view/>"
    }).state("course.preview", {
        template: ""
    }).state("course.view", {
        templateUrl: n + "/html/course/viewer.html",
        controller: "CourseViewerCtrl"
    }).state("missing", {
        template: "not found here, 404 good buddy"
    }), t.when(/(.*)\/$/, "$1")
}]), courseViewer.controller("CourseMainCtrl", ["$scope", "$state", "courseSvc", "AAPageData", "user", "checkAccess", "courseResources", "viewerState", "viewerEvents", "dialogs", "strings", "urlRoot", "$window", "$location", "history", "courseUrl", function(e, t, n, r, o, s, i, a, u, c, l, d, p, f, m, v) {
    function g(t) {
        if ("string" == typeof t ? a.startingNode = t : t && (a.resume = !0), !o || !o.subscriber && "subscription" == e.course.accessLevel) a.session = null, u.publish("onLoadCourse");
        else if (null != a.session && a.session.starred) "subscription" != e.course.accessLevel || e.course.unlocked ? u.publish("onLoadCourse") : i.sessions.isLocked({
            id: a.session.courseSessionId
        }).$promise.then(function(t) {
            t.locked ? y() : (e.course.unlocked = !0, a.asyncStart = !0, u.publish("onLoadCourse"))
        });
        else {
            e.loadingCourse = !0;
            var n = r.courseIdOverride || e.course.outlineId;
            i.sessions.start({
                id: n
            }).$promise.then(function(t) {
                if (e.loadingCourse = !1, a.session = t, t.concurrencyLock) y();
                else {
                    if (e.course.previewOnly) return void(p.location.href = "?resume=1");
                    a.asyncStart = !0, u.publish("onLoadCourse")
                }
            }, function(t) {
                e.error = t, console.error("error creating session", t)
            })
        }
    }

    function h() {
        s("course").then(function(t) {
            t && function() {
                e.adding = !0;
                var t = r.courseIdOverride || e.course.outlineId;
                i.sessions.start({
                    id: t
                }).$promise.then(function(t) {
                    e.adding = !1, e.added = !0, a.session = t
                }, function(t) {
                    e.adding = !1, e.addError = !0, e.error = t, console.error(t)
                })
            }()
        })
    }

    function y() {
        c.alert(l.TOO_MANY_COURSES_MSG, l.TOO_MANY_COURSES_TITLE)
    }

    function b(e) {
        a.goingToSite = !0, u.publish("pause"), p.open(v.calculate(n.get(), !0, "embed"), "_blank"), e.preventDefault()
    }

    function w() {
        try {
            $("html,body").animate({
                scrollTop: 0
            }, 250)
        } catch (e) {}
    }! function() {
        e.viewerState = a, e.course = n.get(), e.urlRoot = d, e.beginCourse = g, e.addToMyCourses = h, e.viewOnAA = b, e.scrollTop = w, m.init({
            courseId: e.course.outlineId,
            nextCourses: !1
        }), m.onChanged(function() {
            "course.preview" == t.current.name && location.reload()
        }), e.$on("$stateChangeSuccess", function(t, n, r, o, s) {
            e.$parent.hidePreview = "course.preview" != n.name
        }), u.subscribe("setCourse", function(t) {
            e.course = t
        });
        var o = f.search();
        e.embedded = r.embedded, e.testsEnabled = r.testsEnabled, a.resume = !!o.resume, a.previewing = !(o.resume || o.autoplay), a.playlistId = o.playlist;
        var s = o.previewNode;
        if (s) a.startingNode = s, a.previewing = !1;
        else {
            var i = f.hash();
            i && (i = i.split(":"), a.startingNode = i[0], a.startingTimeSeconds = i[1] || 0, a.previewing = !1)
        }
        t.go("course.view")
    }()
}]), courseViewer.controller("CourseBaseCtrl", function() {}), courseViewer.controller("CourseViewerCtrl", ["$scope", "$state", "courseSvc", "courseResources", "user", "dialogs", "viewerEvents", "viewerState", "$window", "$timeout", "captionsLoader", "AAPageData", "preferences", "urlRoot", "bumper", "playlists", "history", "checkAccess", function(e, t, n, r, o, s, i, a, u, c, l, d, p, f, m, v, g, h) {
    var y = 5;

    function b(t) {
        e.courseHandouts = t.documents ? t.documents.filter(function(e) {
            return "course-handout" == e.type.name
        }) : [], a.hasResources = !!e.courseHandouts.length, a.calculateColumns()
    }

    function w(t, n) {
        e.viewerState.currentSection = t.parent;
        var r = function(e) {
            if (!e) return {
                widthForDuration: function() {
                    return 0
                }
            };
            for (var t, n = e.length, r = 0, o = 0, s = 0, i = 0; t = e[i], i < n; i++) t.definition.duration ? (o++, r += t.definition.duration) : s++;
            var a = 1 / (15 + n) * 99.95;
            0 == o && (a = 1 / s * 99.95);
            var u = 99.95 - a * s;
            return {
                widthForDuration: function(e) {
                    return e ? e / r * u : a
                }
            }
        }(t.scenes);
        e.viewerState.currentLesson = t, e.widthForDuration = r.widthForDuration, n || S(t.scenes && t.scenes[0])
    }

    function S(t) {
        t ? (a.sessionState = "in_progress", a.previewing = !1, a.prevDisplay = a.currentDisplay, a.prevDisplayProgress = a.currentDisplayProgress, a.currentDisplay = t, a.currentDisplayProgress = 0, a.prevDisplayType = e.displayType, a.calculateColumns(), e.displayType = t.type, e.pastDisplaysLength = function(e, t, n) {
            for (var r = 0, o = 0; r < e.length && e[r] != t; r++) o += 0 | e[r].definition.duration;
            return o += 0 | n
        }(a.currentLesson.scenes, t, 0), a.currentTime = e.pastDisplaysLength, a.hasNext = function() {
            var t = e.viewerState.currentLesson.scenes;
            if (t.indexOf(e.viewerState.currentDisplay) < t.length - 1) return !0;
            var n = e.viewerState.currentSection.lessons;
            if (n.indexOf(e.viewerState.currentLesson) < n.length - 1) return !0;
            var r = e.course.sections;
            return r.indexOf(e.viewerState.currentSection) < r.length - 1
        }(), a.hasPrevious = e.viewerState.currentLesson.scenes.indexOf(e.viewerState.currentDisplay) > 0 || e.viewerState.currentSection.lessons.indexOf(e.viewerState.currentLesson) > 0 || e.course.sections.indexOf(e.viewerState.currentSection) > 0, a.captionsEnabled && x(), a.recordTransition(), i.publish("beginDisplay", t.type, t), a.startingTimeSeconds ? (i.publish("seek", 1e3 * a.startingTimeSeconds, !0), delete a.startingTimeSeconds) : a.resume && (a.resume = !1, a.session && a.session.currentSceneOffset > 0 && (i.publish("seek", a.session.currentSceneOffset, !0), a.seekToOffset = a.session.currentSceneOffset))) : h("course").then(function(e) {
            if (e) throw Error("This lesson does not have any scenes in it.");
            i.publish("pause")
        })
    }

    function C(e) {
        w(e.lessons[0], !1)
    }

    function P() {
        a.starting = !0;
        var t = A();
        if (t)
            if ("course" == t.objectType) C(t.sections[0]);
            else if ("section" == t.objectType) C(t);
        else if ("lesson" == t.objectType) w(t);
        else {
            if ("scene" != t.objectType) throw Error("what am I supposed to do with this " + t.objectType);
            w(t.parent, !0), S(t)
        }
        E(p.get("captions", !1)), e.volumePct || R(p.get("volume", 100))
    }

    function A() {
        return a.startingNode ? function(t) {
            var n = e.course;
            if (t == n.outlineId) return n;
            for (var r, o, s, i = t.split("."), a = [], u = 1; u <= i.length; u++) a.push(i.slice(0, u).join("."));
            for (var u = 0; u < n.sections.length; u++)
                if (n.sections[u].outlineId == a[1]) {
                    r = n.sections[u];
                    break
                }
            if (2 == a.length) return r;
            for (var u = 0; u < r.lessons.length; u++)
                if (r.lessons[u].outlineId == a[2]) {
                    o = r.lessons[u];
                    break
                }
            if (3 == a.length) return o;
            for (var u = 0; u < o.scenes.length; u++)
                if (o.scenes[u].outlineId == a[3]) {
                    s = o.scenes[u];
                    break
                }
            return s
        }(a.startingNode) : a.resume && a.session ? function(t) {
            for (var n, r = e.course, o = 0; n = r.sections[o]; o++)
                for (var s, i = 0; s = n.lessons[i]; i++)
                    for (var a, u = 0; a = s.scenes[u]; u++)
                        if (a.id == t) return a
        }(a.session.currentScene) : e.course.sections[0]
    }

    function k() {
        if ("in_progress" == e.viewerState.sessionState)
            if (V(), e.viewerState.currentLesson.scenes) {
                var t, n, r = 1 + e.viewerState.currentLesson.scenes.indexOf(e.viewerState.currentDisplay);
                r < e.viewerState.currentLesson.scenes.length ? S(e.viewerState.currentLesson.scenes[r]) : (t = 1 + e.viewerState.currentSection.lessons.indexOf(e.viewerState.currentLesson)) < e.viewerState.currentSection.lessons.length ? w(e.viewerState.currentSection.lessons[t]) : (n = 1 + e.course.sections.indexOf(e.viewerState.currentSection)) < e.course.sections.length ? C(e.course.sections[n]) : (e.viewerState.sessionState = "view_complete", i.publish("onPause"), i.publish("onCourseEnd"), e.displayType = "")
            } else S(null)
    }

    function D() {
        "in_progress" != a.sessionState ? e.beginCourse() : "playing" != a.current ? i.publish("play") : i.publish("pause")
    }

    function R(t) {
        p.set("volume", t), e.volumePct = t, i.publish("setVolume", t)
    }

    function E(e) {
        a.captionsEnabled = !!e, p.set("captions", e || !1), "string" == typeof e && (a.selectedLanguage = e), a.captionsEnabled && x()
    }

    function x() {
        var e = a.currentDisplay && a.currentDisplay.definition.videoAsset;
        if (e && void 0 === e.captions) {
            var t = e.embed_code;
            l.load(t).then(function(e) {
                var n = a.currentDisplay && a.currentDisplay.definition.videoAsset;
                n && n.embed_code == t && (n.captions = e.data)
            })
        }
    }
    e.user = o, e.viewerState = a, e.drawer = {
        active: "full" == e.course.type ? "outline" : "suggested"
    }, e.resourcesExpanded = !1, e.feedbackExpanded = !1, e.resourceMax = y, G(e.course.outlineId), i.subscribe("setCourse", b), b(e.course), e.captionLanguages = {
        en: "English"
    }, e.playbackRate = p.get("playbackRate", 1);
    var T = Math.pow(2, .2),
        I = 1 / T,
        O = e.RATE_MAX = 2,
        L = e.RATE_MIN = .5;

    function F(t) {
        var n = e.playbackRate;
        n *= t, n = Math.max(L, n), n = Math.min(O, n), e.playbackRate = n, p.set("playbackRate", n), i.publish("setPlaybackRate", e.playbackRate)
    }

    function V() {
        i.publish("pause")
    }

    function q(e) {
        var t = e && "beforeunload" == e.type;
        M(t), t && p.set("viewerunloadtime", Date.now())
    }

    function M(e) {
        a.prevDisplay = a.currentDisplay, a.prevDisplayProgress = a.currentDisplayProgress, a.currentDisplay = null, a.currentDisplayProgress = 0, a.recordTransition(e), i.publish("pause"), a.session = null
    }

    function _(t, o) {
        M(), G(t, o), r.courses.getPresentation({
            id: t
        }).$promise.then(function(t) {
            n.set(t), e.beginCourse()
        })
    }

    function G(t, n) {
        var r = function(e) {
            N(e.courses, t), a.nextCourses = e.courses, a.playlistTitle = e.title
        };
        if (a.playlistId) {
            if (!a.nextCourses || !a.nextCourses.length) return void v.get(a.playlistId).then(r)
        } else if (!a.nextCourses || !a.nextCourses.length) return void v.getSuggestions(e.course.outlineId, 8).then(r);
        N(a.nextCourses, t, n)
    }

    function N(e, t, n) {
        for (var r = 0; r < e.length; r++) {
            var o = e[r];
            o.courseId == t ? (o.playStatus = "playing", !0) : n ? o.courseId in n ? o.playStatus = "played" : o.playStatus = void 0 : "playing" == o.playStatus && (o.playStatus = "played")
        }
    }
    $(u).on("beforeunload.viewer", q), $(u).on("keypress.viewer", function(t) {
        $(t.target).is("input,textarea") || 32 == t.which && (t.preventDefault(), e.$apply(D))
    }), g.onChanged(function(e) {
        var t = e && (e.courseId || e.outlineId);
        t ? _(t, e.playedCourses || {}) : s.alert("Something went wrong loading this course.  Please refresh the page.", "Error")
    }), e.$on("$destroy", function() {
        q(), $(u).off("beforeunload.viewer"), $(u).off("keypress.viewer")
    }), e.loadCourse = function(t, n) {
        var r = n.currentTarget.href,
            o = {
                courseId: t.courseId,
                playedCourses: function(e) {
                    for (var t = {}, n = 0; n < e.length; n++) e[n].playStatus && (t[e[n].courseId] = e[n].playStatus);
                    return t
                }(a.nextCourses)
            };
        if (t.courseId == e.course.outlineId) return n.preventDefault(), void D();
        g.changeState(o, r) && (n.preventDefault(), _(t.courseId))
    }, e.beginLesson = w, e.beginDisplay = S, e.playOrPause = D, e.next = k, e.previous = function() {
        if (e.viewerState.hasPrevious)
            if (V(), e.viewerState.currentLesson.scenes) {
                var t, n = -1 + e.viewerState.currentLesson.scenes.indexOf(e.viewerState.currentDisplay);
                n >= 0 ? S(e.viewerState.currentLesson.scenes[n]) : (t = -1 + e.viewerState.currentSection.lessons.indexOf(e.viewerState.currentLesson)) >= 0 ? w(e.viewerState.currentSection.lessons[t]) : function() {
                    var t = -1 + e.course.sections.indexOf(e.viewerState.currentSection);
                    if (t >= 0) {
                        var n = e.course.sections[t];
                        w(n.lessons[n.lessons.length - 1])
                    }
                }()
            } else S(null)
    }, e.seek = function(e, t) {
        i.publish("seek", e, t)
    }, e.setVolume = R, e.skipBack = function() {
        i.publish("skipBack")
    }, e.toggleFullscreen = function() {
        screenfull ? screenfull.toggle($("#player-wrapper")[0]) : i.publish("toggleFullscreen")
    }, e.toggleCaptions = E, e.togglePlaybackRateMenu = function(t) {
        e.showPlaybackRateMenu = null == t ? !e.showPlaybackRateMenu : t
    }, e.increasePlaybackRate = function() {
        F(T)
    }, e.decreasePlaybackRate = function() {
        F(I)
    }, e.expandResources = function() {
        e.resourcesExpanded = !e.resourcesExpanded, e.resourceMax = e.resourcesExpanded ? 999 : y
    }, e.feedbackChanged = function(t) {
        e.feedbackExpanded = "response" == t
    }, e.examHref = f + "/course/" + (d.courseIdOverride || e.course.outlineId) + "/exam", i.subscribe("next", function() {
        k()
    }), i.subscribe("onCourseEnd", function() {
        a.session && (r.sessions.getSurvey({
            id: a.session.courseSessionId
        }, function(t) {
            e.survey = t
        }), r.sessions.viewingComplete({
            id: a.session.courseSessionId
        }, function(e) {})), a.courseView && r.sessions.completeView({
            id: a.courseView.courseViewId
        }, {
            completed: !0
        })
    }), i.subscribe("onLoadCourse", function() {
        Y(function() {
            m.playMaybe(e).then(P)
        })
    }), i.subscribe("progress", function(t) {
        e.viewerState.currentSceneTime = t, e.viewerState.currentTime = t + e.pastDisplaysLength
    }), i.subscribe("onPlay", function() {
        "â–¶ " != document.title.substring(0, 2) && (document.title = "â–¶ " + document.title)
    }), i.subscribe("onPause", function() {
        "â–¶ " == document.title.substring(0, 2) && (document.title = document.title.substring(2))
    }), i.subscribe("firstPlay", function() {
        r.sessions.createView({
            id: n.get().outlineId
        }, {
            embedded: e.embedded,
            playlistId: a.playlistId || void 0,
            referrer: document.referrer || ""
        }).$promise.then(function(e) {
            a.courseView = e
        }, function(e) {
            a.courseView = null, console.error(e)
        })
    });
    var U, j, B, Q = !1,
        z = [];

    function Y(e) {
        Q ? e() : z.push(e)
    }

    function X() {
        for (Q = !0; z.length;) try {
            z.shift()()
        } catch (e) {
            console.error(e)
        }
    }! function() {
        for (var e = ["video", "question", "slide"], t = 0, n = 0; n < e.length; n++) {
            var r = e[n] + "DisplayReady";
            i.subscribe(r, function(n) {
                ++t == e.length && X()
            })
        }
    }(), screenfull && e.$watch(function() {
        return screenfull.isFullscreen
    }, function(t, n) {
        e.isFullscreen = t
    }), a.previewing ? (e.displayType = "preview", a.sessionState = "previewing", U = e, m.shouldPlay(U) ? j = m.getScene() : ("course" == (B = A()).objectType && (B = B.sections[0]), "section" == B.objectType && (B = B.lessons[0]), "lesson" == B.objectType && (B = B.scenes[0]), j = "scene" == B.objectType ? B : null), j && Y(function() {
        i.publish("preloadDisplay", j)
    })) : (a.asyncStart = !0, e.beginCourse())
}]), courseViewer.factory("BaseDisplayCtrl", function() {
    return function(e, t, n, r, o) {
        var s = this;
        s.type = r, s.displayActive = !1;
        var i = {
            finish: a
        };

        function a(e) {
            t.publish("willFinish", e), s.displayActive = !1, u()
        }

        function u() {
            for (var e in i) {
                var n = i[e];
                t.unsubscribe(e, n)
            }
        }
        o && (i = angular.extend(i, o)), t.subscribe("beginDisplay", function(e, r) {
            if (e != s.type) return void(s.displayActive && a(s.type));
            s.displayActive || (! function() {
                for (var e in i) {
                    var n = i[e];
                    t.subscribe(e, n)
                }
            }(), s.displayActive = !0);
            n.currentSceneTime = 0, n.currentDisplayProgress = 0
        }), e.$on("$destroy", function() {
            u()
        })
    }
}), courseViewer.controller("QuestionDisplayCtrl", ["$scope", "viewerEvents", "viewerState", "BaseDisplayCtrl", function(e, t, n, r) {
    r.call(this, e, t, n, "question", {}), e.$watch("viewerState.currentDisplay", function(t) {
        e.question = t && t.definition && t.definition.question
    }), t.subscribe("beginDisplay", function(t, n) {
        if ("question" === t) {
            e.reviewing = !1;
            var r = e.question = n.definition.question;
            "multiple-choice" == r.type ? e.answer = r.definition.options.map(function() {
                return !1
            }) : e.answer = ""
        }
    }), e.submit = function() {
        var t = e.question;
        if (e.reviewing = !0, "free-response" == t.type) {
            var n, r, o = e.answer.toLowerCase(),
                s = t.definition.rule,
                i = s.value.toLowerCase();
            switch (s.type) {
                case "EQUALS":
                    n = o === i, r = s.value;
                    break;
                case "CONTAINS":
                    n = o.indexOf(i) >= 0, r = s.value;
                    break;
                case "MATCHES":
                case "OR":
                case "AND":
                    throw Error("not implemented yet")
            }
            e.isCorrect = n, e.correctAnswer = r
        } else if ("multiple-choice" == t.type)
            for (var a, u = 0; a = t.definition.options[u], u < t.definition.options.length; u++) a.correct ? a.reviewClass = e.answer[u] ? "chosen-correct" : "missed-correct" : a.reviewClass = e.answer[u] ? "chosen-incorrect" : ""
    }, t.publish("questionDisplayReady", "question")
}]), courseViewer.controller("SlideDisplayCtrl", ["$scope", "viewerEvents", "viewerState", "BaseDisplayCtrl", function(e, t, n, r) {
    r.call(this, e, t, n, "slide"), e.$watch("viewerState.currentDisplay", function(t) {
        e.currentSlideIndex = 0, e.slides = t && t.definition && t.definition.slides,
            function() {
                for (var t, n, r = e.slides, o = 0; o < (r && r.length); o++) n = t, (t = r[o]).append && n && (t.text = (n.text || "") + t.text)
            }()
    }), e.prevSlide = function() {
        --e.currentSlideIndex
    }, e.nextSlide = function() {
        ++e.currentSlideIndex, e.currentSlideIndex >= e.viewerState.currentDisplay.definition.slides.length && e.next()
    }, t.publish("slideDisplayReady", "slide")
}]), courseViewer.controller("PreviewDisplayCtrl", ["$scope", "viewerEvents", "viewerState", "BaseDisplayCtrl", "urlRoot", function(e, t, n, r, o) {
    r.call(this, e, t, n, "preview");
    try {
        e.previewImage = e.course.metadata.trailer.preview_image_url_ssl
    } catch (e) {}
    if (!e.previewImage) try {
        e.previewImage = e.course.sections[0].lessons[0].scenes[0].definition.videoAsset.preview_image_url_ssl
    } catch (e) {}
    e.previewImage || (e.previewImage = o + "/image/course-thumb/?course=" + e.course.outlineId), e.play = function() {
        e.beginCourse()
    }
}]), courseViewer.controller("VideoDisplayCtrl", ["$scope", "OoyalaPlayer", "viewerEvents", "viewerState", "BaseDisplayCtrl", "$timeout", function(e, t, n, r, o, s) {
    var i = this,
        a = {
            play: c,
            pause: l,
            onPlay: function() {
                e.viewerState.current = "playing"
            },
            onPause: function() {
                e.viewerState.current = "paused"
            },
            seek: function(e, t) {
                var n = !0 === t ? e / 1e3 : e / 100 * u.getDuration();
                u.queueMessage("seek", n)
            },
            setVolume: d,
            setPlaybackRate: p,
            skipBack: function() {
                u.queueMessage("seek", u.getPlayheadTime() - 5)
            },
            willFinish: function(t) {
                e.viewerState.annotations = null, !i.displayActive || null != t && t != i.type || u.pause()
            },
            toggleFullscreen: function() {
                var e = !u.fullscreen;
                angular.element("#" + u.getElementId() + " video").prop("controls", e), u.queueMessage("willChangeFullscreen", e)
            }
        };
    o.call(this, e, n, r, "video", a);
    var u = t.temp();

    function c() {
        r.starting && (r.starting = !1, n.publish("firstPlay")), u.queueMessage("play"), n.publish("onPlay")
    }

    function l() {
        u.queueMessage("pause"), n.publish("onPause")
    }

    function d(e) {
        var t = e / 100;
        u.queueMessage("setVolume", t)
    }

    function p(e) {
        u.setPlaybackRate("bumper" == r.sessionState ? 1 : e || 1)
    }

    function f(t, n) {
        if (i.displayActive) {
            if (e.viewerState.annotations = n.definition.annotations, n.definition.videoAsset) o = n.definition.videoAsset.embed_code;
            else if (n.definition.video && n.definition.video.content) var o = n.definition.video.content;
            u.setEmbedCode(o), d(e.volumePct || 100), p(e.playbackRate), !r.canAutoplay && r.asyncStart ? (l(), r.asyncStart = !1) : c()
        }
    }

    function m(e) {
        if ("video" == e.type) {
            if (e.definition.videoAsset) t = e.definition.videoAsset.embed_code;
            else if (e.definition.video && e.definition.video.content) var t = e.definition.video.content;
            t && u.setEmbedCode(t)
        }
    }
    t.get("courseooyalaplayer", {
        tempPlayer: u,
        fullscreenControls: !screenfull
    }, function(t) {
        var o = 0,
            s = "courseViewer";
        (u = t).subscribe("playheadTimeChanged", s, function(t, s, a, u) {
            e.$apply(function() {
                i.displayActive && (r.buffering = !1, o = 0, r.currentDisplayProgress = s / a * 100, n.publish("progress", 1e3 * s))
            })
        }), u.subscribe("played", s, function(t, o, s, i) {
            e.$apply(function() {
                "bumper" == r.sessionState ? n.publish("bumper-played") : n.publish("next")
            })
        }), u.subscribe("downloading", s, function(t, n, s, i) {
            var a = i / s * 100;
            o++, e.$apply(function() {
                r.currentDownloadProgress = a, "playing" == r.current && o >= 8 && (r.buffering = !0)
            })
        }), u.subscribe("buffering", s, function() {
            e.$apply(function() {
                r.buffering = !0
            })
        }), u.subscribe("buffered", s, function() {
            e.$apply(function() {
                r.buffering = !1
            })
        }), u.subscribe("playbackReady", s, function() {
            e.$apply(function() {
                r.buffering = !1
            })
        }), u.subscribe("willPlay", s, function() {
            p(e.playbackRate)
        }), u.subscribe("playing", s, function() {
            r.seekToOffset && (n.publish("seek", r.seekToOffset, !0), delete r.seekToOffset)
        }), r.setCapabilities(), r.loading = !1, r.buffering = !0, window.player = u
    }), n.subscribe("beginDisplay", f), n.subscribe("preloadDisplay", m), e.$on("$destroy", function() {
        n.unsubscribe("beginDisplay", f), n.unsubscribe("preloadDisplay", m), t.destroy("courseooyalaplayer")
    }), e.annotationClicked = function() {
        n.publish("pause")
    }, n.publish("videoDisplayReady", "video")
}]), courseViewer.factory("viewerEvents", function() {
    var e = {};
    return {
        publish: function(t, n) {
            if (n = Array.prototype.slice.call(arguments, 1), e[t])
                for (var r = 0; r < e[t].length; r++) e[t][r].apply(this, n)
        },
        subscribe: function(t, n) {
            e[t] = e[t] || [], e[t].push(n)
        },
        unsubscribe: function(t, n) {
            if (e[t])
                if (n)
                    for (var r = 0; r < e[t].length; r++) e[t][r] === n && e[t].splice(r, 1);
                else delete e[t]
        }
    }
}), courseViewer.factory("viewerState", ["courseSvc", "courseResources", "AAPageData", "urlRoot", function(e, t, n, r) {
    var o = {
        recordTransition: function(t, n, s) {
            "boolean" == typeof t && (s = t, t = n = null);
            var i = function(t, n) {
                if (t = t || o.currentDisplay, n = n || o.prevDisplay, t == n) return;
                if (n && n.id) var r = n.definition.duration * o.prevDisplayProgress / 100 | 0,
                    s = {
                        scene: {
                            id: n.id
                        },
                        complete: n.definition.duration - r < 1e3,
                        offset: r
                    };
                else s = null;
                if (t && t.id) var r = t.definition.duration * o.currentDisplayProgress / 100 | 0,
                    i = {
                        scene: {
                            id: t.id
                        },
                        complete: !1,
                        offset: r
                    };
                else i = null;
                if (!i && !s) return;
                var a = e.get().duration;
                if (t) var u = (t.elapsedTime + i.offset) / a;
                else n && (u = (n.elapsedTime + s.offset) / a);
                return {
                    end: s,
                    start: i,
                    progress: u
                }
            }(t, n);
            if (!i) return;
            i.end && ga("send", "event", "video", "stop", o.prevDisplay.outlineId);
            i.start && ga("send", "event", "video", "play", o.currentDisplay.outlineId);
            if (i.end && !i.start && o.courseView) {
                var a = !!o.goingToSite;
                o.goingToSite = !1;
                var u = e.get().duration,
                    c = {
                        stoppedAt: i.progress * u,
                        completed: i.progress >= .999,
                        toSite: a
                    },
                    l = o.courseView.courseViewId,
                    d = r + "/api/course-session/" + l + "/course-view-complete";
                $.postJSON(d, c, {
                    async: !s
                }).then(function(e) {}, function(e) {
                    console.log("error recording view end", e)
                })
            }
            if (o.session) {
                var l = o.session.courseSessionId,
                    d = r + "/api/course-session/" + l + "/add-scene-event";
                $.postJSON(d, i, {
                    async: !s
                }).then(function(e) {}, function(e) {
                    console.log("error recording transition", e)
                })
            } else console.log("session not available yet")
        },
        setCapabilities: s,
        calculateColumns: function() {
            var t = e.get(),
                r = n.embedded,
                s = !!o.playlistId,
                i = o.previewing,
                a = t.type,
                u = o.hasResources;
            o.showDescription = !1, o.showOutline = !1, o.showNextCourses = !1, o.showResources = !1, o.showResources = u && !r, r ? s ? o.showNextCourses = !0 : i ? o.showDescription = !0 : "full" == a ? o.showOutline = !0 : o.showNextCourses = !0 : (o.showDescription = !0, "full" == a ? o.showOutline = !0 : o.showNextCourses = !0)
        },
        PLAYING: "playing",
        PAUSED: "paused",
        INTERACTIVE: "interactive",
        current: void 0,
        currentDisplay: void 0,
        prevDisplay: void 0,
        previewing: !1,
        session: n.session,
        loading: !0
    };
    return s(), o;

    function s() {
        var e = !!$("#courseooyalaplayer object").length,
            t = !e,
            n = $("body").hasClass("ios"),
            r = $("body").hasClass("android");
        o.canChangePlaybackRate = t && !n && !r, o.canChangeVolume = !n, o.canFullscreen = document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled, o.canCC = !0, o.isFlash = e, o.canAutoplay = !n && !r
    }
}]), courseViewer.factory("checkAccess", ["user", "courseSvc", "userResources", "AAPageData", "DenyDialog", "$q", function(e, t, n, r, o, s) {
    var i = null;
    return function(a, u) {
        return s.when(function s(a, u, c) {
            if ("course" == a) {
                var l = t.get();
                if (!l.previewOnly) return !0;
                if (e && e.subscriber && "subscription" == l.accessLevel) return !0;
                if (e && "member" == l.accessLevel) return !0;
                if (u && u.definition && u.definition.videoAsset && l.metadata.trailer && l.metadata.trailer.embed_code && u.definition.videoAsset.embed_code == l.metadata.trailer.embed_code) return !0
            } else {
                if ("member" != a) throw Error("Illegal invocation: must pass 'course' or 'member'");
                if (e) return !0
            }
            if ("course" == a && "subscription" == l.accessLevel) var d = "subscribe";
            else d = "login";
            return "subscribe" == d && e && !c ? n.users.refresh().$promise.then(function(t) {
                return e = r.user = t, s(a, null, !0)
            }) : (i || (i = new o({
                requirement: d,
                cancelable: !0,
                user: e,
                oncancel: function() {
                    i = null
                }
            })), !1)
        }(a, u))
    }
}]), courseViewer.factory("courseSvc", ["courseResources", "AAPageData", "viewerEvents", function(e, t, n) {
    var r;
    return o(t.course), {
        get: function() {
            return r
        },
        set: o
    };

    function o(e) {
        var o = r;
        r = e;
        for (var s, i, a, u = 0, c = 0; s = r.sections[c]; c++)
            for (var l, d = 0; l = s.lessons[d]; d++) {
                if (l.parent = s, !l.scenes) {
                    if (0 != c || 0 != d) continue;
                    r.metadata.trailer && (l.scenes = [(i = r.metadata.trailer, a = l, {
                        id: -1,
                        objectType: "scene",
                        definition: {
                            duration: i.duration,
                            skippable: !1,
                            videoAsset: i
                        },
                        type: "video",
                        outlineId: a.outlineId + ".S1",
                        videoAsset: i,
                        resources: []
                    })])
                }
                for (var p, f = 0; p = l.scenes[f]; f++) p.parent = l, p.elapsedTime = u, u += p.definition.duration
            }
        o && delete t.courseIdOverride, n.publish("setCourse", r)
    }
}]), courseViewer.value("localStorage", localStorage), courseViewer.factory("DenyDialog", function() {
    return AA.DenyDialog
}), courseViewer.factory("user", ["userResources", "AAPageData", function(e, t) {
    return t.user
}]), courseViewer.value("strings", {
    TOO_MANY_COURSES_MSG: "Your account is viewing too many courses simultaneously.  Please close another course before continuing.",
    TOO_MANY_COURSES_TITLE: "Too Many Courses"
});
var module = angular.module("courseViewerDirectives", ["ngSanitize", "TimedContent", "urlRoot"]);
angular.module("urlRoot", []).constant("urlRoot", AA.page.root),
    function(e) {
        function t(e) {
            var t;
            t = e, this.content = t
        }
        t.prototype.getContentForTime = function(e) {
            return function(e, t) {
                var n = [],
                    r = e.content;
                if (r)
                    for (var o = 0; o < r.length; o++) {
                        var s = r[o];
                        if (s.begin <= t && s.end >= t) n.push(s);
                        else if (s.begin > t) break
                    }
                return n
            }(this, e)
        }, t.prototype.getNext = function(e) {
            return function(e, t) {
                var n = e.content;
                if (n)
                    for (var r = 0; r < n.length; r++)
                        if (n[r].begin >= t) return n[r]
            }(this, e)
        }, t.prototype.setContent = function(e) {
            this.content = e
        }, "undefined" != typeof angular ? angular.module("TimedContent", []).value("TimedContent", t) : void 0 !== module && module.exports ? module.exports = t : e.AA ? e.AA.TimedContent = t : e.TimedContent = t
    }(this), angular.module("courseViewerDirectives").directive("captions", ["urlRoot", function(e) {
        return {
            scope: {
                data: "=",
                time: "=",
                lang: "="
            },
            restrict: "E",
            templateUrl: e + "/html/course/captions.html",
            replace: !0,
            controller: "CaptionsController"
        }
    }]).controller("CaptionsController", ["Captions", "$scope", function(e, t) {
        var n = null,
            r = -1,
            o = -1,
            s = null;
        t.currentCaptions = [], t.$watch("data", function(o) {
            n = e.parse(o), r = -1, t.currentCaptions = []
        }), t.$watch("lang", function(e) {
            n && n.setLanguage(e), r = -1, t.currentCaptions = []
        }), t.$watch("time", function(e) {
            if (o > e && (r = -1), o = e, !(e < r) && n) {
                t.currentCaptions = n.getCaptionsForTime(e), r = Number.MAX_SAFE_INTEGER, (s = n.getNextCaption(e)) && (r = s.begin);
                for (var i = 0; i < t.currentCaptions.length; i++) {
                    var a = t.currentCaptions[i];
                    a.begin > e && a.begin < r && (r = a.begin), a.end > e && a.end < r && (r = a.end)
                }
            }
        })
    }]).factory("captionsLoader", ["$http", "urlRoot", function(e, t) {
        return {
            load: function(n) {
                return e.get(t + "/ooyala/getCaptions?id=" + n)
            }
        }
    }]), angular.module("courseViewerDirectives").directive("timedContent", ["urlRoot", function(e) {
        return {
            scope: {
                data: "=",
                time: "=",
                itemClass: "@",
                clicked: "="
            },
            restrict: "E",
            templateUrl: e + "/html/course/timedContent.html",
            replace: !0,
            link: function(e, t, n) {
                n.clicked && t.on("click", "a", function(t) {
                    e.$apply(function() {
                        e.clicked(t)
                    })
                })
            },
            controller: "TimedContentController"
        }
    }]).controller("TimedContentController", ["$scope", "TimedContent", function(e, t) {
        var n = new t,
            r = -1,
            o = -1,
            s = null;
        e.currentContent = [], e.$watch("data", function(t) {
            n.setContent(t), r = -1, e.currentContent = []
        }), e.$watch("time", function(t) {
            if (void 0 === t && (t = 0), o > t && (r = -1), o = t, !(t < r)) {
                e.currentContent = n.getContentForTime(t), r = Number.MAX_VALUE, (s = n.getNext(t)) && (r = s.begin);
                for (var i = 0; i < e.currentContent.length; i++) {
                    var a = e.currentContent[i];
                    a.begin > t && a.begin < r && (r = a.begin), a.end > t && a.end < r && (r = a.end)
                }
            }
        })
    }]), module.directive("viewerControls", ["urlRoot", function(e) {
        return {
            restrict: "EA",
            templateUrl: e + "/html/course/viewerControls.html"
        }
    }]), module.directive("transcript", ["urlRoot", function(e) {
        return {
            restrict: "EA",
            templateUrl: e + "/html/course/transcript.html"
        }
    }]), module.directive("outline", ["urlRoot", function(e) {
        return {
            restrict: "EA",
            templateUrl: e + "/html/course/outline.html"
        }
    }]), module.directive("outlineSection", ["urlRoot", function(e) {
        return {
            restrict: "EA",
            templateUrl: e + "/html/course/outlineSection.html",
            replace: !0
        }
    }]), module.directive("outlineLesson", ["urlRoot", function(e) {
        return {
            restrict: "EA",
            templateUrl: e + "/html/course/outlineLesson.html",
            replace: !0
        }
    }]), module.directive("previewDisplay", ["urlRoot", function(e) {
        return {
            controller: "PreviewDisplayCtrl",
            restrict: "EA",
            templateUrl: e + "/html/course/previewDisplay.html"
        }
    }]), module.directive("videoDisplay", ["urlRoot", function(e) {
        return {
            controller: "VideoDisplayCtrl",
            restrict: "EA",
            templateUrl: e + "/html/course/videoDisplay.html"
        }
    }]), module.directive("questionDisplay", ["urlRoot", function(e) {
        return {
            controller: "QuestionDisplayCtrl",
            restrict: "EA",
            templateUrl: e + "/html/course/questionDisplay.html"
        }
    }]), module.directive("slideDisplay", ["urlRoot", function(e) {
        return {
            controller: "SlideDisplayCtrl",
            restrict: "EA",
            templateUrl: e + "/html/course/slideDisplay.html"
        }
    }]), module.filter("minutes", function() {
        return function(e, t) {
            return t && (e /= 1e3), (e / 60 | 0) + ":" + ((e = e % 60 | 0) < 10 ? "0" : "") + e
        }
    }), module.filter("unsafe", ["$sce", function(e) {
        return function(t) {
            return e.trustAsHtml(t)
        }
    }]), module.directive("slidable", [function() {
        return {
            restrict: "A",
            scope: {
                slidable: "=",
                slideaxis: "@",
                onslide: "=",
                onslideend: "=",
                max: "=?",
                resizable: "=?"
            },
            link: function(e, t, n) {
                function r() {
                    t.off(".slidable"), angular.element(window).off(".slidable")
                }
                e.$watch("slidable", function(n, o) {
                    n ? function() {
                        var n = "y" != e.slideaxis;
                        e.resizable && i();
                        var r = !1,
                            o = !1;

                        function s(t, r) {
                            e.max || i(), o = !0, position = n ? void 0 !== t.offsetX ? t.offsetX : t.clientX - $(t.target).offset().left : e.max - (void 0 !== t.offsetY ? t.offsetY : t.clientY - $(t.target).offset().top), e.slidepct = 100 * position / e.max, e.slidepct = Math.min(Math.max(e.slidepct, 0), 100), e.onslide && e.onslide(e.slidepct, t), r && (e.onslideend && e.onslideend(e.slidepct, t), e.$apply())
                        }

                        function i() {
                            e.max = n ? t.width() : t.height()
                        }
                        t.on("mousedown.slidable", function(e) {
                            r = !0, o = !1
                        }), t.on("mouseup.slidable touchend.slidable", function(e) {
                            o && e.stopPropagation(), s(e, !0), r = !1, o = !1
                        }), t.on("touchmove.slidable mousemove.slidable", function(e) {
                            e.preventDefault(), (r || "touchmove" == e.type) && s(e)
                        }), e.resizable && angular.element(window).on("resize.slidable", i)
                    }() : r()
                }), e.$on("$destroy", r)
            }
        }
    }]), courseViewer.factory("bumper", ["$q", "$state", "AAPageData", "viewerState", "viewerEvents", "preferences", function(e, t, n, r, o, s) {
        var i = !1,
            a = 1e4,
            u = Date.now(),
            c = {
                sections: [{
                    lessons: [{
                        scenes: [{
                            type: "video",
                            definition: {
                                skippable: !1,
                                videoAsset: {
                                    embed_code: n.bumper,
                                    duration: 0
                                }
                            }
                        }]
                    }]
                }]
            };

        function l(e) {
            return !i && ("full" != e.course.type && ((!r.startingNode || !r.startingTimeSeconds) && !(s.get("viewerunloadtime", 0) + a >= u)))
        }

        function d() {
            return c.sections[0].lessons[0].scenes[0]
        }

        function p(t) {
            var n = e.defer(),
                s = d();
            return r.sessionState = "bumper", r.currentDisplay = s, r.currentDisplayProgress = 0, t.displayType = s.type, t.pastDisplaysLength = 0, r.currentTime = 0, r.hasNext = !1, r.hasPrevious = !1, o.subscribe("bumper-played", function() {
                i = !0, n.resolve()
            }), o.publish("beginDisplay", s.type, s), n.promise
        }
        return {
            shouldPlay: l,
            playMaybe: function(t) {
                return l(t) ? p(t) : e.when(!0)
            },
            play: p,
            getScene: d
        }
    }]),
    function(e) {
        var t = /(\d{1,}):(\d{2}):(\d{2}(?:\.\d+)?)/,
            n = /(\d+(?:\.\d+)?)(h|m|s|ms|f|t)/;

        function r(e) {
            ! function(e, t) {
                e.doc = $.parseXML(t), e.root = $(e.doc).find("tt");
                var n = e.root.attr("xml:lang");
                e.languages = [], n && (e.languages[0] = n);
                e.captions = {},
                    function e(t, n, r, s) {
                        var i = n.attr("xml:lang");
                        i && (s = i);
                        var a = n.attr("begin");
                        var u = r;
                        a && (r += o(a));
                        n.children().each(function(n, o) {
                            e(t, $(o), r, s)
                        });
                        if (n.is("p")) {
                            var c = r,
                                l = n.attr("end");
                            if (l) endTime = u + o(l);
                            else {
                                var d = n.attr("dur");
                                d ? endTime = c + o(d) : console.log("error! no end time specified")
                            }
                            for (var p = n[0], f = "", m = 0; m < p.childNodes.length; m++) {
                                var v = p.childNodes[m];
                                v.nodeValue && (f += " " + v.nodeValue)
                            }
                            var g = {
                                begin: c,
                                end: endTime,
                                text: f
                            }; - 1 == t.languages.indexOf(s) && t.languages.push(s), t.captions[s] || (t.captions[s] = []), t.captions[s].push(g)
                        }
                    }(e, e.root, 0, n), e.defaultLang = e.selectedLang = e.languages[0]
            }(this, e)
        }

        function o(e) {
            var r = t.exec(e);
            if (r) return 1e3 * (3600 * r[1] + 60 * r[2] + 1 * r[3]);
            if (r = n.exec(e)) {
                var o = r[1],
                    s = r[2];
                if ("ms" == s) return 0 | o;
                if ("s" == s) return 1e3 * o;
                if ("m" == s) return 6e4 * o;
                if ("h" == s) return 36e5 * o;
                throw Error("Unsupported offset time unit: " + s)
            }
            throw Error("invalid time expression: " + e)
        }
        r.prototype.getCaptionsForTime = function(e) {
            return function(e, t) {
                var n = [],
                    r = e.captions[e.selectedLang];
                if (r)
                    for (var o = 0; o < r.length; o++) {
                        var s = r[o];
                        if (s.begin <= t && s.end >= t) n.push(s);
                        else if (s.begin > t) break
                    }
                return n
            }(this, e)
        }, r.prototype.getNextCaption = function(e) {
            return function(e, t) {
                var n = e.captions[e.selectedLang];
                if (n)
                    for (var r = 0; r < n.length; r++)
                        if (n[r].begin >= t) return n[r]
            }(this, e)
        }, r.prototype.setLanguage = function(e) {
            this.selectedLang = e
        }, r.parse = function(e) {
            return new r(e)
        }, "undefined" != typeof angular ? angular.module("Captions", []).value("Captions", r) : void 0 !== module && module.exports ? module.exports = r : e.AA ? e.AA.Captions = r : e.Captions = r
    }(this), courseViewer.factory("history", ["$window", "$location", function(e, t) {
        var n, r = [];
        return {
            init: function(s) {
                e.history && e.history.pushState && (n = !0, $(window).on("popstate", function(e) {
                    ! function(e) {
                        for (var t = 0; t < r.length; t++) r[t](history.state, e)
                    }(e.originalEvent.state || history.state)
                }), s && (s._initial = !0, o(s, t.url(), !0)))
            },
            changeState: o,
            onChanged: function(e) {
                r.push(e)
            }
        };

        function o(e, r, o) {
            if (!n) return !1;
            var s = r.replace(/^\w+:\/\/[^\/]+/, "");
            return t.url(s, !0), o ? history.replaceState(e, "", s) : history.pushState(e, "", s), !0
        }
    }]), angular.module("ooyalaPlayer", []).factory("OoyalaPlayer", ["$timeout", function(e) {
        var t = {},
            n = !1;

        function r(e) {
            var t;
            window.OO ? (t = e, OO.ready(function() {
                n = !0, t && t()
            })) : setTimeout(function() {
                r(e)
            }, 50)
        }

        function o(n, r, o) {
            var s;
            o.tempPlayer && (s = o.tempPlayer, delete o.tempPlayer), o.pcode = "ExNG0yOnRifgmMP7XkFSmqPU8KiH", o.playerBrandingId = "a5a950cbb70d4c208f14b342639ea1d9", o.onCreate = function(e) {
                AA.DEBUG && e.mb.subscribe("*", "coursePlayer", function(e) {
                    console.info.apply(console, ["player event:"].concat(Array.prototype.slice.call(arguments)))
                })
            };
            var i = t[n] = OO.Player.create(n, r, o),
                a = [];
            i.ready = function(e) {
                this.playbackReady ? e() : a.push(e)
            }, i.subscribe("playbackReady", "coursePlayer", function() {
                ! function() {
                    if (s) {
                        var t;
                        for (s.playbackRate && i.setPlaybackRate(s.playbackRate), s.fullscreen && i.toggleFullscreen(!0); t = s.queue.shift();)
                            if (i.queueMessage.apply(i, t), "seek" == t[0]) {
                                var n = t;
                                e(function() {
                                    i.queueMessage.apply(i, n)
                                }, 100)
                            }
                        s = null
                    }
                    var r;
                    i.playbackReady = !0;
                    for (; r = a.shift();) r()
                }()
            }), i.subscribe("error", "coursePlayer", function(e, t) {
                ga("send", "event", "video", "error: " + t.code, i.getEmbedCode()), new AA.AlertDialog("Something went wrong with the video player.  Please refresh the page and try again.", "Oh dear!"), window.console && console.error && console.error("player error", t)
            }), i.subscribe("fullscreenChanged", "coursePlayer", function(e, t) {
                if (t) var n = o.fullscreenControls;
                else n = !!o.controls;
                angular.element("#" + i.getElementId() + " video").prop("controls", n)
            }), i.queueMessage = function(e, t) {
                var n = arguments,
                    r = n[0],
                    o = i[r];
                if (!o) throw Error("invalid player method: " + r);
                n = Array.prototype.slice.call(n, 1), i.ready(function() {
                    o.apply(i, n)
                })
            };
            return i.setPlaybackRate = function(e) {
                angular.element("#" + n + " video").prop("playbackRate", e)
            }, i.toggleFullscreen = function(e) {
                e = !i.fullscreen;
                angular.element("#" + i.getElementId() + " video").prop("controls", e), i.queueMessage("willChangeFullscreen", e)
            }, s && s.embedCode && i.setEmbedCode(s.embedCode), i
        }
        return {
            get: function e(s, i, a) {
                "function" == typeof i && (a = i, i = void 0), n ? (t[s] || o(s, void 0, i), a(t[s])) : r(function() {
                    e(s, i, a)
                })
            },
            temp: function() {
                return {
                    queue: [],
                    queueMessage: function() {
                        this.queue.push(arguments)
                    },
                    setEmbedCode: function(e) {
                        this.embedCode = e
                    },
                    getEmbedCode: function() {
                        return this.embedCode = code
                    },
                    setPlaybackRate: function(e) {
                        this.playbackRate = e
                    },
                    toggleFullscreen: function() {
                        this.fullscreen = !this.fullscreen
                    }
                }
            },
            destroy: function(e) {
                t[e] && (t[e].destroy(), delete t[e])
            }
        }
    }]), angular.module("courseViewer").directive("previewPlayer", ["urlRoot", function(e) {
        return {
            scope: {
                embedCode: "@",
                imgSrc: "@",
                showFinishedContent: "="
            },
            transclude: !0,
            restrict: "E",
            templateUrl: e + "/html/course/previewPlayer.html",
            controller: "PreviewPlayerController"
        }
    }]).controller("PreviewPlayerController", ["$scope", "OoyalaPlayer", function(e, t) {
        var n = "previewplayer";
        e.state = "paused";
        var r = t.temp();
        t.get(n, {
            tempPlayer: r
        }, function(t) {
            (r = t).subscribe("played", n, function(t, n, r, o) {
                e.$apply(function() {
                    e.state = e.showFinishedContent ? "played" : "paused"
                })
            }), r.subscribe("playing", n, function(t, n, r, o) {
                e.$apply(function() {
                    e.state = "playing"
                })
            })
        }), e.play = function() {
            r.queueMessage("play")
        }, r.setEmbedCode(e.embedCode), e.$on("$destroy", function() {
            t.destroy(n)
        })
    }]), courseViewer.factory("playlists", ["request", "urlRoot", function(e, t) {
        return {
            get: function(n) {
                var r = t + "/api/subject/get/{id}";
                return e.get(r, {
                    params: {
                        id: n
                    }
                }).then(function(e) {
                    var t = e.data,
                        n = t.nodes[0],
                        r = n && n.title,
                        o = t.courseContainers;
                    return {
                        title: r,
                        courses: o
                    }
                })
            },
            getSuggestions: function(n, r) {
                var o = t + "/api/course/suggestions/video";
                return e.get(o, {
                    params: {
                        "course-id": n,
                        count: r
                    }
                }).then(function(e) {
                    var t = e.data;
                    return {
                        title: null,
                        courses: t.courseContainers
                    }
                })
            }
        }
    }]), courseViewer.factory("preferences", ["storage", function(e) {
        var t = "viewerprefs";
        return {
            get: function(n, r) {
                var o = t + "." + n,
                    s = e.local.get(o);
                return void 0 === s ? r : s
            },
            set: function(n, r) {
                var o = t + "." + n;
                e.local.set(o, r)
            }
        }
    }]), courseViewer.factory("courseUrl", ["$window", "$location", "urlRoot", "viewerState", function(e, t, n, r) {
        return {
            calculate: function(e, o, s) {
                var i = n + "/course/" + e.name,
                    a = [],
                    u = t.search();
                if (o) var c = ["playlist"];
                else var c = ["embed", "sidebar", "playlist"];
                for (var l in c) {
                    var d = c[l];
                    u[d] && a.push(d + "=" + encodeURIComponent(u[d]))
                }
                s && a.push("ref=" + s);
                a.length && (i += "?" + a.join("&"));
                o && r.currentLesson && (i += "#" + r.currentLesson.outlineId, r.currentTime && (i += ":" + (r.currentTime / 1e3 | 0)));
                return i
            }
        }
    }]);
var resources = angular.module("courseResources", ["ngResource", "urlRoot"]);
resources.factory("courseResources", ["$resource", "urlRoot", function(e, t) {
    return {
        courses: e(t + "/api/course/:modifier/:id/:action", {
            id: "@id"
        }, {
            get: {
                method: "Get"
            },
            all: {
                params: {
                    modifier: "all"
                },
                method: "Get",
                isArray: !0
            },
            list: {
                params: {
                    action: "list"
                },
                method: "Get",
                isArray: !0
            },
            getSuggested: {
                params: {
                    action: "suggestions"
                },
                method: "Get"
            },
            getOutline: {
                params: {
                    modifier: "outline"
                },
                method: "Get",
                cache: !1
            },
            getPresentation: {
                params: {
                    modifier: "presentation"
                },
                method: "Get",
                cache: !1
            },
            getContainers: {
                params: {
                    modifier: "list-containers"
                },
                method: "Get",
                isArray: !0
            },
            getContainerCourses: {
                params: {
                    modifier: "list",
                    cont: "@cont"
                },
                method: "Get",
                isArray: !0
            },
            update: {
                params: {
                    action: "update"
                },
                method: "Put"
            },
            lock: {
                params: {
                    action: "lock"
                },
                method: "Post"
            },
            unlock: {
                params: {
                    action: "unlock"
                },
                method: "Put"
            },
            setState: {
                method: "Post",
                params: {
                    action: "set-state"
                }
            },
            add: {
                method: "Post"
            },
            clone: {
                params: {
                    action: "clone",
                    id: "@id"
                },
                method: "Post"
            },
            published: {
                params: {
                    action: "published",
                    author: "@author"
                },
                method: "Get",
                isArray: !0
            },
            editable: {
                params: {
                    action: "edit",
                    author: "@author"
                },
                method: "Get",
                isArray: !0
            },
            addAcl: {
                params: {
                    action: "add-acl"
                },
                method: "Post",
                isArray: !0
            },
            removeAcl: {
                params: {
                    action: "remove-acl"
                },
                method: "Post",
                isArray: !0
            },
            linkResource: {
                params: {
                    action: "link-res"
                },
                method: "Put"
            },
            reindex: {
                params: {
                    action: "reindex"
                },
                method: "Put"
            },
            delete: {
                params: {
                    action: "delete"
                },
                method: "Delete"
            }
        }),
        sessions: e(t + "/api/course-session/:prefix/:id/:action", {}, {
            list: {
                method: "Get",
                isArray: !0
            },
            get: {
                method: "Get",
                params: {
                    id: "@id"
                }
            },
            start: {
                method: "Post",
                params: {
                    prefix: "start",
                    id: "@id",
                    restart: "@restart"
                }
            },
            addSceneEvent: {
                method: "Post",
                params: {
                    id: "@id",
                    action: "add-scene-event"
                }
            },
            viewingComplete: {
                method: "Put",
                params: {
                    id: "@id",
                    action: "view-complete"
                }
            },
            createView: {
                method: "Post",
                params: {
                    id: "@id",
                    action: "course-view-create"
                }
            },
            completeView: {
                method: "Post",
                params: {
                    id: "@viewId",
                    action: "course-view-complete"
                }
            },
            isLocked: {
                method: "Get",
                params: {
                    id: "@id",
                    action: "concurrency-lock"
                }
            },
            startExam: {
                method: "Post",
                params: {
                    id: "@id"
                }
            },
            saveAnswers: {
                method: "Put",
                params: {
                    id: "@id",
                    action: "exam-answers"
                }
            },
            gradeExam: {
                method: "Post",
                params: {
                    id: "@id",
                    action: "grade"
                }
            },
            getSurvey: {
                method: "Get",
                params: {
                    id: "@id",
                    action: "get-survey"
                },
                isArray: !0
            },
            answerSurvey: {
                method: "Put",
                params: {
                    id: "@id",
                    action: "answer-survey"
                }
            },
            answerSurveyQuick: {
                method: "Put",
                params: {
                    id: "@id",
                    answer: "@answer",
                    action: "answer-survey-quick"
                }
            }
        }),
        courseThumbnails: e(t + "/image/course-thumb", {}, {
            get: {
                method: "Get"
            },
            set: {
                method: "Post",
                params: {
                    course: "@course"
                },
                transformRequest: angular.identity,
                headers: {
                    "Content-Type": void 0
                }
            }
        }, {
            stripTrailingSlashes: !1
        }),
        trackImages: e(t + "/image/:image", {}, {
            setBadge: {
                method: "Post",
                params: {
                    image: "track-badge",
                    track: "@track"
                },
                transformRequest: angular.identity,
                headers: {
                    "Content-Type": void 0
                }
            },
            setThumbnail: {
                method: "Post",
                params: {
                    image: "track-thumb",
                    track: "@track"
                },
                transformRequest: angular.identity,
                headers: {
                    "Content-Type": void 0
                }
            }
        }, {
            stripTrailingSlashes: !1
        }),
        sections: e(t + "/api/section/:id/:action", {
            id: "@id"
        }, {
            order: {
                params: {
                    action: "order"
                },
                method: "Put"
            },
            update: {
                params: {
                    action: "update"
                },
                method: "Put"
            },
            lock: {
                params: {
                    action: "lock"
                },
                method: "Post"
            },
            unlock: {
                params: {
                    action: "unlock"
                },
                method: "Put"
            },
            move: {
                params: {
                    action: "move"
                },
                method: "Post"
            },
            add: {
                params: {
                    action: "create"
                },
                method: "Post"
            },
            delete: {
                params: {
                    action: "delete"
                },
                method: "Delete"
            },
            linkResource: {
                params: {
                    action: "link-res"
                },
                method: "Put"
            }
        }),
        lessons: e(t + "/api/lesson/:id/:action", {
            id: "@id"
        }, {
            order: {
                params: {
                    action: "order"
                },
                method: "Put"
            },
            update: {
                params: {
                    action: "update"
                },
                method: "Put"
            },
            lock: {
                params: {
                    action: "lock"
                },
                method: "Post"
            },
            unlock: {
                params: {
                    action: "unlock"
                },
                method: "Put"
            },
            move: {
                params: {
                    action: "move"
                },
                method: "Post"
            },
            add: {
                params: {
                    action: "create"
                },
                method: "Post"
            },
            delete: {
                params: {
                    action: "delete"
                },
                method: "Delete"
            },
            linkResource: {
                params: {
                    action: "link-res"
                },
                method: "Put"
            }
        }),
        itemGroups: e(t + "/api/item-group/:id/:action", {
            id: "@id"
        }, {
            order: {
                params: {
                    action: "order"
                },
                method: "Put"
            },
            update: {
                params: {
                    action: "update"
                },
                method: "Put"
            },
            lock: {
                params: {
                    action: "lock"
                },
                method: "Post"
            },
            unlock: {
                params: {
                    action: "unlock"
                },
                method: "Put"
            },
            move: {
                params: {
                    action: "move"
                },
                method: "Post"
            },
            add: {
                params: {
                    action: "create"
                },
                method: "Post"
            },
            delete: {
                params: {
                    action: "delete"
                },
                method: "Delete"
            }
        }),
        items: e(t + "/api/item/:id/:action", {
            id: "@id"
        }, {
            order: {
                params: {
                    action: "order"
                },
                method: "Put"
            },
            update: {
                params: {
                    action: "update"
                },
                method: "Put"
            },
            lock: {
                params: {
                    action: "lock"
                },
                method: "Post"
            },
            unlock: {
                params: {
                    action: "unlock"
                },
                method: "Put"
            },
            move: {
                params: {
                    action: "move"
                },
                method: "Post"
            },
            add: {
                params: {
                    action: "create"
                },
                method: "Post"
            },
            delete: {
                params: {
                    action: "delete"
                },
                method: "Delete"
            },
            linkResource: {
                params: {
                    action: "link-res"
                },
                method: "Put"
            }
        }),
        scenes: e(t + "/api/scene/:id/:action", {
            id: "@id"
        }, {
            order: {
                params: {
                    action: "order"
                },
                method: "Put"
            },
            update: {
                params: {
                    action: "update"
                },
                method: "Put"
            },
            lock: {
                params: {
                    action: "lock"
                },
                method: "Post"
            },
            unlock: {
                params: {
                    action: "unlock"
                },
                method: "Put"
            },
            move: {
                params: {
                    action: "move"
                },
                method: "Post"
            },
            add: {
                params: {
                    action: "create"
                },
                method: "Post"
            },
            delete: {
                params: {
                    action: "delete"
                },
                method: "Delete"
            },
            linkResource: {
                params: {
                    action: "link-res"
                },
                method: "Put"
            }
        }),
        languages: e(t + "/api/language", {}, {
            get: {
                method: "Get",
                isArray: !0
            }
        }),
        documents: e(t + "/api/document/:id/:action", {
            id: "@id"
        }, {
            list: {
                method: "Get",
                params: {
                    action: "list-course"
                },
                isArray: !0
            },
            get: {
                method: "Get"
            },
            update: {
                params: {
                    action: "update"
                },
                method: "Put"
            },
            add: {
                method: "Post",
                params: {
                    action: "create"
                }
            },
            delete: {
                params: {
                    action: "delete"
                },
                method: "Delete"
            }
        }),
        documentTypes: e(t + "/api/document-type", {}, {
            get: {
                method: "Get",
                isArray: !0,
                cache: !0
            }
        }),
        ooyala: e(t + "/ooyala/:action", {}, {
            listAssets: {
                params: {
                    action: "listAssets"
                },
                method: "Get",
                isArray: !1
            },
            listAssetsByLabel: {
                params: {
                    action: "listAssetsByLabel",
                    label: "@label"
                },
                method: "Get",
                isArray: !1
            }
        }),
        subjects: e(t + "/api/subject/:verb/:parent/:id/:action", {
            id: "@id"
        }, {
            list: {
                method: "Get",
                params: {
                    raw: !0,
                    full: !0,
                    new: !0
                }
            },
            unassigned: {
                method: "Get",
                params: {
                    action: "unassigned"
                },
                isArray: !0
            },
            get: {
                method: "Get"
            },
            update: {
                method: "Put"
            },
            create: {
                method: "Post"
            },
            move: {
                method: "Put",
                params: {
                    parent: "@parent",
                    action: "move"
                }
            },
            add: {
                method: "post",
                params: {
                    parent: "@parent",
                    verb: "add"
                }
            },
            remove: {
                method: "delete",
                params: {
                    parent: "@parent",
                    verb: "remove"
                }
            },
            delete: {
                method: "Delete"
            },
            addCourses: {
                params: {
                    action: "add"
                },
                method: "Put"
            },
            removeCourses: {
                params: {
                    action: "remove"
                },
                method: "Put"
            },
            moveCourse: {
                params: {
                    action: "move-course"
                },
                method: "Put"
            }
        }),
        tracks: e(t + "/api/track/:id/:action", {}, {
            list: {
                method: "get"
            },
            listEditable: {
                method: "get",
                params: {
                    version: "edit"
                }
            },
            get: {
                method: "get",
                params: {
                    id: "@id",
                    version: "edit"
                }
            },
            update: {
                method: "put",
                params: {
                    id: "@id",
                    action: "update"
                }
            },
            move: {
                method: "put",
                params: {
                    id: "@id",
                    action: "move"
                }
            },
            delete: {
                method: "delete",
                params: {
                    id: "@id"
                }
            },
            create: {
                method: "post",
                params: {
                    id: "@id"
                }
            },
            publish: {
                method: "put",
                params: {
                    id: "@id",
                    action: "publish"
                }
            }
        }),
        search: e(t + "/api/search/:action", {}, {
            reindex: {
                params: {
                    action: "reindex",
                    all: "@all"
                },
                method: "get"
            }
        })
    }
}]);
var userResources = angular.module("userResources", ["ngResource", "urlRoot"]);
userResources.factory("currentUser", ["$resource", function(e) {
        var t = {};
        return "object" == typeof AA && AA.page && AA.page.user ? t.currentUser = AA.page.user : userResources.users.get(void 0, function(e) {
            t.currentUser = e
        }), t
    }]), userResources.factory("userResources", ["$resource", "urlRoot", function(e, t) {
        return {
            users: e(t + "/api/user/:id/:action", {
                id: "@id"
            }, {
                find: {
                    params: {
                        action: "users"
                    },
                    method: "Get",
                    isArray: !0
                },
                get: {
                    method: "Get"
                },
                refresh: {
                    method: "Get",
                    params: {
                        refresh: !0
                    }
                },
                update: {
                    params: {
                        action: "update",
                        bio: "@bio"
                    },
                    method: "Put"
                },
                privileged: {
                    params: {
                        action: "privileged"
                    },
                    method: "Get",
                    isArray: !0
                },
                getProfile: {
                    method: "Get",
                    params: {
                        modifier: "profile"
                    }
                },
                updateProfile: {
                    params: {
                        action: "update-profile"
                    },
                    method: "Put"
                },
                getAcls: {
                    params: {
                        action: "acl-entries"
                    },
                    method: "Get",
                    isArray: !0
                }
            }),
            roles: e(t + "/api/role", {}, {
                get: {
                    method: "Get",
                    isArray: !0
                }
            }),
            perms: e(t + "/api/permission", {}, {
                get: {
                    method: "Get"
                }
            }),
            profileImage: e(t + "/image/prof", {}, {
                get: {
                    method: "Get"
                },
                set: {
                    method: "Post",
                    transformRequest: angular.identity,
                    headers: {
                        "Content-Type": void 0
                    }
                }
            }, {
                stripTrailingSlashes: !1
            })
        }
    }]), angular.module("urlRoot", []).constant("urlRoot", AA.page.root),
    function() {
        var e = angular.module("feedback", ["courseResources", "urlRoot"]);
        e.controller("FeedbackController", ["$scope", "$timeout", "courseResources", function(e, t, n) {
            e.saveRating = function(t, r) {
                e.saving = !0, n.sessions.answerSurvey({
                    id: e.courseSessionId
                }, [{
                    surveyQuestionId: t.surveyQuestionId,
                    surveyQuestionOptionId: r.surveyQuestionOptionId
                }], function() {
                    e.saving = !1
                }), e.step = "response", e.selectedOption = r
            }, e.saveResponse = function(t, r) {
                e.saving = !0, n.sessions.answerSurvey({
                    id: e.courseSessionId
                }, [{
                    surveyQuestionId: t.surveyQuestionId,
                    surveyQuestionOptionId: r.surveyQuestionOptionId,
                    freeResponse: e.response.value
                }], function() {
                    e.saving = !1
                }), ++e.questionIndex, e.question = e.survey[e.questionIndex], e.selectedOption = null, e.response.value = "", e.question ? e.step = "rating" : e.step = "done"
            }, e.backToRating = function() {
                e.step = "rating"
            }, e.step = "rating", e.saving = !1, e.loading = !1, e.questionIndex = 0, e.selectedOption = null, e.response = {
                value: ""
            };
            var r = e.$watch("survey", function() {
                e.survey && (e.loading = !1, e.question = e.survey[0], r())
            });
            e.onStepChanged && e.$watch("step", function(t, n) {
                e.onStepChanged({
                    step: t
                })
            })
        }]), e.directive("feedback", ["urlRoot", function(e) {
            return {
                restrict: "E",
                replace: !0,
                scope: {
                    courseSessionId: "=sessionId",
                    survey: "=",
                    onStepChanged: "&onstepchanged"
                },
                templateUrl: e + "/html/course/feedback.html",
                controller: "FeedbackController"
            }
        }]), e.controller("MiniFeedbackCtrl", ["$scope", "courseResources", function(e, t) {
            e.selected = "", e.saveFeedback = function(n, r) {
                e.selected = r, n.preventDefault(), n.stopPropagation(), t.sessions.answerSurveyQuick({
                    id: e.courseId,
                    answer: r
                }, function(e) {})
            }
        }]), e.directive("miniFeedback", ["urlRoot", function(e) {
            return {
                restrict: "E",
                replace: !0,
                scope: {
                    courseId: "@"
                },
                templateUrl: e + "/html/course/mini-feedback.html",
                controller: "MiniFeedbackCtrl"
            }
        }])
    }(), angular.module("AAPageData", []).value("AAPageData", this.AA && AA.page || {}), angular.module("dialogs", []).factory("dialogs", function() {
        return {
            alert: function(e, t) {
                new AA.AlertDialog(e, t)
            },
            confirm: function(e, t) {
                new AA.ConfirmDialog(e, t)
            }
        }
    }), angular.module("storage", []).value("sessionStorage", window.sessionStorage).value("localStorage", window.localStorage).factory("storage", ["localStorage", "sessionStorage", function(e, t) {
        return {
            local: new n(e),
            session: new n(t)
        };

        function n(e) {
            this.store = e, this.get = function(e) {
                return angular.fromJson(this.store[e])
            }, this.set = function(e, t) {
                this.store[e] = angular.toJson(t)
            }
        }
    }]),
    function() {
        "use strict";
        var e = void 0 !== module && module.exports,
            t = "undefined" != typeof Element && "ALLOW_KEYBOARD_INPUT" in Element,
            n = function() {
                for (var e, t, n = [
                        ["requestFullscreen", "exitFullscreen", "fullscreenElement", "fullscreenEnabled", "fullscreenchange", "fullscreenerror"],
                        ["webkitRequestFullscreen", "webkitExitFullscreen", "webkitFullscreenElement", "webkitFullscreenEnabled", "webkitfullscreenchange", "webkitfullscreenerror"],
                        ["webkitRequestFullScreen", "webkitCancelFullScreen", "webkitCurrentFullScreenElement", "webkitCancelFullScreen", "webkitfullscreenchange", "webkitfullscreenerror"],
                        ["mozRequestFullScreen", "mozCancelFullScreen", "mozFullScreenElement", "mozFullScreenEnabled", "mozfullscreenchange", "mozfullscreenerror"],
                        ["msRequestFullscreen", "msExitFullscreen", "msFullscreenElement", "msFullscreenEnabled", "MSFullscreenChange", "MSFullscreenError"]
                    ], r = 0, o = n.length, s = {}; r < o; r++)
                    if ((e = n[r]) && e[1] in document) {
                        for (r = 0, t = e.length; r < t; r++) s[n[0][r]] = e[r];
                        return s
                    }
                return !1
            }(),
            r = {
                request: function(e) {
                    var r = n.requestFullscreen;
                    e = e || document.documentElement, /5\.1[\.\d]* Safari/.test(navigator.userAgent) ? e[r]() : e[r](t && Element.ALLOW_KEYBOARD_INPUT)
                },
                exit: function() {
                    document[n.exitFullscreen]()
                },
                toggle: function(e) {
                    this.isFullscreen ? this.exit() : this.request(e)
                },
                onchange: function() {},
                onerror: function() {},
                raw: n
            };
        n ? (Object.defineProperties(r, {
            isFullscreen: {
                get: function() {
                    return !!document[n.fullscreenElement]
                }
            },
            element: {
                enumerable: !0,
                get: function() {
                    return document[n.fullscreenElement]
                }
            },
            enabled: {
                enumerable: !0,
                get: function() {
                    return !!document[n.fullscreenEnabled]
                }
            }
        }), document.addEventListener(n.fullscreenchange, function(e) {
            r.onchange.call(r, e)
        }), document.addEventListener(n.fullscreenerror, function(e) {
            r.onerror.call(r, e)
        }), e ? module.exports = r : window.screenfull = r) : e ? module.exports = !1 : window.screenfull = !1
    }(), angular.module("request", []).factory("request", ["$http", "$location", function(e, t) {
        var n = e.defaults.transformResponse;

        function r(t, r, o, i) {
            return "object" == typeof r ? (r = (i = r).url, o = i.data) : i || (i = {}), r = s(r, i.params || {}), e({
                url: r,
                method: t,
                data: o,
                transformResponse: n
            })
        }
        angular.isArray(n) || (n = [n]), r.get = function(e, t) {
            return r("get", e, void 0, t)
        }, r.put = function(e, t, n) {
            return r("put", e, t, n)
        }, r.post = function(e, t, n) {
            return r("post", e, t, n)
        }, r.delete = function(e, t) {
            return r("delete", e, void 0, t)
        };
        var o = /\{([^}]+)\}/g;

        function s(e, t) {
            var n = {},
                r = e.replace(o, function(e, r) {
                    if (r in t) {
                        n[r] = !0;
                        var o = t[r];
                        return void 0 === o && (o = ""), o
                    }
                    return "{}"
                });
            r = r.replace(/\/?\{\}/g, "");
            var s = [];
            for (var i in t)
                if (!n[i] && void 0 !== t[i])
                    if (t[i] instanceof Array)
                        for (var a = t[i], u = 0, c = a.length; u < c; u++) s.push(i + "=" + encodeURIComponent(a[u]));
                    else s.push(i + "=" + encodeURIComponent(t[i]));
            var l = s.join("&");
            return l && (r.indexOf("?") >= 0 ? r += "&" : r += "?", r += l), r
        }
        return r.uploadFile = function(t, n, r, o) {
            return o || (o = n.type), r && (t = s(t, r)), e.post(t, n, {
                transformRequest: angular.identity,
                headers: {
                    "Content-Type": o
                }
            })
        }, r.upload = function(t, n, r) {
            var o = new FormData;
            for (var i in n) {
                var a = n[i];
                o.append(i, a)
            }
            return r && (t = s(t, r)), e.post(t, o, {
                transformRequest: angular.identity,
                headers: {
                    "Content-Type": void 0
                }
            })
        }, r
    }]), courseViewer.config(["$locationProvider", "$interpolateProvider", "$anchorScrollProvider", function(e, t, n) {
        n.disableAutoScrolling(), window.history && history.pushState && e.html5Mode(!0), t.startSymbol("`"), t.endSymbol("`")
    }]), courseViewer.run(["$rootScope", function(e) {
        e.$on("$stateChangeError", function(e, t, n, r, o) {
            console.log("$stateChangeError - fired when an error occurs during transition."), console.log(arguments)
        }), e.$on("$stateNotFound", function(e, t, n, r) {
            console.log("$stateNotFound " + t.name + "  - fired when a state cannot be found by its name."), console.log(arguments)
        }), (debug = !1) && (e.$on("$stateChangeStart", function(e, t, n, r, o) {
            console.log("$stateChangeStart to " + t.name + "- fired when the transition begins."), console.log(arguments)
        }), e.$on("$stateChangeSuccess", function(e, t, n, r, o) {
            console.log("$stateChangeSuccess to " + t.name + "- fired once the state transition is complete."), console.log(arguments)
        }), e.$on("$viewContentLoaded", function(e) {
            console.log("$viewContentLoaded - fired after dom rendered", e)
        }))
    }]), angular.bootstrap(document.documentElement, ["courseViewer"]);