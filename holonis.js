Url = function(url) {
    this.parsed = url.match(/(.*)\/\/([^\/]+)(:?[0-9]*)([^\?]*)(\??[^#]*)(#?.*)/);
    if (this.parsed !== null) {
        this.protocol = this.parsed[1] ? this.parsed[1] : window.location.protocol;
        this.hostname = this.parsed[2];
        this.port = this.parsed[3];
        this.pathname = this.parsed[4];
        this.search = this.parsed[5];
        this.hash = this.parsed[6];
        this.args = this.parsed[5] ? (function(search) {
            var args = {},
                a = search.split(/&/),
                b = [],
                i = 0,
                l = a.length;
            for (; i < l; ++i) {
                b = a[i].split(/=/);
                args[b[0]] = b[1];
            }
            return args;
        }(this.parsed[5].split(/\?/)[1])) : {};
        return this;
    }
    return false;
};
Url.prototype.toString = function() {
    return this.protocol + '//' + this.hostname + this.pathname + (function(args, search) {
        if (search === '') return '';
        var s = [];
        for (var key in args) {
            var t = [key];
            args[key] !== undefined && t.push(args[key]);
            s.push(t.join('='));
        }
        return '?' + s.join('&');
    }(this.args, this.search)) + this.hash;
};
(function($) {
    'use strict';
    $.fn.replaceOnScroll = function(options) {
        options = $.extend({}, $.fn.replaceOnScroll.defaultOptions, options);
        var $target = (options.target && options.target.addClass) ? options.target : $(options.target);
        return this.each(function() {
            $.profile && console.log($(this).offset());
            var $this = $(this),
                $html = $(window),
                dim = {
                    h: $this.height()
                },
                min = {
                    h: 0
                },
                current = {
                    h: 0
                },
                progress = 0,
                level = 0,
                update = function() {
                    current.h = ($html.scrollTop() - options.offset.y);
                    min.h = $this.offset().top - options.offset.y * 2;
                    progress = (current.h - min.h) / dim.h;
                    level = options.progressiveOpacity ? Math.max(0, Math.min(1, progress)) : (progress > 0 ? 1 : 0);
                    typeof options.handler === 'function' && options.handler.call($this, $target, options, current, progress, level);
                },
                resizeTimeout = 0,
                resizeUpdate = function() {
                    clearTimeout(resizeTimeout);
                    setTimeout(update, 500);
                };
            $html.on('load scroll', update).on('resize', resizeUpdate);
            $this.data('replaceonscroll', {
                destroy: function() {
                    $html.off('load scroll', update).off('resize', resizeUpdate);
                    this.remove();
                }.bind($this)
            });
            $(update);
            typeof options.onStart === 'function' && options.onStart.call($this, $target);
        });
    };
    $.fn.replaceOnScroll.defaultOptions = {
        target: false,
        offset: {
            y: 0
        },
        progressiveOpacity: true,
        zIndex: 1100,
        onStart: function($target) {
            $target.css({
                opacity: 0,
                zIndex: -1
            });
        },
        handler: function($target, options, current, progress, level) {
            $target.css({
                opacity: level,
                zIndex: progress > 0 ? options.zIndex : -1
            });
        }
    };
}(jQuery));
(function($) {
    'use strict';
    $.fn.fixed = function(opts) {
        var addCssRule = false;
        opts = $.extend({}, $.fn.fixed.defaultOptions, opts);
        return this.each(function() {
            var $this = $(this),
                fixed = false,
                close = false,
                original = {
                    width: $this.width(),
                    height: $this.height(),
                    zindex: $this.css('z-index')
                },
                fixBreakPoint = $this.offset().top,
                addRule = function(rule) {
                    if (!addCssRule) {
                        $('body').append('<style type="text/css">' + rule + '</style>');
                        addCssRule = true;
                    }
                },
                addVideoBar = function() {
                    var $videoBar = $('<div class="videoBar"><div class="videoTitle">' + opts.title + '</div><div class="videoUnfixButton">X</div></div>');
                    $videoBar.insertBefore($this);
                    $('.videoUnfixButton').on('click', function() {
                        unfix();
                        close = true;
                        $this.data('player-fixed', 'closed');
                        $this.data('ccmvideoUtils').sendEvent('videoClosed', {
                            detail: {
                                node: $this
                            }
                        });
                        $.googleEvents && typeof $.googleEvents.send === 'function' && ($.googleEvents.send('ccmvideo', 'element unfixed', 'click'));
                    });
                },
                removeVideoBar = function() {
                    $this.prev().hasClass('videoBar') && ($this.prev().remove());
                },
                fix = function() {
                    fixed = true;
                    addRule('.videoFixed { position : fixed; top : ' + opts.offset + 'px; width : ' + original.width + 'px; height : ' + original.height + 'px; z-index : ' + opts.zindex + '; margin-top : 35px; box-shadow : 0px 0px 20px rgba(0,0,0,.5);}' + '.videoBar { position : fixed; top : ' + opts.offset + 'px; z-index : ' + opts.zindex + '; width : ' + original.width + 'px; height : 36px; background-color : black; color : white; text-align : left;}' + '.videoTitle { font-size : 12px; height : inherit; width : ' + (original.width - 50) + 'px; line-height : 34px; margin-left : 10px; text-overflow : ellipsis; overflow : hidden; white-space: nowrap;}' + '.videoUnfixButton{ font-family : Verdana, Geneva, sans-serif; font-size : 15px; top : 16px; position : absolute; right : 10px; color : rgba(252, 252, 252, 0.7); line-height : 0px;}' + '.videoUnfixButton:hover{ color : white; cursor : pointer; cursor : hand;}');
                    $this.addClass('videoFixed');
                    addVideoBar();
                    opts.forced && addFixContext();
                    $this.data('ccmvideoUtils').sendEvent('videoFixed', {
                        detail: {
                            node: $this
                        }
                    });
                    $.googleEvents && typeof $.googleEvents.send === 'function' && ($.googleEvents.send('ccmvideo', 'element fixed', 'scroll'));
                },
                unfix = function() {
                    fixed = false;
                    $this.removeClass('videoFixed');
                    removeVideoBar();
                    opts.forced && removeFixContext();
                    $this.data('ccmvideoUtils').sendEvent('videoUnfixed', {
                        detail: {
                            node: $this
                        }
                    });
                },
                transformedNodes = [],
                addFixContext = function() {
                    transformedNodes = [];
                    $this.parents().each(function() {
                        if ($(this).css('transform') !== 'none') {
                            if (this.style.transform !== '' && this.style.transform !== 'none') {
                                transformedNodes.push([this, this.style.transform]);
                            } else {
                                transformedNodes.push([this, '']);
                            }
                            $(this).css({
                                transform: 'none'
                            });
                        }
                    });
                },
                removeFixContext = function() {
                    transformedNodes.forEach(function(node) {
                        node[0].style.transform = node[1];
                    });
                };
            if (!opts.isNotFixed($this)) {
                $.fn.replaceOnScroll && typeof $.fn.replaceOnScroll === 'function' && ($this.replaceOnScroll({
                    handler: function($target, options, current, progress) {
                        if (!close) {
                            if (progress > 0 && !fixed) {
                                $this.data('player-fixed') !== 'closed' ? fix() : close = true;
                            }
                            if (fixed && opts.positionBack && $(window).scrollTop() < fixBreakPoint) {
                                unfix();
                                $.googleEvents && typeof $.googleEvents.send === 'function' && ($.googleEvents.send('ccmvideo', 'element unfixed', 'scroll'));
                            }
                        }
                    },
                    offset: {
                        y: opts.offset
                    }
                }));
                $this.fix = fix;
                $this.unfix = unfix;
                $(document).on('unfix', function(e, data) {
                    typeof data !== 'undefined' && typeof data.node !== 'undefined' && typeof data.node.unfix === 'function' && (data.node.unfix());
                });
            }
        });
    };
    $.fn.fixed.defaultOptions = {
        offset: 0,
        zindex: 10001,
        title: 'Titre par defaut',
        isNotFixed: function() {
            return false;
        },
        positionBack: false,
        forced: false
    };
})(jQuery);
(function($, console) {
    'use strict';
    $.pip = {
        defaultConfig: {
            width: 320,
            height: 180,
            left: 10,
            bottom: 10,
            zindex: 11000,
            title: 'Votre vidéo',
            positionBack: true,
            triggerMode: 'scroll',
            isNotFixed: function() {
                return false;
            }
        }
    };
    $.fn.pip = function(opts) {
        var addCssRule = false;
        opts = $.extend({}, $.pip.defaultConfig, opts);
        return this.each(function() {
            var $this = $(this),
                $parent = $this.parent(),
                original, mobileWidth, mobileHeight, width = opts.width,
                height = opts.height,
                fixed = false,
                close = false,
                fixBreakPoint, previousScrollTop = null,
                updateProperties = function() {
                    original = {
                        width: $this.width(),
                        height: $this.height(),
                        zindex: $this.css('z-index')
                    };
                    mobileWidth = opts.width < window.innerWidth / 2 ? opts.width : window.innerWidth / 2;
                    mobileHeight = original.height * mobileWidth / original.width;
                    addCssRule = false;
                },
                addRule = function(rule) {
                    if (!addCssRule) {
                        console.log('PIP - addRule');
                        $("#videoPIPCSS").remove();
                        $('body').append('<style id="videoPIPCSS" type="text/css">' + rule + '</style>');
                        addCssRule = true;
                    }
                },
                addVideoBar = function() {
                    var $videoBar = $('<div class="videoBar"><div class="videoTitle">' + opts.title + '</div><div class="videoUnfixButton">X</div></div>');
                    $videoBar.insertBefore($this);
                    $('.videoUnfixButton').on('click', function() {
                        unfix('click');
                        close = true;
                        $this.data('player-fixed', 'closed');
                        $this.data('ccmvideoUtils').sendEvent('videoPIPClosed', {
                            detail: {
                                node: $this
                            }
                        });
                    });
                },
                removeVideoBar = function() {
                    $this.prev().hasClass('videoBar') && ($this.prev().remove());
                },
                fix = function() {
                    fixed = true;
                    addRule('@media(min-device-width: 768px) {' + '.videoPIP { position : fixed; left : ' + opts.left + 'px; bottom : ' + opts.bottom + 'px; width : ' + width + 'px; height : ' + height + 'px; z-index : ' + opts.zindex + ';}' + '.videoBar { position : fixed; left : ' + opts.left + 'px; bottom : ' + (opts.bottom + height) + 'px; width : ' + width + 'px; height : 36px; z-index : ' + opts.zindex + '; background-color : black; color : white; text-align : left;}' + '.videoTitle { font-size : 12px; height : inherit; width : ' + (width - 50) + 'px; line-height : 34px; margin-left : 10px; text-overflow : ellipsis; overflow : hidden; white-space: nowrap;}' + '}' + '@media(max-device-width: 767px) {' + '.oo-player-container {min-width: ' + mobileWidth + 'px}' + '.videoPIP { position : fixed; right : ' + opts.left + 'px; bottom : ' + opts.bottom + 'px; width : ' + mobileWidth + 'px; height : ' + mobileHeight + 'px; z-index : ' + opts.zindex + ';}' + '.videoBar { position : fixed; right : ' + opts.left + 'px; bottom : ' + (opts.bottom + mobileHeight) + 'px; width : ' + mobileWidth + 'px; height : 36px; z-index : ' + opts.zindex + '; background-color : black; color : white; text-align : left;}' + '.videoTitle { font-size : 12px; height : inherit; width : ' + (mobileWidth - 50) + 'px; line-height : 34px; margin-left : 10px; text-overflow : ellipsis; overflow : hidden; white-space: nowrap;}' + '}' + '.videoUnfixButton{ font-family : Verdana, Geneva, sans-serif; font-size : 15px; top : 16px; position : absolute; right : 10px; color : rgba(252, 252, 252, 0.7); line-height : 0px;}' + '.videoUnfixButton:hover{ color : white; cursor : pointer; cursor : hand;}');
                    $this.addClass('videoPIP');
                    addVideoBar();
                    $this.data('player-fixed', 'fixed');
                    $this.data('ccmvideoUtils').sendEvent('videoPIPFixed', {
                        detail: {
                            node: $this
                        }
                    });
                    $.googleEvents && typeof $.googleEvents.send === 'function' && $.googleEvents.send('ccmvideo', 'element fixed', 'scroll');
                },
                unfix = function(eventAction) {
                    fixed = false;
                    $this.removeClass('videoPIP');
                    removeVideoBar();
                    $this.data('player-fixed', 'unfixed');
                    $this.data('ccmvideoUtils').sendEvent('videoPIPUnfixed', {
                        detail: {
                            node: $this
                        }
                    });
                    $.googleEvents && typeof $.googleEvents.send === 'function' && $.googleEvents.send('ccmvideo', 'element unfixed', eventAction);
                };
            if (!opts.isNotFixed($this)) {
                updateProperties();
                if (!close && opts.triggerMode === 'auto') {
                    $this.data('player-fixed') !== 'closed' ? fix() : close = true;
                }
                $.fn.replaceOnScroll && typeof $.fn.replaceOnScroll === 'function' && ($this.replaceOnScroll({
                    handler: function($target, options, current, progress, level) {
                        if (!fixed && (original.width !== $this.width() || original.height !== $this.height())) {
                            updateProperties();
                        }
                        if (!(mobileHeight > 0)) {
                            return;
                        }
                        fixBreakPoint = $parent.offset().top;
                        if (!close) {
                            var $window = $(window),
                                scrollTop = $window.scrollTop(),
                                windowHeight = $window.height();
                            if (!fixed) {
                                if (progress > 0 || (opts.triggerMode === 'scrollTop' && previousScrollTop !== null && previousScrollTop > scrollTop && (scrollTop + windowHeight < fixBreakPoint + original.height || scrollTop > fixBreakPoint)) || (opts.triggerMode === 'auto' && scrollTop + windowHeight < fixBreakPoint + original.height)) {
                                    $this.data('player-fixed') !== 'closed' ? fix() : close = true;
                                }
                            } else if (opts.positionBack && ((opts.triggerMode === 'scroll' && scrollTop < fixBreakPoint) || (opts.triggerMode === 'scrollTop' && ((previousScrollTop <= scrollTop && scrollTop < fixBreakPoint) || (previousScrollTop > scrollTop && scrollTop + windowHeight > fixBreakPoint + original.height && scrollTop < fixBreakPoint))) || (opts.triggerMode === 'auto' && scrollTop + windowHeight > fixBreakPoint + original.height && scrollTop < fixBreakPoint))) {
                                unfix('scroll');
                            }
                            previousScrollTop = scrollTop;
                        }
                    }
                }));
            }
        });
    };
})(jQuery, getConsole('ccmvideo'));
(function($, w, console) {
    'use strict';
    console.time("Temps avant requete AJAX p.ccmbg.com");
    console.time("Temps avant initOOPlayerFeature");
    console.time("Temps avant initOOPlayer");
    console.time("Temps avant requestSkyline");
    console.time("Temps avant requestApstag");
    console.time("Player Loaded");
    console.time("Lancement de la methode startPlayer");
    var
        begin = Date.now(),
        _count = 0,
        url = new Url('' + window.location),
        iosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent),
        hostname = window.location.hostname,
        wsHostname = (typeof hostname !== 'undefined') ? ((/local/.test(hostname)) ? 'media.local.ccmbg.com' : ((/qlf/.test(hostname)) ? 'p.qlf.ccmbg.com' : 'p.ccmbg.com')) : 'p.ccmbg.com',
        isCorrupted = typeof w.integrityObserver !== 'undefined' ? w.integrityObserver.corrupted : (asl.loaded === 0),
        zenMode = false,
        playerVersion = '4.22.11',
        loadPlayerFromOoyala = true,
        loadingPlayerCheckTime = false,
        playerV4Loading = 'unstarted',
        nodesToWarnOnLoad = [],
        playingNodeId = null,
        logEnable = (typeof hostname !== 'undefined' && /local|qlf/.test(hostname)) ? true : (Math.floor(Math.random() * 100) === 0 && !isCorrupted),
        mutePlayingLogEnable = logEnable,
        uniqueLogId = (new Date().getTime() + Math.floor((Math.random() * 10000) + 1)).toString(16),
        displayFormat = 'default',
        statEvent = function(metric, force) {
            typeof force === 'undefined' && (force = false);
            if (force !== true) {
                return;
            }
            $.ajax({
                url: '//p.ccmbg.com/event/',
                dataType: 'json',
                type: 'POST',
                cache: false,
                data: {
                    m: metric
                }
            });
        },
        getVideosProperties = function() {
            console.time("Temps de parsing de la page pour detection player");
            var gets = [];
            for (var i = 0; i < this.length; i++) {
                var $this = $(this[i]);
                if ($this.attr('data-player-ready') !== '1') {
                    $this.attr({
                        'data-player-ready': '1'
                    });
                    gets.push(getVideoProperties.call(this[i]));
                } else {
                    this.splice(i, 1);
                    i--;
                }
            }
            if (logEnable) {
                var timeSpent = (Date.now() - begin);
                logmatic.log('[PLAYER-VIDEO] Detection des players', {
                    type: "log",
                    severity: "info",
                    subject: "logs chargement player",
                    version: 1,
                    extra: {
                        duration: timeSpent,
                        id: uniqueLogId
                    }
                });
            }
            console.timeEnd("Temps de parsing de la page pour detection player");
            return Promise.all(gets);
        },
        getVideoProperties = function() {
            var $this = $(this),
                properties = {
                    rid: $this.attr('data-id'),
                    rkey: $this.attr('data-key'),
                    displayFormat: $this.attr('data-display-format') || displayFormat,
                    platform: 'html5-priority',
                    deviceType: 0,
                    options: {
                        popup: false
                    },
                    player: {
                        type: 'default'
                    }
                };
            return new Promise(function(resolve, reject) {
                var na = zenMode ? '1' : $this.attr('data-ad') || '',
                    controllerUrl = '/media/index.php',
                    ecm = $this.attr('data-enable-cache') === '1' ? 1 : 0;
                if (logEnable) {
                    var timeSpent = (Date.now() - begin);
                    logmatic.log('[PLAYER-VIDEO] Temps avant requete AJAX p.ccmbg.com', {
                        type: "log",
                        severity: "info",
                        subject: "logs chargement player",
                        version: 1,
                        extra: {
                            duration: timeSpent,
                            id: uniqueLogId
                        }
                    });
                }
                console.timeEnd("Temps avant requete AJAX p.ccmbg.com");
                console.time("Durée requete AJAX vers p.ccmbg.com");
                $.ajax({
                    url: '//' + wsHostname + controllerUrl,
                    dataType: 'json',
                    cache: true,
                    data: {
                        rid: properties.rid,
                        rkey: properties.rkey,
                        ap: $this.attr('data-ap') || '',
                        na: na,
                        site: $this.attr('data-site') || '',
                        h5: !$.support.flash,
                        k: isCorrupted,
                        ecm: ecm,
                        dbg: url.args.dbg
                    },
                    success: function(data) {
                        if (logEnable) {
                            var timeSpent = (Date.now() - begin);
                            logmatic.log('[PLAYER-VIDEO] Requete AJAX vers p.ccmbg.com', {
                                type: "log",
                                severity: "info",
                                subject: "logs chargement player",
                                version: 1,
                                extra: {
                                    duration: timeSpent,
                                    id: uniqueLogId
                                }
                            });
                        }
                        console.timeEnd("Durée requete AJAX vers p.ccmbg.com");
                        var fixed = url.args.videoFixed,
                            fixedMode = url.args.videoFixedMode,
                            videoOffset = url.args.videoOffset,
                            force = url.args.force,
                            positionBack = url.args.positionBack,
                            triggerMode = url.args.triggerMode;
                        typeof data.options !== 'undefined' && typeof data.options.fixed === 'undefined' && (data.options.fixed = {
                            enable: Boolean(fixed),
                            mode: parseInt(fixedMode) || 0,
                            offset: parseInt(videoOffset) || 0,
                            force: Boolean(force),
                            positionBack: Boolean(positionBack),
                            triggerMode: String(triggerMode) || 'scroll'
                        });
                        properties = $.extend({}, true, properties, data);
                        resolve(properties);
                    },
                    error: reject
                });
            });
        },
        getDiscoveryVideosData = function(embedCode, node) {
            var na = zenMode ? '1' : node.attr('data-ad') || '',
                site = node.attr('data-site') || '',
                key = site + '|' + na + '|' + embedCode,
                ecm = node.attr('data-enable-cache') === '1' ? 1 : 0;
            if (Object.prototype.toString.call(getDiscoveryVideosData.dataList[key]) === '[object Promise]') {
                return getDiscoveryVideosData.dataList[key];
            }
            getDiscoveryVideosData.dataList[key] = new Promise(function(resolve, reject) {
                if (typeof getDiscoveryVideosData.dataList[key] !== 'undefined' && Object.prototype.toString.call(getDiscoveryVideosData.dataList[key]) === '[object Promise]') {
                    resolve(getDiscoveryVideosData.dataList[key]);
                } else {
                    $.ajax({
                        url: '//' + wsHostname + '/media/index.php',
                        dataType: 'json',
                        cache: true,
                        data: {
                            ec: embedCode,
                            na: na,
                            site: site,
                            k: isCorrupted,
                            ecm: ecm,
                            dbg: url.args.dbg
                        },
                        success: function(data) {
                            getDiscoveryVideosData.dataList[key] = data;
                            resolve(getDiscoveryVideosData.dataList[key]);
                        },
                        error: reject
                    });
                }
            });
            return getDiscoveryVideosData.dataList[key];
        },
        wav = 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQIAAAAAAA',
        fakeAudio = wav + btoa(wav),
        audioPermitted = function() {
            return new Promise(function(resolve, reject) {
                let playing = new Audio(fakeAudio).play();
                if (playing !== undefined) {
                    playing.then(function() {
                        resolve('permitted');
                    }).catch(function() {
                        reject('refused');
                    });
                } else {
                    resolve('nostrategy');
                }
            });
        },
        waitForSoundPermission = function(interval) {
            typeof interval === 'undefined' && (interval = 250);
            return new Promise(function(resolve) {
                var check = function() {
                    audioPermitted().then(resolve).catch(function() {
                        setTimeout(check, interval);
                    });
                };
                check();
            });
        },
        startPlayback = function(player, $node, checkAudio) {
            var nodeId = typeof $node === 'undefined' ? '' : $node.attr('id');
            if (typeof checkAudio === 'undefined') {
                checkAudio = false;
            } else if ($node.data('player-fixed') === 'fixed') {
                addUnmuteButton(player, nodeId);
                player.mute();
                checkAudio = false;
            }
            if (!checkAudio) {
                player.play();
                return;
            }
            audioPermitted().then(function() {
                player.play();
            }).catch(function() {
                var $unmuteButton = addUnmuteButton(player, nodeId);
                player.play();
                waitForSoundPermission().then(function() {
                    if ($node.data('player-fixed') !== 'closed') {
                        player.unmute();
                        $unmuteButton.remove();
                    }
                });
            });
        },
        addUnmuteButton = function(player, nodeId) {
            if ($('#' + nodeId).find(".oo-unmute").length === 0) {
                player.mute();
                var $skinDiv = $('#' + nodeId).find(".oo-player-skin"),
                    $unmuteButton = $('<button class="oo-unmute" type="button" aria-label="Unmute"><div class="oo-unmute-icon-wrapper"><span class="oo-icon oo-icon-volume-mute-ooyala-default " style="font-family:ooyala-slick-type;">p</span></div></button>');
                $unmuteButton.on('click', function() {
                    player.unmute();
                    $unmuteButton.remove();
                });
                $skinDiv.append($unmuteButton);
                return $unmuteButton;
            }
        },
        addCloseButton = function(player, $node, show) {
            var $skinDiv = $node.find(".oo-player-skin"),
                $closeButton = $('<button class="oo-close" type="button" aria-label="Close"><div><span>X</span></div></button>');
            $closeButton.on('click', function() {
                player.mute();
                $closeButton.remove();
                $node.data('player-fixed', 'closed');
                addUnmuteButton(player, $node.attr('id'));
                $node.data('ccmvideoUtils').sendEvent('playerClosed', {
                    detail: {
                        node: $node
                    }
                });
            });
            show !== true && ($closeButton.hide());
            $skinDiv.append($closeButton);
            $node.data('ccmvideoUtils').addListenerMulti(document, 'videoFixed videoPIPFixed', function(e) {
                if (typeof e.detail.node !== 'undefined' && e.detail.node.attr('id') === $node.attr('id')) {
                    $closeButton.hide();
                }
            });
            $node.data('ccmvideoUtils').addListenerMulti(document, 'videoUnfixed videoPIPUnfixed', function(e) {
                if (typeof e.detail.node !== 'undefined' && e.detail.node.attr('id') === $node.attr('id')) {
                    $closeButton.show();
                }
            });
            $node.data('ccmvideoUtils').addListenerMulti(document, 'videoPIPClosed videoClosed', function(e) {
                if (typeof e.detail.node !== 'undefined' && e.detail.node.attr('id') === $node.attr('id')) {
                    $closeButton.remove();
                    $node.data('ccmvideoUtils').sendEvent('playerClosed', {
                        detail: {
                            node: $node
                        }
                    });
                }
            });
        },
        addErrorMessage = function(nodeId) {
            $('<div>', {
                css: {
                    height: "100%",
                    backgroundColor: "#000",
                    color: "#999",
                    textAlign: "center"
                },
                html: "<br><br>Une erreur est survenue au chargement du player.<br>Si vous avez un bloqueur de pub, merci de recharger la page après l'avoir désactivé."
            }).appendTo('#' + nodeId);
        },
        checkIntersectionRatio = function(player, $node) {
            window.parent.postMessage({
                sentinel: 'amp',
                type: 'send-intersections'
            }, '*');
            window.addEventListener('message', function(event) {
                if (event.source !== window.parent || event.origin === window.location.origin || !event.data || event.data.sentinel !== 'amp' || event.data.type !== 'intersection') {
                    return;
                }
                event.data.changes.forEach(function(change) {
                    var isPlaying = player.isPlaying(),
                        playheadTime = player.getPlayheadTime();
                    if (typeof change.intersectionRatio !== 'undefined' && change.intersectionRatio > 0 && !isPlaying && (playheadTime <= 0)) {
                        startPlayback(player, $node, true);
                    }
                });
            });
        };
    getDiscoveryVideosData.dataList = {};
    $.fn.videoConvertFromIframe = function() {
        var self = this;
        return this.each(function(i) {
            var $original = $(this),
                url, $newNode;
            if ($original[0].tagName === 'IFRAME') {
                url = new Url($original.attr('src'));
                if (url && typeof url.args.rid !== 'undefined' && typeof url.args.rkey !== 'undefined') {
                    $newNode = $.videoNodeCreate(url.args.rid, url.args.rkey, url.args.site, {
                        ap: url.args.ap,
                        ad: url.args.na
                    }).addClass($original.prop('className')).css({
                        width: $original.css('width'),
                        height: $original.css('height'),
                        position: $original.css('position')
                    });
                    $original.replaceWith($newNode);
                    self[i] = $newNode[0];
                    $original[0] = $newNode[0];
                }
            } else if (!/jOOPlayer_/.test($original.attr('id'))) {
                $original.attr({
                    id: 'jOOPlayer_' + _count++,
                    'data-player-number': _count
                });
            }
        });
    }, $.fn.addCssForLegacyCode = function() {
        return this.each(function() {
            var $self = $(this).addClass('ccmPlayer'),
                $parent = $self.parent();
            if ($parent.hasClass('ccmPlayerPortrait') === false && $self.attr('data-player-ready') !== '1') {
                $parent.addClass('jccmPlayerParent ccmPlayerParent').before("<style>" + ".ccmPlayerParent {position:relative;max-width:100%;padding-bottom:56%;clear:both}\n" + ".ccmPlayer {position:absolute;width:100%;height:100%;background:url('//" + $.jet.env.packager.getHostName() + "/media.ccmbg.com/img/loading.gif" + "') 50% 50%/cover}\n" + "@media only screen and (min-device-width:801px) and (max-width:500px) {\n" + ".app--rwd .ccmcss_offcanvas_1 {overflow:visible!important}\n" + ".ccmPlayerParent {max-width:none!important;width:400px;height:300px;padding-bottom:0!important}\n" + "}\n" + "</style>").removeAttr("style");
                $self.removeAttr("style");
            }
        });
    }, $.fn.videoDestroy = function(handler) {
        if (typeof this.data('player') !== "undefined") {
            var $self = this;
            this.data('player').destroy(function() {
                handler.call($self);
                var replaceInstance = $self.data('replaceonscroll');
                if (typeof replaceInstance !== 'undefined') {
                    replaceInstance.destroy();
                } else {
                    $self.remove();
                }
            });
        } else {
            handler.call(this);
            this.remove();
        }
        return this;
    }, $.videoNodeCreate = function(id, key, site, options) {
        if (typeof id !== 'string' || typeof key !== 'string' || typeof site !== 'string') {
            throw '$.videoNodeCreate : incorrect parameters';
        }
        options = $.extend({}, $.videoNodeCreate.defaultOptions, options);
        return $('<div></div>').attr({
            'data-id': id,
            'data-key': key,
            'data-ap': options.ap,
            'data-site': site,
            'data-ad': options.ad,
            id: 'jOOPlayer_' + _count++,
            'data-player-number': _count
        });
    }, $.fn.videoReplace = function(id, key, site, options) {
        options = $.extend({}, $.fn.videoReplace.defaultOptions, options);
        return this.videoDestroy(function() {
            var $node = $.videoNodeCreate(id, key, site, {
                ad: options.ad,
                ap: options.ap
            }).insertAfter(this);
            if (options.applyCss) {
                $node.css({
                    width: this.css('width'),
                    height: this.css('height'),
                    position: this.css('position')
                }).addClass(this.prop('className'));
            }
            options.onReplaced.call($node);
            $node.videoInit();
        });
    }, $.fn.videoInit = $.fn.videoOnScroll = function(options) {
        console.log('videoInit', this);
        options = $.extend({}, $.fn.videoInit.defaultOptions, options);
        zenMode = options.zenMode;
        var CustomEvent = window.CustomEvent;
        if (typeof CustomEvent !== 'function') {
            CustomEvent = function(event, params) {
                params = params || {
                    bubbles: false,
                    cancelable: false,
                    detail: undefined
                };
                var evt = document.createEvent('CustomEvent');
                evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
                return evt;
            };
            CustomEvent.prototype = window.Event.prototype;
        }
        var self = this.videoConvertFromIframe().addCssForLegacyCode(),
            ccmvideoUtils = {
                sendEvent: function(evt, params) {
                    params = params || {};
                    document.dispatchEvent(new CustomEvent(evt, params));
                },
                addListenerMulti: function(element, eventNames, listener) {
                    var events = eventNames.split(' ');
                    for (var i = 0, iLen = events.length; i < iLen; i++) {
                        element.addEventListener(events[i], listener, false);
                    }
                }
            };
        if (self.data('displayFormat')) {
            displayFormat = self.data('displayFormat');
        }
        if (displayFormat === 'amp') {
            self.addClass('ccmPlayer').parent().before("<style>" + "button.oo-control-bar-item {flex-direction: column;}" + ".oo-player-container .oo-control-bar .oo-control-bar-items-wrapper .oo-control-bar-duration {top:5px;}" + "body{margin:0;overflow: hidden;}" + "</style>");
        }
        getVideosProperties.call(self).then(function(videosProperties) {
            var mainPlayerPosition = -1;
            if (options.autoplayOnlyFirst) {
                for (var i = 0, l = videosProperties.length; i < l; ++i) {
                    if ((videosProperties[i].options.autoplay || videosProperties[i].options.scrollToPlay) && typeof videosProperties[i].error === 'undefined') {
                        mainPlayerPosition = i;
                        for (var j = i + 1, k = videosProperties.length; j < k; ++j) {
                            videosProperties[j].options.autoplay = false;
                            videosProperties[j].options.scrollToPlay = false;
                            if (typeof videosProperties[j].options.fixed !== 'undefined') {
                                videosProperties[j].options.fixed.enable = false;
                            }
                        }
                    } else {
                        if (typeof videosProperties[i].options.fixed !== 'undefined') {
                            videosProperties[i].options.fixed.enable = false;
                        }
                    }
                }
            }
            if (mainPlayerPosition > -1 && videosProperties[mainPlayerPosition].options.skyline === true) {
                for (var i = 0, l = videosProperties.length; i < l; ++i) {
                    if (i !== mainPlayerPosition) {
                        videosProperties[i].options.skyline = false;
                    }
                }
            } else {
                mainPlayerPosition = -1;
                for (var k = 0, l = videosProperties.length; k < l; ++k) {
                    if (videosProperties[k].options.skyline === true && mainPlayerPosition === -1) {
                        mainPlayerPosition = k;
                    } else {
                        videosProperties[k].options.skyline = false;
                    }
                }
            }
            return videosProperties;
        }).then(function(videosProperties) {
            self.each(function(i) {
                console.log('Loading Player for div', $(this));
                var $this = $(this),
                    properties = videosProperties[i],
                    getCcmPlayerParent = function() {
                        var $parent = $this.parent();
                        if ($parent.hasClass('jccmPlayerParent') || $parent.attr('style') === "position:relative;max-width:100%;padding-bottom:56%;clear:both;") {
                            return $parent;
                        }
                        return $();
                    };
                $this.data('ccmvideoUtils', ccmvideoUtils);
                if (typeof properties.error !== 'undefined') {
                    getCcmPlayerParent().hide();
                } else if (isCorrupted && properties.options.aabm === true) {
                    addErrorMessage($this.attr('id'));
                } else {
                    var initOOPlayerFeature = function() {
                        if (logEnable) {
                            var timeSpent = (Date.now() - begin);
                            logmatic.log('[PLAYER-VIDEO] Temps avant initOOPlayerFeature', {
                                type: "log",
                                severity: "info",
                                subject: "logs chargement player",
                                version: 1,
                                extra: {
                                    duration: timeSpent,
                                    id: uniqueLogId
                                }
                            });
                        }
                        console.timeEnd("Temps avant initOOPlayerFeature");
                        console.time("Fin initOOPlayerFeature");
                        console.log('initOOPlayerFeature', $this);
                        var triggerModeFixed = typeof properties.options.fixed.triggerMode !== 'undefined' ? properties.options.fixed.triggerMode : options.triggerModeFixed;
                        if (triggerModeFixed === 'auto') {
                            properties.options.muteFirstPlay = true;
                        }
                        var $win = $(w),
                            $doc = $(document),
                            state = {
                                started: false
                            },
                            scrollLevel = $this.height(),
                            player = initOOPlayer.call($this, properties, state);
                        if (displayFormat === 'amp' && (properties.options.scrollToPlay || properties.options.autoplay)) {
                            checkIntersectionRatio(player, $this);
                        }
                        $this.trigger('eventFromVideo', [{
                            type: 'init'
                        }]).addClass('jInit');
                        if (properties.options.scrollToPlay && displayFormat === 'default') {
                            typeof properties.options.scrollPercentage === 'undefined' && (properties.options.scrollPercentage = 100);
                            scrollLevel = scrollLevel * properties.options.scrollPercentage / 100;
                            var checkNodePos = function() {
                                var checkAudio = true;
                                if (state.readyToStart && !state.started && $this.is(':visible') && ($this.offset().top + scrollLevel) < $win.height() + $doc.scrollTop()) {
                                    typeof player === 'undefined' && (player = $this.data('player'));
                                    if (typeof properties.options.muteFirstPlay !== 'undefined' && properties.options.muteFirstPlay === true) {
                                        checkAudio = false;
                                    }
                                    player && startPlayback(player, $this, checkAudio);
                                    state.started = true;
                                    $this.trigger('eventFromVideo', [{
                                        type: 'play'
                                    }]);
                                }
                            };
                            if (iosDevice) {
                                $win.on('touchstart', checkNodePos);
                            } else {
                                $win.on('resize scroll touchmove mouseover mousedown', checkNodePos);
                            }
                            if (!iosDevice) {
                                $(checkNodePos);
                                $doc.on('eventFromVideo', function(e, data) {
                                    if (data.type === 'ready') {
                                        checkNodePos();
                                    }
                                });
                                checkNodePos({
                                    type: 'direct'
                                });
                            }
                        }
                        if (properties.options.fixed.enable && displayFormat === 'default') {
                            ccmvideoUtils.addListenerMulti(document, 'videoFixed videoPIPFixed', function() {
                                properties.options.fixed.active = true;
                            });
                            ccmvideoUtils.addListenerMulti(document, 'videoUnfixed videoPIPUnfixed', function() {
                                properties.options.fixed.active = false;
                            });
                            ccmvideoUtils.addListenerMulti(document, 'videoClosed videoPIPClosed', function() {
                                typeof player === 'undefined' && (player = $this.data('player'));
                                addUnmuteButton(player, $this.attr('id'));
                            });
                            if (typeof properties.options.fixed.mode === 'undefined' || properties.options.fixed.mode === 0) {
                                inView('#' + $this.attr('id')).on('enter', function() {
                                    $this.fixed({
                                        offset: properties.options.fixed.offset,
                                        title: properties.videoTitle,
                                        isNotFixed: options.isNotFixed,
                                        forced: typeof properties.options.fixed.force !== 'undefined' ? properties.options.fixed.force : options.forceFixed,
                                        positionBack: typeof properties.options.fixed.positionBack !== 'undefined' ? properties.options.fixed.positionBack : options.positionBackFixed
                                    });
                                });
                            } else if (properties.options.fixed.mode === 1) {
                                $this.pip({
                                    title: properties.videoTitle,
                                    isNotFixed: options.isNotFixed,
                                    forced: true,
                                    positionBack: typeof properties.options.fixed.positionBack !== 'undefined' ? properties.options.fixed.positionBack : options.positionBackFixed,
                                    triggerMode: triggerModeFixed
                                });
                            }
                        }
                        if (logEnable) {
                            var timeSpent = (Date.now() - begin);
                            logmatic.log('[PLAYER-VIDEO] Execution initOOPlayerFeature', {
                                type: "log",
                                severity: "info",
                                subject: "logs chargement player",
                                version: 1,
                                extra: {
                                    duration: timeSpent,
                                    id: uniqueLogId
                                }
                            });
                        }
                        console.timeEnd("Fin initOOPlayerFeature");
                    };
                    getCcmPlayerParent().show();
                    switch (properties.player.type) {
                        case 'embeded':
                            $this.replaceWith(properties.player.embededCode);
                            break;
                        case 'V4':
                            if (typeof properties.player.version !== 'undefined') {
                                playerVersion = properties.player.version;
                            }
                            properties.player.version = url.args.opv;
                            if (typeof properties.player.version === 'undefined' || properties.player.version.match(/4\.([0-9]+)\.([0-9]+)/i) === null) {
                                properties.player.version = playerVersion;
                            }
                            if (typeof url.args.oplfo !== 'undefined') {
                                url.args.oplfo === 'false' && (loadPlayerFromOoyala = false);
                            }
                            if (typeof url.args.oplct !== 'undefined') {
                                loadingPlayerCheckTime = url.args.oplct === 'true';
                            }
                            $this.on('playerV4Loaded', function(e, data) {
                                if (data.state === 'success') {
                                    var beginBeforeOOReady = Date.now();
                                    console.time('Player - OO.Ready waiting');
                                    OO.ready(function() {
                                        if (logEnable) {
                                            var timeSpent = (Date.now() - beginBeforeOOReady);
                                            logmatic.log('[PLAYER-VIDEO] OO.Ready end waiting', {
                                                type: "log",
                                                severity: "info",
                                                subject: "logs chargement player",
                                                version: 1,
                                                extra: {
                                                    duration: timeSpent,
                                                    id: uniqueLogId
                                                }
                                            });
                                        }
                                        console.timeEnd('Player - OO.Ready waiting');
                                        initOOPlayerFeature();
                                    });
                                } else {
                                    properties.options.aabm === true && (addErrorMessage($this.attr('id')));
                                }
                            });
                            if (playerV4Loading === 'unstarted') {
                                playerV4Loading = 'started';
                                nodesToWarnOnLoad.push($this[0]);
                                loadPlayerV4(properties).then(function() {
                                    if (logEnable) {
                                        var timeSpent = (Date.now() - begin);
                                        logmatic.log('[PLAYER-VIDEO] Chargement des scripts OOyala', {
                                            type: "log",
                                            severity: "info",
                                            subject: "logs chargement player",
                                            version: 1,
                                            extra: {
                                                duration: timeSpent,
                                                id: uniqueLogId
                                            }
                                        });
                                        logmatic.log('[PLAYER-VIDEO] Player chargé', {
                                            type: "log",
                                            severity: "info",
                                            subject: "logs chargement player",
                                            version: 1,
                                            extra: {
                                                duration: timeSpent,
                                                id: uniqueLogId
                                            }
                                        });
                                    }
                                    console.timeEnd("Fin de chargement des scripts OOyala");
                                    console.timeEnd("Player Loaded");
                                    playerV4Loading = 'success';
                                    $(nodesToWarnOnLoad).trigger('playerV4Loaded', {
                                        state: playerV4Loading
                                    });
                                }).catch(function(vowError) {
                                    console.warn("Error on getting a script for ooyala player v4", vowError);
                                    playerV4Loading = 'error';
                                    $(nodesToWarnOnLoad).trigger('playerV4Loaded', {
                                        state: playerV4Loading
                                    });
                                });
                            } else if (playerV4Loading !== 'started') {
                                $this.trigger('playerV4Loaded', {
                                    state: playerV4Loading
                                });
                            } else if (playerV4Loading === 'started') {
                                nodesToWarnOnLoad.push($this[0]);
                            }
                            break;
                        default:
                            loadPlayerv3($this, properties).then(function() {
                                initOOPlayerFeature();
                            }).catch(function(vowError) {
                                console.warn("Error on getting a script for ooyala player v3", vowError);
                            });
                    }
                }
            });
        }).catch(function(e) {
            console.warn("Error on getting video properties", e);
        });
        return this;
    };
    var loadEStat = function() {
            if (!loadEStat.isLoaded) {
                loadEStat.isLoaded = true;
                return vow('//prof.estat.com/js/mu-5.2.js').catch(function() {});
            } else {
                return Promise.resolve();
            }
        },
        loadPlayerv3 = function($this, properties) {
            loadEStat();
            if (loadingPlayerCheckTime === true) {
                console.time('Player - Loading');
            }
            return vow('//player.ooyala.com/v3/' + properties.playerID + '?platform=' + properties.platform + '&namespace=' + $this.attr('id'));
        },
        loadPlayerV4 = function(properties) {
            console.log('Load Player V4');
            loadEStat();
            var ooyalaScriptToLoad = [],
                urlRegExp = /^(css!)?((.+(\/css\/).+)|(.+))/,
                playerHostname = '//player.ooyala.com/static/v4/stable/';
            if (loadPlayerFromOoyala === false) {
                playerHostname = '//astatic.ccmbg.com/ressource/common/js/ooyala/';
            }
            ooyalaScriptToLoad = [playerHostname + properties.player.version + '/core.min.js'];
            ooyalaScriptToLoad = ooyalaScriptToLoad.concat([playerHostname + properties.player.version + '/video-plugin/main_html5.min.js', playerHostname + properties.player.version + '/video-plugin/bit_wrapper.min.js', playerHostname + properties.player.version + '/video-plugin/youtube.min.js']);
            if (typeof properties.options.platform === 'undefined') {
                ooyalaScriptToLoad = ooyalaScriptToLoad.concat([playerHostname + properties.player.version + '/video-plugin/osmf_flash.min.js']);
            }
            ooyalaScriptToLoad = ooyalaScriptToLoad.concat(['//player.ooyala.com/static/v4/stable/' + properties.player.version + '/skin-plugin/html5-skin.min.js', '//player.ooyala.com/static/v4/stable/' + properties.player.version + '/skin-plugin/html5-skin.min.css']);
            ooyalaScriptToLoad = ooyalaScriptToLoad.concat([$.jet.env.packager.get('ccmooyalaskin', 'css')]);
            if (typeof properties.options['google-ima-ads-manager'] !== 'undefined') {
                ooyalaScriptToLoad = ooyalaScriptToLoad.concat([playerHostname + properties.player.version + '/ad-plugin/google_ima.min.js']);
            }
            if (properties.options.discovery === true) {
                ooyalaScriptToLoad = ooyalaScriptToLoad.concat([playerHostname + properties.player.version + '/other-plugin/discovery_api.min.js']);
            }
            if (loadingPlayerCheckTime === true) {
                console.time('Player - Loading');
            }
            return Promise.all(ooyalaScriptToLoad.map(function(url) {
                var urlParse = url.match(urlRegExp),
                    options = {
                        async: false
                    };
                (urlParse[1] === 'css!' || urlParse[4] === '/css/') && (options.type = 'css');
                console.time("Fin de chargement des scripts OOyala");
                return vow(urlParse[2], options);
            }));
        },
        initOOPlayer = function(properties, state) {
            if (logEnable) {
                var timeSpent = (Date.now() - begin);
                logmatic.log('[PLAYER-VIDEO] Temps avant initOOPlayer', {
                    type: "log",
                    severity: "info",
                    subject: "logs chargement player",
                    version: 1,
                    extra: {
                        duration: timeSpent,
                        id: uniqueLogId
                    }
                });
            }
            console.timeEnd("Temps avant initOOPlayer");
            console.time("initOOPlayer");
            var $this = this,
                nodeID = $this.attr('id'),
                namespace = properties.player.type === 'V4' ? OO : (w[nodeID] ? w[nodeID] : OO),
                videoPlayer, eStatInit = false,
                eStatNS = false,
                eSTag = false,
                eSTagSerial = typeof properties.mms !== 'undefined' ? properties.mms : 240040210910,
                playEventToSend = false,
                checkPlayEventToSend = false,
                playerStarted = false,
                playerAdPlaying = false,
                playerPlaying = false,
                playerTag = '',
                playerPos, playerVideoDuration, playerSkinVisibility = true,
                adSetWithFallback = Object.prototype.toString.call(properties.options.adSet) === "[object Array]" && properties.options.adSet.length > 1,
                playerAdsChecked = !adSetWithFallback,
                skylineAuthorized = (typeof properties.options.skyline !== 'undefined' && properties.options.skyline === true),
                skylineMode = false,
                skylineRequestDone = false,
                skylinePreviousAdUnitCode, apstagMode = false,
                apstagRequestDone = false,
                dfpInitialPrerollAdTag = '',
                dfpPrerollAdTag = '',
                discoveryUpdateAdConf = (typeof properties.options.discoveryUAC !== 'undefined' && properties.options.discoveryUAC === true),
                aab, initEStat = function() {
                    if (!eStatInit || eStatNS) {
                        playerVideoDuration = videoPlayer.getDuration();
                        if (typeof(playerVideoDuration) !== 'undefined') {
                            !/\./.test(playerVideoDuration) && (playerVideoDuration = playerVideoDuration / 1000);
                            playerVideoDuration = Math.floor(playerVideoDuration);
                        } else {
                            return;
                        }
                    }
                    if (!eStatInit) {
                        try {
                            eStatInit = true;
                            eSTag = new eStatTag({
                                serial: eSTagSerial,
                                measure: 'streaming',
                                streaming: {
                                    diffusion: 'replay',
                                    callbackPosition: getPlayerPos,
                                    playerObj: playerTag,
                                    playerName: 'Ooyala-' + properties.player.type,
                                    streamName: videoPlayer.getEmbedCode(),
                                    streamDuration: playerVideoDuration
                                }
                            });
                        } catch (e) {
                            eStatInit = false;
                        }
                    } else if (eStatNS) {
                        eStatNS = false;
                        eSTag = new eStatTag({
                            serial: eSTagSerial,
                            measure: 'streaming',
                            streaming: {
                                diffusion: 'replay',
                                callbackPosition: getPlayerPos,
                                playerObj: playerTag,
                                playerName: 'Ooyala-' + properties.player.type,
                                streamName: videoPlayer.getEmbedCode(),
                                streamDuration: playerVideoDuration
                            }
                        });
                    }
                },
                notifyEStat = function(playerEvent, playerPosition) {
                    if (eStatInit === true) {
                        eSTag.notifyPlayer(playerEvent, playerPosition);
                    }
                },
                getPlayerPos = function() {
                    var pos = typeof playerPos !== 'undefined' ? playerPos : videoPlayer.getPlayheadTime();
                    return (typeof pos === 'undefined' || pos < 0) ? 0 : Math.floor(pos);
                },
                sendGAPlayerEvent = function(playerEvent) {
                    if (properties.options.ppEvent === true && $.googleEvents && typeof $.googleEvents.send === 'function') {
                        if (properties.options.fixed.active === true) {
                            $.googleEvents.send('ccmvideo', 'player ' + playerEvent, 'fixed');
                        } else {
                            $.googleEvents.send('ccmvideo', 'player ' + playerEvent, 'unfixed');
                        }
                    }
                },
                updatePlayerAdConf = function(adConf) {
                    if (typeof adConf['google-ima-ads-manager'] !== 'undefined' && Array.isArray(adConf['google-ima-ads-manager'].all_ads)) {
                        for (var i = 0; i < 2; i++) {
                            if (typeof videoOptions['google-ima-ads-manager'].all_ads[i] !== 'undefined') {
                                if (typeof adConf['google-ima-ads-manager'].all_ads[i] !== 'undefined') {
                                    videoPlayer.parameters['google-ima-ads-manager'].all_ads[i].position = videoOptions['google-ima-ads-manager'].all_ads[i].position = adConf['google-ima-ads-manager'].all_ads[i].position;
                                    videoPlayer.parameters['google-ima-ads-manager'].all_ads[i].position_type = videoOptions['google-ima-ads-manager'].all_ads[i].position_type = adConf['google-ima-ads-manager'].all_ads[i].position_type;
                                    videoPlayer.parameters['google-ima-ads-manager'].all_ads[i].tag_url = videoOptions['google-ima-ads-manager'].all_ads[i].tag_url = adConf['google-ima-ads-manager'].all_ads[i].tag_url;
                                } else {
                                    videoPlayer.parameters['google-ima-ads-manager'].all_ads[i].tag_url = videoOptions['google-ima-ads-manager'].all_ads[i].tag_url = undefined;
                                }
                            }
                        }
                        if (typeof adConf.adLoadTimeout !== 'undefined') {
                            videoPlayer.parameters.adLoadTimeout = videoOptions.adLoadTimeout = adConf.adLoadTimeout;
                        } else {
                            videoPlayer.parameters.adLoadTimeout = videoOptions.adLoadTimeout = 15;
                        }
                    } else {
                        if (typeof videoOptions['google-ima-ads-manager'] !== 'undefined' && Array.isArray(videoOptions['google-ima-ads-manager'].all_ads)) {
                            videoOptions['google-ima-ads-manager'].all_ads[0] !== 'undefined' && (videoPlayer.parameters['google-ima-ads-manager'].all_ads[0].tag_url = videoOptions['google-ima-ads-manager'].all_ads[0].tag_url = undefined);
                            videoOptions['google-ima-ads-manager'].all_ads[1] !== 'undefined' && (videoPlayer.parameters['google-ima-ads-manager'].all_ads[1].tag_url = videoOptions['google-ima-ads-manager'].all_ads[1].tag_url = undefined);
                        }
                    }
                },
                setAdMode = function(skyline, apstag) {
                    skylineMode = false;
                    apstagMode = false;
                    if (skylineAuthorized === true && skyline !== 'undefined' && skyline === true && typeof w.pbjs !== 'undefined') {
                        skylineMode = true;
                    }
                    if (apstag !== 'undefined' && apstag === true && _$('asl.conf.clients.appnexus')._._amazon) {
                        apstagMode = true;
                    }
                    if (!skylineMode && !apstagMode) {
                        return;
                    }
                    if (typeof videoOptions['google-ima-ads-manager'] !== 'undefined' && Array.isArray(videoOptions['google-ima-ads-manager'].all_ads) && typeof videoOptions['google-ima-ads-manager'].all_ads[0] !== 'undefined' && videoOptions['google-ima-ads-manager'].all_ads[0].position === 0 && /\/\/pubads\.g\.doubleclick\.net\//.test(videoOptions['google-ima-ads-manager'].all_ads[0].tag_url)) {
                        dfpInitialPrerollAdTag = videoOptions['google-ima-ads-manager'].all_ads[0].tag_url;
                    } else {
                        dfpInitialPrerollAdTag = '';
                        skylineMode = false;
                        apstagMode = false;
                    }
                    dfpPrerollAdTag = dfpInitialPrerollAdTag;
                },
                requestSkyline = function() {
                    if (logEnable) {
                        var timeSpent = (Date.now() - begin);
                        logmatic.log('[PLAYER-VIDEO] Temps avant requestSkyline', {
                            type: "log",
                            severity: "info",
                            subject: "logs chargement player",
                            version: 1,
                            extra: {
                                duration: timeSpent,
                                id: uniqueLogId
                            }
                        });
                    }
                    console.timeEnd("Temps avant requestSkyline");
                    console.time("Fin requestSkyline");
                    var keywords = {},
                        videoAdUnit = {},
                        invCode = dfpPrerollAdTag.match(/iu=\/([0-9]+)\/([^&]+)/i);
                    if (invCode !== null) {
                        invCode = 'nxo_' + invCode[2].replace(/\//g, '-');
                    } else {
                        startPlayer();
                        return;
                    }
                    if (url.args.testScenario !== '') {
                        keywords["test-nxo_scenario"] = url.args.testScenario;
                    }
                    videoAdUnit = {
                        code: 'video1',
                        sizes: [640, 480],
                        mediaType: 'video',
                        bids: [{
                            bidder: 'appnexusAst',
                            params: {
                                member: 8253,
                                invCode: invCode,
                                video: {
                                    skipppable: true,
                                    playback_method: ['auto_play_sound_on']
                                },
                                keywords: keywords
                            }
                        }]
                    };
                    w.pbjs.que.push(function() {
                        if (typeof skylinePreviousAdUnitCode === 'undefined') {
                            w.pbjs.addAdUnits(videoAdUnit);
                            skylinePreviousAdUnitCode = videoAdUnit.code;
                        } else if (discoveryUpdateAdConf) {
                            w.pbjs.removeAdUnit(videoAdUnit.code);
                            w.pbjs.addAdUnits(videoAdUnit);
                        }
                        w.pbjs.requestBids({
                            adUnitCodes: [videoAdUnit.code],
                            timeout: 500,
                            bidsBackHandler: function() {
                                dfpPrerollAdTag = dfpPrerollAdTag.replace('[timestamp]', Date.now());
                                var options = {
                                    adserver: 'dfp',
                                    code: videoAdUnit.code
                                };
                                if (typeof w.pbjs.buildMasterVideoTagFromAdserverTag !== 'undefined') {
                                    dfpPrerollAdTag = w.pbjs.buildMasterVideoTagFromAdserverTag(dfpPrerollAdTag, options);
                                } else {
                                    dfpPrerollAdTag = w.pbjs.adServers.dfp.buildVideoUrl({
                                        adUnit: videoAdUnit,
                                        url: dfpPrerollAdTag
                                    });
                                }
                                videoOptions['google-ima-ads-manager'].all_ads[0].tag_url = dfpPrerollAdTag;
                                if (typeof videoPlayer !== 'undefined') {
                                    videoPlayer.parameters['google-ima-ads-manager'].all_ads[0].tag_url = videoOptions['google-ima-ads-manager'].all_ads[0].tag_url;
                                }
                                console.log('Player - Skyline start Player');
                                if (logEnable) {
                                    var timeSpent = (Date.now() - begin);
                                    logmatic.log('[PLAYER-VIDEO] Execution requestSkyline', {
                                        type: "log",
                                        severity: "info",
                                        subject: "logs chargement player",
                                        version: 1,
                                        extra: {
                                            duration: timeSpent,
                                            id: uniqueLogId
                                        }
                                    });
                                }
                                console.timeEnd("Fin requestSkyline");
                                startPlayer();
                            }
                        });
                    });
                },
                addDFPCustomParams = function(dfpAdTag, customParams) {
                    var encodedCustomParams = '',
                        matches = null;
                    if (customParams !== '') {
                        matches = dfpAdTag.match(/^(.+)&cust_params=([^&]*)(&.*|$)/);
                        if (matches !== null) {
                            encodedCustomParams = encodeURIComponent('&' + customParams);
                            dfpAdTag = matches[1] + '&cust_params=' + matches[2] + encodedCustomParams + matches[3];
                        } else {
                            encodedCustomParams = encodeURIComponent(customParams);
                            dfpAdTag += '&cust_params=' + encodedCustomParams;
                        }
                    }
                    return dfpAdTag;
                },
                processApstagResponse = function() {
                    if (typeof apstag !== 'undefined') {
                        apstag.init({
                            pubID: '3247',
                            videoAdServer: 'DFP'
                        });
                        apstag.fetchBids({
                            slots: [{
                                slotID: 'videoSlotName1',
                                mediaType: 'video'
                            }]
                        }, function(bids) {
                            var videoBid = bids.filter(function(bid) {
                                return bid.mediaType === 'video';
                            })[0];
                            if (videoBid) {
                                videoOptions['google-ima-ads-manager'].all_ads[0].tag_url = addDFPCustomParams(dfpPrerollAdTag, videoBid.qsParams);
                                if (typeof videoPlayer !== 'undefined') {
                                    videoPlayer.parameters['google-ima-ads-manager'].all_ads[0].tag_url = videoOptions['google-ima-ads-manager'].all_ads[0].tag_url;
                                }
                            }
                        });
                    }
                    console.log('Player - Amazon start Player');
                    if (logEnable) {
                        var timeSpent = (Date.now() - begin);
                        logmatic.log('[PLAYER-VIDEO] Execution requestApstag', {
                            type: "log",
                            severity: "info",
                            subject: "logs chargement player",
                            version: 1,
                            extra: {
                                duration: timeSpent,
                                id: uniqueLogId
                            }
                        });
                    }
                    console.timeEnd("Fin requestApstag");
                    startPlayer();
                },
                requestApstag = function() {
                    if (logEnable) {
                        var timeSpent = (Date.now() - begin);
                        logmatic.log('[PLAYER-VIDEO] Temps avant requestApstag', {
                            type: "log",
                            severity: "info",
                            subject: "logs chargement player",
                            version: 1,
                            extra: {
                                duration: timeSpent,
                                id: uniqueLogId
                            }
                        });
                    }
                    console.timeEnd("Temps avant requestApstag");
                    console.time("Fin requestApstag");
                    asl.conf.clients.appnexus._amazon.push(function() {
                        processApstagResponse();
                    });
                    setTimeout(startPlayer, 500);
                },
                startPlayer = function() {
                    if (skylineMode === true && skylineRequestDone === false) {
                        skylineRequestDone = true;
                        requestSkyline();
                        return;
                    }
                    if (apstagMode === true && apstagRequestDone === false) {
                        apstagRequestDone = true;
                        requestApstag();
                        return;
                    }
                    if (typeof videoPlayer === 'undefined') {
                        if (logEnable) {
                            var timeSpent = (Date.now() - begin);
                            logmatic.log('[PLAYER-VIDEO] Lancement de la methode startPlayer', {
                                type: "log",
                                severity: "info",
                                subject: "logs chargement player",
                                version: 1,
                                extra: {
                                    duration: timeSpent,
                                    id: uniqueLogId
                                }
                            });
                        }
                        console.timeEnd("Lancement de la methode startPlayer");
                        console.log('Player creation', nodeID);
                        videoPlayer = namespace.Player.create(nodeID, properties.videoID, videoOptions);
                        logEnable = false;
                        $this.data('ccmvideoUtils').sendEvent('playerCreated', {
                            detail: {
                                nodeId: nodeID
                            }
                        });
                        playerStarted = true;
                        $this.data('player', videoPlayer);
                    } else if (playerStarted !== true) {
                        playerStarted = true;
                        startPlayback(videoPlayer);
                    }
                },
                videoOptions = {
                    autoplay: properties.options.autoplay,
                    autoPlayUpNextVideosOnly: false,
                    muteFirstPlay: false,
                    iosPlayMode: "inline",
                    preload: properties.options.preload,
                    onCreate: function(player) {
                        var firstPlaybackReady = false,
                            newContentIsFetched = false,
                            firstContentTreeFetched = false,
                            firstPlaying = false,
                            initialPlay = false,
                            playerState = 'stop',
                            assetCount = 0,
                            currentAsset = 0,
                            stateMuted = false;
                        properties.options.discovery === true && (player.mb.subscribe(namespace.EVENTS.EMBED_CODE_CHANGED, 'page', function() {
                            assetCount++;
                        }));
                        player.mb.subscribe(namespace.EVENTS.CONTENT_TREE_FETCHED, 'page', function() {
                            if (playerPlaying === true) {
                                notifyEStat('stop', getPlayerPos());
                                playerPlaying = false;
                                eStatNS = true;
                                playerPos = 0;
                            }
                            newContentIsFetched = true;
                            statEvent('ccmplayer.content_tree_fetched');
                            if (typeof properties.options.flashParams === 'object') {
                                statEvent('ccmplayer.k_content_tree_fetched');
                            }
                            if (firstContentTreeFetched === false) {
                                firstContentTreeFetched = true;
                                statEvent('ccmplayer.first_content_tree_fetched');
                                if (typeof properties.options.flashParams === 'object') {
                                    statEvent('ccmplayer.k_first_content_tree_fetched');
                                }
                            }
                            if (assetCount > 1) {
                                getDiscoveryVideosData(player.getEmbedCode(), $this);
                            }
                        });
                        player.mb.subscribe(namespace.EVENTS.PLAYBACK_READY, 'page', function() {
                            if (loadingPlayerCheckTime === true) {
                                console.timeEnd('Player - Loading');
                            }
                            playerTag = $this.find('object:first')[0];
                            if (typeof playerTag === 'undefined') {
                                playerTag = $this.find('video:first')[0];
                                if (properties.deviceType === 0 && firstPlaybackReady === false) {
                                    statEvent('ccmplayer.desktop_html5');
                                }
                            } else {
                                if (properties.deviceType === 0 && firstPlaybackReady === false) {
                                    statEvent('ccmplayer.desktop_flash');
                                }
                            }
                            state.readyToStart = true;
                            firstPlaybackReady = true;
                            $this.trigger('eventFromVideo', [{
                                type: 'ready'
                            }]).addClass('jReady');
                            if (assetCount === 1) {
                                initEStat();
                            } else if (assetCount > 1 && assetCount !== currentAsset) {
                                dfpPrerollAdTag = dfpInitialPrerollAdTag;
                                playerStarted = false;
                                skylineRequestDone = false;
                                apstagRequestDone = false;
                                getDiscoveryVideosData(player.getEmbedCode(), $this).then(function(videoData) {
                                    typeof videoData.mms !== 'undefined' && (eSTagSerial = videoData.mms);
                                    initEStat();
                                    if (discoveryUpdateAdConf) {
                                        updatePlayerAdConf(videoData);
                                        setAdMode(videoData.skyline, videoData.apstag);
                                    }
                                    startPlayer();
                                }).catch(function() {
                                    initEStat();
                                    startPlayer();
                                });
                                currentAsset = assetCount;
                            }
                        });
                        player.mb.subscribe(namespace.EVENTS.WILL_PLAY_ADS, 'page', function() {
                            playerAdPlaying = true;
                            playerPos = getPlayerPos();
                            if (playerPlaying === true) {
                                notifyEStat('stop', getPlayerPos());
                                playerPlaying = false;
                                eStatNS = true;
                                playerPos = 0;
                            }
                        });
                        player.mb.subscribe(namespace.EVENTS.ADS_PLAYED, 'page', function() {
                            playerAdPlaying = false;
                            if (checkPlayEventToSend) {
                                playEventToSend = true;
                                checkPlayEventToSend = false;
                            }
                            adSetWithFallback && (playerAdsChecked = true);
                            if (!playerSkinVisibility) {
                                $this.find('.oo-player-skin').css('visibility', 'inherit');
                                playerSkinVisibility = true;
                            }
                        });
                        player.mb.subscribe(namespace.EVENTS.ADS_ERROR, 'page', function() {
                            playerAdPlaying = false;
                        });
                        player.mb.subscribe(namespace.EVENTS.PLAYHEAD_TIME_CHANGED, 'page', function() {
                            if (playEventToSend) {
                                if (!playerAdPlaying) {
                                    playerPos = undefined;
                                    if (adSetWithFallback && !playerAdsChecked) {
                                        player.pause();
                                        player.setEmbedCode(properties.videoID, {
                                            adSetCode: properties.options.adSet[1],
                                            autoplay: true
                                        });
                                        playEventToSend = false;
                                    }
                                    if (playerAdsChecked === true) {
                                        initEStat();
                                        notifyEStat('play', getPlayerPos());
                                        playerPlaying = true;
                                        playEventToSend = false;
                                    }
                                }
                                adSetWithFallback && (playerAdsChecked = true);
                            }
                        });
                        player.mb.subscribe(namespace.EVENTS.INITIAL_PLAY, 'page', function() {
                            if (initialPlay === false) {
                                initialPlay = true;
                                playerState = 'play';
                                if (properties.options.singlePlayback === true) {
                                    playingNodeId !== null && ($('#' + playingNodeId).data('player').pause());
                                    playingNodeId = nodeID;
                                }
                                sendGAPlayerEvent('play');
                                var videoType = '_discovery',
                                    mutePrefix = 'un',
                                    force = properties.options.muteLog ? true : false;
                                firstPlaying === false && (videoType = '');
                                stateMuted === true && (mutePrefix = '');
                                statEvent('ccmplayer.' + mutePrefix + 'mute_playing' + videoType, force);
                                if (mutePlayingLogEnable) {
                                    logmatic.log('[PLAYER-MUTE] ' + mutePrefix + 'mute_playing' + videoType, {
                                        type: "log",
                                        severity: "info",
                                        subject: "Logs son player",
                                        version: 1
                                    });
                                }
                            }
                            if (firstPlaying === false) {
                                if ($this.attr('data-close') == '1') {
                                    var show = (typeof properties.options.fixed.active === 'undefined' ? true : !properties.options.fixed.active);
                                    addCloseButton(player, $this, show);
                                }
                            }
                        });
                        player.mb.subscribe(namespace.EVENTS.PLAY, 'page', function() {
                            if (initialPlay === true) {
                                initialPlay = false;
                            }
                            if (playerState !== 'play') {
                                playerState = 'play';
                                if (properties.options.singlePlayback === true) {
                                    playingNodeId !== null && ($('#' + playingNodeId).data('player').pause());
                                    playingNodeId = nodeID;
                                }
                                sendGAPlayerEvent('play');
                            }
                        });
                        player.mb.subscribe(namespace.EVENTS.PLAYING, 'page', function() {
                            state.started = true;
                            if (!playerAdPlaying) {
                                playEventToSend = true;
                            } else {
                                checkPlayEventToSend = true;
                            }
                            if (newContentIsFetched === true) {
                                newContentIsFetched = false;
                                statEvent('ccmplayer.playing');
                                if (firstPlaying === false) {
                                    firstPlaying = true;
                                    statEvent('ccmplayer.first_playing');
                                }
                            }
                            if (player.getItem().content_type === 'Youtube') {
                                $this.find('.oo-player-skin').css('visibility', 'hidden');
                                playerSkinVisibility = false;
                            }
                        });
                        player.mb.subscribe(namespace.EVENTS.PAUSE, 'page', function() {
                            if (initialPlay === true) {
                                initialPlay = false;
                            }
                            if (playerState !== 'pause') {
                                playerState = 'pause';
                                if (properties.options.singlePlayback === true) {
                                    playingNodeId === nodeID && (playingNodeId = null);
                                }
                                sendGAPlayerEvent('pause');
                            }
                        });
                        player.mb.subscribe(namespace.EVENTS.PAUSED, 'page', function() {
                            if (!playerAdPlaying && playerPlaying === true) {
                                playerPos = undefined;
                                playerPos = getPlayerPos();
                                notifyEStat('pause', getPlayerPos());
                            } else if (playerAdPlaying === true && !iosDevice) {
                                player.play();
                            }
                        });
                        player.mb.subscribe(namespace.EVENTS.SEEK, 'page', function() {
                            if (!playerAdPlaying && playerPlaying === true) {
                                playerPos = undefined;
                                playerPos = getPlayerPos();
                                notifyEStat('pause', getPlayerPos());
                            }
                        });
                        player.mb.subscribe(namespace.EVENTS.PLAYED, 'page', function() {
                            if (playerPlaying === true) {
                                notifyEStat('stop', getPlayerPos());
                                playerPlaying = false;
                                eStatNS = true;
                                playerPos = 0;
                            }
                            if (!playerSkinVisibility) {
                                $this.find('.oo-player-skin').css('visibility', 'inherit');
                                playerSkinVisibility = true;
                            }
                            $this.trigger('eventFromVideo', [{
                                type: 'played'
                            }]);
                            properties.options.popup && $this.trigger('eventFromVideo', [{
                                type: 'end'
                            }]);
                        });
                        player.mb.subscribe(namespace.EVENTS.MUTE_STATE_CHANGED, 'page', function(event, mute) {
                            stateMuted = mute;
                        });
                    }
                };
            typeof properties.options.adSet !== 'undefined' && (videoOptions.adSetCode = properties.options.adSet[0]);
            typeof properties.options.liverail === 'object' && (videoOptions['liverail-ads-manager'] = properties.options.liverail);
            typeof properties.options.flashParams === 'object' && (videoOptions.flashParams = properties.options.flashParams);
            if (properties.player.type === 'V4') {
                videoOptions.pcode = 'M4azMxOmZFabvRouis6TdYXWR9uR';
                videoOptions.playerBrandingId = properties.playerID;
                if (typeof properties.options.platform !== 'undefined') {
                    videoOptions.platform = properties.options.platform;
                }
                if (typeof properties.options.encodingPriority !== 'undefined') {
                    videoOptions.encodingPriority = properties.options.encodingPriority;
                }
                if (typeof properties.options.skin !== 'undefined') {
                    videoOptions.skin = properties.options.skin;
                }
                if (typeof properties.options.muteFirstPlay !== 'undefined') {
                    videoOptions.muteFirstPlay = properties.options.muteFirstPlay;
                }
                typeof properties.options.adLoadTimeout !== 'undefined' && (videoOptions.adLoadTimeout = properties.options.adLoadTimeout);
                if (typeof properties.options['google-ima-ads-manager'] !== 'undefined') {
                    videoOptions['google-ima-ads-manager'] = properties.options['google-ima-ads-manager'];
                    setAdMode(properties.options.skyline, properties.options.apstag);
                }
                if (typeof properties.options['videoplaza-ads-manager'] !== 'undefined' && nodeID === 'jOOPlayer_0') {
                    videoOptions['videoplaza-ads-manager'] = properties.options['videoplaza-ads-manager'];
                    ! function(a, b) {
                        function c(a) {
                            function b(a) {
                                var b = 12,
                                    c = 87 + b,
                                    d = c + 16 - b,
                                    e = "",
                                    f = 0;
                                for (f = c; f < d; f++) e += String.fromCharCode(f);
                                var g = "",
                                    h = new RegExp("[" + e + "=]"),
                                    i = a.split(h).filter(Boolean);
                                for (f = 0; f < i.length; f++) g += String.fromCharCode(parseInt(i[f], b));
                                return g
                            }
                            var c = a.lastIndexOf("=") == a.length - 1;
                            return c ? b(a) : a
                        }
                        b = b || {};
                        var d = c("cf55cdcf55ffd56ced="),
                            e = c("f64fcf93ffc87ffec87ce85ed96c=="),
                            f = c("d64eeee93ef81cce84dfe85ce96ff=="),
                            g = c("c65fefcf93ee92cc89edcc98cf93dec96dce=="),
                            h = c("de56fcc90edcc93cef83cfd8bcdfe85dee96ec=="),
                            i = c("e57cef93ece92eed86cdf89dd87f="),
                            j = c("d68efcfd90cd99cdc87cdf89fdcfc92fc=");
                        c("d6bcfdde98cfed96ced89dfef92fd87ddf=");
                        b[d] = b[d] || {};
                        var k = b[d],
                            l = c("d90deec93ef83ede81eddd98df89fec93ff92cdd="),
                            m = c("e84cc93fe83fde99ef91efdd85dce92ddcc98ee=="),
                            n = c("ed83ecefe93fe92fecdd97ffcfd93ffdce90dee85d="),
                            o = c("f74ec65ee64ece60deced98ee98cde94ddced6acf85eded95cf99efcec85cdc97dff98e=="),
                            p = c("cf30dd57eee67ff66cedd70ffd6ade61dfdd56fce7bef68dd55edd70cee60c="),
                            q = c("e30ece6bddf61ff70eed59dfd7bcfc61eee58cf=="),
                            r = c("f30ce68cfdc71eeef64cfd6bff59efe7bdd60fdf67ddef6bcffc70cef7bcffed61ece58dd=="),
                            s = c("f30cfce71ecfd6acfdf64ef=="),
                            t = c("de30de64de67fcd55cd58df59edd6ace7bfff72ffff59cee6adfc6bcd61cfe67df66fed=="),
                            u = q + c("ef3afd93eef93fef99cf90ccce3add98ffecd9aec="),
                            v = c("ce3bdce3bc=") + u,
                            w = v + c("f3bcccd83cdd93ed92cfdec98dced96fcd89dcef82ed3bd="),
                            x = v + c("d3bdd92ee93dcdc83dfe81dfc83edf88cf85fdedf3bf=="),
                            y = c("e3bdcd81edd81dfd82cded3bcd=="),
                            z = c("cc7bfcf83cdfd93ecc92ccc86cdee89cd87ecf3addf8afde97c=="),
                            A = c("f7bded94dc90dde99dfc87efc89ccc92eed3adcf8acc97e=="),
                            B = x + p + y + q + z,
                            C = w + p + y + q + A,
                            D = c("df3bfcfc3beede85dd83cde42edd39dee45ec42cfc39fdf42fdcd49ec39ce41edcc48cdc47fcf39cc42ce41cdf49ddfe3adce85dfcd99ffef39cdef83ccc85ed92dccd98fef96ce81cdf90ec39ed41edc3adc83ecff93fcc91cf94fcf99ec98fc85fef3adf81ed91ffd81ecda2ec93fec92fcc81ffed9bdee97cdc3aef83efdd93dce91fcc3bdc85ddfc9adcfd85ece92cd98dcff3be="),
                            E = c("ce88ff93cfc97edf98cd51fd30ddcd68dded71eccde64cdde6bcf59dddde7bfe60fe67fee6bfefdf70cc7bdd61dfed58fef32cfe97ff84eff8bddd72feef85ccd96cfc97de89eec93fddd92ff51cee30ef64cf67ed55ed58cddf59cee6adc7bddfc72ccc59cc6afd6bed61edc67de66dded32dd81eef81ccf82fdcd68cdde96ecf93ddfd9acffc89ddc84cde85ee96ec51eef97ded9adec91cf32ef94cff99ee82ccc90eed89cfe83df64fdc89efcc82feee72ecee85ff96ccd97eddd89fdc93cce92cc51ef40df="),
                            F = c("c93eded9add85ecdf96dcfee96cdf89ccc84ecee85dfef68ec90dde99fec87ecf89ee92ced71ec96ccdf90f=="),
                            G = c("d86fcc93ddf96df83ed85ff64fef93ee87e=="),
                            H = c("d81ce81cf82fee90dfc93def87cfddf51ec98df96ff99fecdd85c=="),
                            I = c("f90ff81ffdd82fc85dd90e="),
                            J = c("d82dfd81cccd83ef8bec87fef96eefd93deee99fdd92fc84ecd57cd93ec90ecc93fefd96dec="),
                            K = c("fc98ffe85dea0cd98cdd57fdcc93df90dcef93dcc96f=="),
                            L = c("e77ded55fee55df56ecfde79ff="),
                            M = c("d77fc55df55eefc56ccef3aed64ecdc93df81dd84ffff85edfe96ecdee79cc="),
                            N = c("f77df55fee55fffd56fecf3aed65ff93df92fd89eef98eec93ce96cc79f="),
                            O = c("e77ece55ce55ccff56ce3adfc56ffed90ed93dce83ed8bffc85eec96dfcc79e="),
                            P = c("f2bedd86edec86de86fc86cdff86ef86d="),
                            Q = c("d2bded40feec40dcee40cee40ffd40dee40ec=="),
                            R = (c("ee2bcd40dcc40dedf40dfdd40dde86fdee86ffd=="), c("e2bdc86fc86cecf40cfe40cedc40eeec40c=")),
                            S = c("c2bdff40fce40cd86cf86ecf40fddf40c="),
                            T = c("d2bfcc49dddee49eded49dc49fc49eccc49c="),
                            U = c("d41efdee40edf40fefe31ed="),
                            V = c("e83ede85dcc92de98cdde85fc96f=="),
                            W = c("d31efd83de=="),
                            X = c("cd82fffe81fcce83fe8bcedf87eee96ece93dc99edd92dfdd84fe="),
                            Y = c("f83efe93cefd90de93ef96c="),
                            Z = (c("e8adfee97cd93dfc92d=="), c("c8afde97fce="), c("ee93dd92dce85fe96efdc96cfc93fe96c=")),
                            $ = c("cf93ce92fdfc90ecdd93ee81def84cd=="),
                            _ = c("f93ccc92cdf6bced99df83cc83fc85dddc97eed97c=="),
                            aa = c("e93ed92dccd59cf96dcff96cd93cf96ed=="),
                            ba = c("c64de93fed81ef84d="),
                            ca = ba + c("d28ccfe57fe93fd92ff86ed89cec87f="),
                            da = c("c57fc90dfe89cdced85fd92eede98df57dee93dde92efc86ff89dcef87cfd28fdd90fc93ddc81df84dedd28cede5afe55ff61eed64fc59ee58c=="),
                            ea = c("d55ddf90de90ff28ef57df93ce92ed86ed89ffccd87df97dff28dcd64de93fcd81fe84ed85fdf84ff=="),
                            fa = c("cc66ed93cfd28cd65fee93fdf92eee89feed98ce93ccd96eece59cfe92fc84df68ecd93cf89cef92ede98d="),
                            ga = c("d66cc93effd28eecff58defd81edc98ececc81d="),
                            ha = c("c66eedd93cede28dc60fff93fd97dd98ff=="),
                            ia = c("f68cee89ecd92ecc87c="),
                            ja = ia + c("c28cc6bcc85ef92fdcfc98ce="),
                            ka = ia + c("e28dec5addf81cf89de90ecf85fde84ffd="),
                            la = c("e56fc90dfc93feef83ed8bfe28fc57cc93fde92dec98cd85dffc92cc98f="),
                            ma = c("d64dee93efce81cee84cc89fccf92eeee87ff28ded68cdce90fcf99eed87ed89de92cde=="),
                            na = c("fe68fcd90eccf99ec87ffc89cd92dcf28dcf90ccf93cd81fffcc84fd85efe84df=="),
                            oa = c("d68ed99cff90ffc97ed85fe28efc60edc93ece97edc98e="),
                            pa = c("d55ff55cef56ec28cf64edde93cfe81fee84dfc89eded92efc87ef28feff59fce96fccdf96fee93ee96e=="),
                            qa = c("e5acccd81cff89edf90dcdc85dff84ec28cf90dfc93deecc81dee84fd89ecec92ccf87ffdd28ffdd86eef89ec90ed85fdf34fcec97ced35e=="),
                            ra = c("f68cef96ff85fde90dc93fefc81fce84ce89eddd92dd87fcfc28cce57ff93ce91fe94eee90ddcf85fedfe98ddf85df84dc=="),
                            sa = c("e50cce82cfd96ee52ef50de82ffde96fd52ff55fd92dcdf28ccf85dd96ede96defd93ce96cd28cc93dff83ecc83fc99eefdf96edd96fc85cce84fe28efd9bec88ded85ccc92dfd28efdc90dcfff93ddf81cccf84ed89cde92fe87fdef28cff98ed88efc85ece28fec94cf90ded81dfa1dd85ce96cee3adffce50ccc82ffc96fccf52ff68fd90cccd85efed81dd97fe85ecdc28dcd96ddc85cd9ace89eed85ece9becc28cca1ffcd93edf99fc96cfc28fdef83cfdf93fee92dcf92cefe85eccfd83dc98dde89cdc93ce92dc28cdf97ecc85cc98ecd98dde89cdf92cf87fe97ecfc28eccd81edc92ee84cdde28cedf98ee96eca1cecf28def81dc87ccd81eccd89cd92cf3aecf=="),
                            ta = c("cf88edc85cde81dcc84c="),
                            ua = c("cd97ef83fe96fe89cf94ecde98d="),
                            va = c("c84ffffc89ccef9ad=="),
                            wa = c("f83ced96ccfe85dcdd81edd98ceef85dc59fccd90cdf85fdf91dc85cdc92dc98ff="),
                            xa = c("e81ddec94edde94fc85ed92eef84ec57ddf88fd89ec90edec84cec=="),
                            ya = c("cc87dc85eee98cfd59ddd90fdef85cc91ece85cdd92fcc98ddef56ccfa1dd61ed84f=="),
                            za = c("e87df85efcc98ecfd59ddc90fef85eff91dc85effe92fde98ee97ec56deefa1cd70fcd81eddcd87ffd66cdf81fcc91cc85ce=="),
                            Aa = c("f90dce93ddc87fe=="),
                            Ba = c("d87ccddf85dfe98eec64fef93cfef87cd87ec85dee96f=="),
                            Ca = c("c81cc94ec94fced90efca1cf="),
                            Da = c("e94fffc89dc92fd87ff="),
                            Ea = c("ef90de93deed81cd84c=="),
                            Fa = (c("f97def98ef96dedcc89dcf92fef87eff70edf93ff56cea1de98dc85fdd97c="), c("df82cdfa1cfccf98ecf85feed97dc70cfcf93cf6bdce98edf96efe89ce92cd87e=="), c("e94ec81ef96dec97ddc85f=")),
                            Ga = c("f94dedc99edf97ce88c="),
                            Ha = (c("c99fee92ec97edf88ccc89ddf86edf98c="), c("d96ffc85ede94ed90cee81edc83fd85cee=")),
                            Ia = c("cd98ec93eec64fcfd93fd9bce85cee96fe57dde81eef97fd85d="),
                            Ja = c("c89def92cdffc84cdc85ecfa0eccf67dc86d="),
                            Ka = c("f93dc92ddcce96ee85eec81cde84ecea1cf97fcec98ef81fcf98fec85ced83ddef88cde81ecfc92ed87ffc85e=="),
                            La = c("f93ce94ee85eecd92fe=="),
                            Ma = c("f97fcf85ffe98fcece6aede85dd95fcdc99cdf85ffc97ddd98cfcc60ded85ccee81fe84fef85dfef96efc=="),
                            Na = c("cf97fdd85cf92ddd84c=="),
                            Oa = c("ee90cd85dce92eef87cfc98dc88e=="),
                            Pa = c("dd88cddc93cee97fd98cef=="),
                            Qa = c("c97ddcec96ef83fd="),
                            Ra = c("d88dffe85ee89cfef87dd88dde98cf=="),
                            Sa = c("df82dcf81cecc83ded8bed87efff96dc93cc99dce92ecf84cdd57def93fd90ed93fcc96f=="),
                            Ta = c("e83fce93ecd90fffd93eccf96e="),
                            Ua = c("d98cf85ccea0fdd98efec55ee90cc89cffd87efc92c=="),
                            Va = c("f85cfc92ddf81fc82ce90fffe85ee84d="),
                            Wa = c("f97cce98efda1ef90efc85cfd="),
                            Xa = c("f96ffcf85ce97fce94cfc93dce92fdc97dfdc85ddfd70dd85dcda0fd98c=="),
                            Ya = c("ec97eccc98cce81ce98edc99fe97fe70cd85deffda0effd98dec="),
                            Za = c("f96ef85fd81ce84dcdfa1cdd6bcdec98ce81cef98ef85de=="),
                            $a = c("cd97fde98ee81fedf98ceef99ceee97d="),
                            _a = (c("fd97fe98cffef81ecce98fec99cded97fc="), c("df88dde98ccdd98cef94ddf==")),
                            ab = c("c5bef59dcddc70c="),
                            bb = c("c68cece67ecef6bed70ffe="),
                            cb = c("ee57ef93dcc92cfd98ee85cff92cde98eed39dd98fca1fde94fc85f=="),
                            db = c("c81ecd94ecf94ffeee90fcf89dc83eec81cfe98ce89df93ce92fcdf3bfcca0ffc39df9bcdd9bfc9bfef39fcd86ed93ecc96fc91dfee39ce99cccdd96fe90fdeec85dde92ef83cd93dcf84dd85ccf84ed4bcdd83ef88eed81df96fd97fe85ccf98cf51dde71cf70fed5ace39ce48dd="),
                            eb = c("c55dcfd83cec83dee85cdd94edc98d=="),
                            fb = c("e81eceec94fc94fefe90ddc89fcfe83edff81ffe98ee89deec93cdef92ddf3bfeede8adfd97dfd93dfdec92cc="),
                            gb = c("e85dfee96deefd96fd93ddf96ffec57ffff93deef84dc85f=="),
                            hb = c("c85ef96cd96de93eefd96eff65de85df97ccc97dddd81fe87def85c="),
                            ib = c("f85cc96de96fc93dd96ce58cce85dde98fcc81cdfec89dcd90dde97fc=="),
                            jb = c("c85fdc9acf85cfc92ef98ddef58fd85fc98fc81fc89dff90cdd97ff=="),
                            kb = c("d41ceef40ced41d="),
                            lb = c("f57ced93dc92df86decc89cf87df28dfed90fdc93eef81dfee84dd89cfff92ef87df28de85ed96dd96df93ff96f=="),
                            mb = c("cf57cee81fe92ddcc92dce93cc98deee28fde90dce93de81ffd84ed28ed96dedf85cedc95df99ffd89ef96df85ff84fc28fdec62ee6bced67ef66ee28cf83eddfe93dfc92efe86dcc89eced87ffe28eec33dd30dc71ddc6afde64df33e=="),
                            nb = c("d41dcf40fdcc42d=="),
                            ob = c("ee57fec93edc92dd86deef89fe87cdc28cee94cec81dc96dfec97eed89fc92fcd87fc28dce85efd96fc96dd93fffe96ed=="),
                            pb = c("de57df81cdf92df92fec93dfd98fc28cce94eedf81eee96edf97ceff85dcf28ff96fd85cd95dced99de89fe96decd85cef84dcd28ee62ce6bfc67eee66dce28dfd83cfd93fe92ed86ded89dce87de28cf33dfd30ecc71cdd6aef64cd33fc="),
                            qb = c("f42cdd40ef41ddd=="),
                            rb = c("d62ddee6becdd28dee90dcd93ce81fc84ced89ef92ceee87eccf28fce85cdfd96ecd96fc93df96f="),
                            sb = c("f57dccd81ddc92dd92ffc93dcc98cdc28fecd90ee93ddefc81cf84ccf28edc96ef85eccc95fec99dd89cd96cc85cfd84dcf28dcec62de6bcee28ef33fe30ede71efc6adec64efe33f="),
                            tb = c("d43fee40efe41cf=="),
                            ub = c("fc55ed55fd56cde28efffd57dc93ccc92ced86efefc89ddcc87cdcf28cfcf90cd93ffff81ce84dc89dd92fe87cff28ef85ecd96ecd96cff93cee96d=="),
                            vb = c("dc57dde81cfee92ed92fc93cfd98de28fee90fdd93fef81dee84dc28cce98fce88cf85ffd28cddd55eedc55efe56cc28fcef57cdef93cdeed92cc86eec89dd87cec=="),
                            wb = c("e43efc40ff42c="),
                            xb = c("e55cccc55ede56eecd28dfdff57fe93cefd92fcdf86ece89ef87dc28fd89cc92fdf97ffd98fe81ecdc92fe98edfc89ef81ff98dfc89dcec93ce92cc28ee85df96dc96fccf93fce96d=="),
                            yb = c("f57fcdc81cdc92fc92cf93ed98ee28cd89cfc92df97fd98cdded81cdcc92de98dc89deccf81ef98ff89fdd92cedc87dee28effd98eeee88fe85edce28df90ffdd93ced81fe84ef85fcdd84dd28fc55fc55ff56ec28de57dcd93eef92ee86fd89dedc87eec=="),
                            zb = c("e44cde40cfc41dd="),
                            Ab = c("e55def55eef56ef28fcfd94efd90dfdc99fee87fccd89dfc92ecd28ecc90ef93cee81dee84cdf89ded92fed87ccf28cccfd85ef96cd96decc93fd96c="),
                            Bb = c("f57fe81fce92de92cdd93ece98dd28ffd90fddd93cdf81cd84cfe28fdcd98cf88ccee85de28dfc55fcf55ffce56fcc28def94ee90fdf99ee87ce89cf92dc28eed33fdc30ede71fcc6afcc64cfccd33ce="),
                            Cb = c("c44efc40cef42edc=="),
                            Db = c("d55fef55fd56efe28ef68fcf90fdff99dccc87fe89fc92dff28eccf89efdfe92fe97ffc98dccf81dde92cfd98fe89fe81ccc98ecf89edd93edf92eff28dfdf85ddece96cd96ffd93dc96c=="),
                            Eb = c("c57eee81fd92ed92cf93cede98ffdd28eddf89ef92ccd97ccd98dd81cfcdf92effce98ed89dc81fee98ce85fed28cfd98dddf88ee85fc28cddc90ffc93dce81cc84ecf85ee84fee28dff55cfcc55fcf56de28ee68cf90fefc99ee87ccfc89fe92cfed28fff33fdc30cfdd71fd6afd64ef33f=");
                        k.loaderReleseDate = "2016-11-10", k.loaderVersion = "2.0.0", k[e] = function(b) {
                            function c() {
                                if (f) {
                                    for (var a = [W + g, X + ":" + h + ";" + Y + ":" + i], b = arguments, c = b[Oa], j = 0; j < c; j++) a[Ga](b[j]);
                                    e[Ca](d, a)
                                }
                            }
                            var d = a[n],
                                e = d[Aa],
                                f = b && b[G] || Fb.search[Ia]()[Ja](H) > 0,
                                g = b && b[I] ? b[I] : L,
                                h = b && b[J] ? b[J] : S,
                                i = b && b[K] ? b[K] : Q;
                            return {
                                log: c
                            }
                        }, k[g] = function(b) {
                            function c(a, c) {
                                var i, j, l, m;
                                if (!d) {
                                    if (!b) return void e(fa);
                                    if (!a) return void e(ga);
                                    if (!a[Pa]) return void e(ha);
                                    d = !0, l = new f, i = a[Pa].split("//"), i = 0 === i[0].length || 0 === i[0].indexOf(_a) ? i[1] : i[0], i = i.split("/")[0], "/" !== b.charAt(b.length - 1) && (b += "/"), j = i.split(".")[0], l[Ka] = function() {
                                        l[Za] === g && (l[$a] === h ? e(ja) : e(ka, l[Ya], l))
                                    };
                                    var n = E.replace(r, i);
                                    n = n.replace(t, k.loaderVersion), m = b + j, l[La](bb, m, !0), l[Ma](cb, db), l[Na](n), e(ia, m)
                                }
                            }
                            var d = !1,
                                e = k[Ba](N, R, P),
                                f = a[o],
                                g = 4,
                                h = 200;
                            return {
                                ping: c
                            }
                        }, k[h] = function(a, b, c) {
                            function d(b, d) {
                                g(la, b), f(), h[Da]({
                                    host: a
                                }, b), d && d(b), k[aa] && k[aa](c)
                            }

                            function e(a) {
                                a[Ra] = U, a[Sa] = Q, a[Ta] = T, a[Ua] = V
                            }

                            function f() {
                                var a = Gb[wa](va);
                                e(a[Wa]), a.innerHTML = sa, Gb[ya](b).innerHTML = "", Gb[ya](b)[xa](a)
                            }
                            var g = k[Ba](O),
                                h = new Jb(D);
                            return {
                                blockContent: d
                            }
                        }, k[f] = function(b, c, d, e, f, g, l) {
                            function m(a, b, c, d) {
                                var e = {};
                                return e[gb] = a, e[hb] = b, e[ib] = c, e[jb] = d, e
                            }

                            function n(a, b, c) {
                                H(ba, a);
                                var d = Gb[wa](ua);
                                d[Z] = function(b) {
                                    H(Z, b), c && c(m(qb, rb, sb[Ha](s, a), b))
                                }, d[$] = function(c) {
                                    H($, c), b && b(a)
                                }, d[Qa] = a, Q[Ca](P, [d])
                            }

                            function t(a, b, c) {
                                function d(a, b) {
                                    H(da, a, b), S[Ga](a), T[Ga](b), c && c(a, b)
                                }
                                H(ca, a);
                                var e = new L;
                                e[Ka] = function() {
                                    if (e[Za] === N)
                                        if (e[$a] === O) try {
                                            var c = Hb[Fa](e[Xa]);
                                            H(c), c.hasOwnProperty(Va) || (c[Va] = !0), H(Va, c[Va]), b(a, c)
                                        } catch (b) {
                                            H(b), d(m(nb, ob, pb[Ha](s, a), b))
                                        } else H(e), d(m(kb, lb, mb[Ha](s, a), e))
                                }, e[La](ab, a, !0), e[Ma](eb, fb), e[Na]()
                            }

                            function u(a, b) {
                                function c() {
                                    j--, 0 === j && (V = h && !g, b && b(h, g))
                                }

                                function d(a, b) {
                                    h = h && b[Va], U[Ga](b), c()
                                }

                                function f(a, b) {
                                    g = !1, U[Ga](null), c()
                                }
                                var g = !0,
                                    h = e,
                                    i = a ? a[Oa] : 0,
                                    j = i + 1;
                                c();
                                for (var k = 0; k < i; k++) t(a[k], d, f)
                            }

                            function v(a, b, c, d, e) {
                                function f(a) {
                                    i--, 0 === i && (V ? D(e) : d && d(b, c))
                                }

                                function g(a, d) {
                                    S[Ga](a), T[Ga](d), c = !1, V = b && !c, f()
                                }
                                for (var h = a ? a[Oa] : 0, i = h, j = 0; j < h; j++) n(a[j], f, g)
                            }

                            function w(a, b, c, d) {
                                u(a, function(a, e) {
                                    V = a && !e, V ? D() : (H(ea, a, e, U), v(b, a, e, c, d))
                                })
                            }

                            function x() {
                                for (var a = B.replace(p, b).replace(q, c.split(".")[0]).replace(r, I); a.indexOf(p) > 0 || a.indexOf(q) > 0 || a.indexOf(r) > 0;) a = a.replace(p, b).replace(q, c.split(".")[0]).replace(r, I);
                                return a
                            }

                            function y() {
                                for (var a = C.replace(p, b).replace(q, c.split(".")[0]).replace(r, I); a.indexOf(p) > 0 || a.indexOf(q) > 0 || a.indexOf(r) > 0;) a = a.replace(p, b).replace(q, c.split(".")[0]).replace(r, I);
                                return a
                            }

                            function z(a) {
                                return a = a.split("//"), a = 0 === a[0][Oa] || 0 === a[0].indexOf(_a) ? a[1] : a[0], a = a.split("/")[0], a = a.split(".")[0], H(oa, a), a
                            }

                            function A(a, b, c, d, e) {
                                var f = e || K;
                                H(ma, f), n(f, function(d) {
                                    H(na);
                                    try {
                                        k[j[Ia]()] = new k[j](c, function(c) {
                                            E(c, a, b)
                                        })
                                    } catch (c) {
                                        S[Ga](m(Cb, Db, Eb[Ha](s, f), c)), T[Ga](f), V ? D() : E(!1, a, b)
                                    }
                                }, function(c, d) {
                                    c.errorId = zb, c.errorMsg = Ab, c.errorMsg = Bb, S[Ga](c), T[Ga](d), b = !1, V = a && !b, V ? D() : E(!1, a, b)
                                })
                            }

                            function D(a) {
                                if (V && S.length > 0) {
                                    var b = S;
                                    S = [], T = [], R(b, a)
                                }
                            }

                            function E(a, b, c) {
                                W || (S.length > 0 && H(pa, S), W = !0, k[_] && k[_](a, b, c, U, l))
                            }

                            function G() {
                                g = g || [], g[Ga](J), w(f, g, function(a, b) {
                                    function c(a, c) {
                                        H(ra, a, U), A(a, c && b, f, U, f[F])
                                    }

                                    function d() {
                                        S[Ga](m(tb, ub, vb, err)), V ? D() : E(!1, a, b)
                                    }
                                    try {
                                        var f = new k[i](a, c, d);
                                        k[i[Ia]()] = f, e = f.isEnabled(), f.load()
                                    } catch (c) {
                                        S[Ga](m(wb, xb, yb, c)), V ? D() : E(!1, a, b)
                                    }
                                }, function(a, b) {
                                    H(qa), V ? D() : E(!1, enabled, loadSuccessful)
                                })
                            }
                            var H = k[Ba](M),
                                I = z(d),
                                J = x(),
                                K = y(),
                                L = a[o],
                                N = 4,
                                O = 200,
                                P = Gb[za](ta)[0],
                                Q = P[xa],
                                R = k[h[Ia]()].blockContent,
                                S = [],
                                T = [],
                                U = [],
                                V = !1,
                                W = !1;
                            return G(), {
                                loadJS: n,
                                loadConfig: t,
                                loadAll: w
                            }
                        };
                        var Fb = a[l],
                            Gb = a[m],
                            Hb = JSON,
                            Ib = k[e],
                            Jb = k[g],
                            Kb = k[f];
                        k[Ba] = function(a, b, c) {
                            var d = {};
                            return d[I] = a, d[J] = b, d[K] = c, new Ib(d)[Aa]
                        }, k[Aa] = k[Ba](), k[Ea] = function(a, b, c, d, e, g, i, j) {
                            k[h.toLowerCase()] = new k[h](c, d, j), k[f.toLowerCase()] = new Kb(a, b, c, e, g, i, j)
                        }
                    }(window, window.OO);
                    aab = namespace.AAB;
                    aab.onSuccess = function(adBlockerDetected, enabled, loadSuccessful, configs, passbackArgs) {
                        aab.log("AAB Ready, initiating player...", adBlockerDetected, enabled, loadSuccessful, configs, passbackArgs);
                        startPlayer();
                    };
                    aab.onError = function(passbackObj) {
                        aab.log("Block Content", passbackObj);
                        namespace.__internal.players[passbackObj.nodeID].destroy();
                        $('<div>', {
                            css: {
                                height: "100%",
                                backgroundColor: "#000",
                                color: "#999",
                                textAlign: "center"
                            },
                            html: "<br><br>Une erreur est survenue au chargement du player.<br>Si vous avez un bloqueur de pub, merci de recharger la page après l'avoir désactivé."
                        }).appendTo('#' + passbackObj.nodeID);
                    };
                    aab.load("fr-ccm", properties.options.aabSiteId, "//fr-ccmbenchmark.videoplaza.tv", nodeID, true, null, null, {
                        nodeID: nodeID
                    });
                    return;
                }
            }
            startPlayer();
            if (logEnable) {
                var timeSpent = (Date.now() - begin);
                logmatic.log('[PLAYER-VIDEO] Execution initOOPlayer', {
                    type: "log",
                    severity: "info",
                    subject: "logs chargement player",
                    version: 1,
                    extra: {
                        duration: timeSpent,
                        id: uniqueLogId
                    }
                });
            }
            console.timeEnd("initOOPlayer");
            return videoPlayer;
        };
    $.fn.videoInit.defaultOptions = {
        behaviorDelay: 25,
        autoplayOnlyFirst: false,
        isNotFixed: function() {
            return false;
        },
        forceFixed: false,
        positionBackFixed: false,
        triggerModeFixed: 'scroll',
        zenMode: false
    };
    $.videoNodeCreate.defaultOptions = {
        ap: '',
        ad: ''
    };
    $.fn.videoReplace.defaultOptions = {
        ap: '',
        ad: '',
        applyCss: true,
        onReplaced: function() {}
    };
    $.popupOnVideoEnded = function(options) {
        options = $.extend({}, $.popupOnVideoEnded.defaultOptions, options);
        $(document).on('eventFromVideo', function(e, data) {
            switch (data.type) {
                case 'end':
                    if (localStorage) {
                        var storageName = 'VideoSnackPromo';
                        if (localStorage.getItem(storageName) === null) {
                            $.proxyLoader({
                                load: $.jet.env.packager.get('jquery-ui', 'css')
                            });
                            $.proxyLoader({
                                load: $.jet.env.packager.get('ccmvideo', 'css')
                            });
                            $('<div>').html(options.text).dialog({
                                dialogClass: "ccmvideo-dialog",
                                modal: true,
                                resizable: false,
                                width: 500
                            });
                            $.closeDialog();
                        }
                    }
                    break;
                default:
            }
        });
    };
    $.popupOnVideoEnded.defaultOptions = {
        text: '<div class="promopopup">' + '	<div class="title">Cette vid&eacute;o vous a plu ?</div> ' + '	<div style="clear:both"/> ' + '	<span class="cell">Suivez-nous sur Facebook</span> ' + '	<span class="cell">Retrouvez-nous sur android</span> ' + '	<div style="clear:both"/> ' + '	<div class="buttons" height="100px"> ' + '		<div class="cell cellFB"> ' + '			<iframe id="fbiframe" src="//www.facebook.com/plugins/like.php?href=https%3A%2F%2Fwww.facebook.com%2Fpages%2FVideo-Snack%2F590782377695333&amp;width=50&amp;layout=button&amp;action=like&amp;show_faces=false&amp;share=false&amp;height=35&amp;appId=389263707785976" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:80px; height:35px;" allowTransparency="true"></iframe> ' + '		</div> ' + '		<div class="cell cellPlayStore"> ' + '			<a href="https://ad.apps.fm/JkbD8oUlb00QmVFLrUmhrV5KLoEjTszcQMJsV6-2VnHFDLXitVHB6BlL95nuoNYfBeuu7bB1jusMNMB0IlW_I4CPIkePXjD_vuA1SvDHI94" target="_blanck"> ' + '				<img src="https://astatic.ccmbg.com/ressource/common/img/googleplay_logo.png"> ' + '			</a> ' + '		</div> ' + '	</div> ' + '	<div style="clear:both"/> ' + '	<div class="alreadyfollow">	Vous nous suivez d&eacute;j&agrave; ? <a id="closeDialog" href="#">Ne plus afficher</a></div> ' + '</div>'
    };
    $.closeDialog = function() {
        $('a#closeDialog').on('click', function() {
            if (localStorage) {
                var storageName = 'VideoSnackPromo';
                localStorage.setItem(storageName, 'true');
                $('.ui-dialog-content').dialog('close');
            }
        });
    };
}(jQuery, window, getConsole('ccmvideo')));