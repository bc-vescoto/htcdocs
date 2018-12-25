define(['vue', 'axios', 'backbone', 'ooyalaHtml5'], (Vue, Axios, Backbone) => {
    var VideoSearchResults;
    return VideoSearchResults = (function (){

        function VideoSearchResults(params) {

           // alert('first time load');
            if (typeof window.videoScrollers !== "undefined") {
                window.removeEventListener('scroll', window.videoScrollers, true);
            }
            if (typeof window.ps !== "undefined") {
                window.ps.destroy();
            }
            let filter = {
                
                pageLoad: params.pageLoad,
                videoSource : params.videoSource,
                playBtn : params.playBtn,
                videoContainer : params.videoContainer,
                currentVideo : params.currentVideo,
                listLength : params.listLength,
                startingIndex : params.startingIndex,
                filterContainer: params.filterContainer,
                addVideos: true,
                selectedMedia : params.selectedMedia !== "" ? params.selectedMedia : "all",
                selectedChannel : params.selectedChannel !== "" ? params.selectedChannel : "all",
                selectedPlayer : params.selectedPlayer !== "" ? params.selectedPlayer : "all",
                selectedTournament : params.selectedTournament !== "" ? params.selectedTournament : "all",
                selectedYear : params.selectedYear !== "" ? params.selectedYear : "all",
                selectedOther : params.selectedOther !== "" ? params.selectedOther : "all",
                language : params.language,
                videos : {
                    list : JSON.parse(params.videoPlaylist),
                    currentVideo: JSON.parse(params.featuredVideo),
                    class: "",
                    autoplay: true,

                },
                OOParams: null
        }
            filter.videos.currentVideo.NextVideo = {
                VideoSource: "",
                VideoPreviewImg: "",
                VideoTitle:""

            }
            this.options = this.Extend(filter);

            filter.OOParams = this.OoyalaParams();
            if (params.pageLoad) {
                this.Init();
            }

        }

        VideoSearchResults.prototype.Extend = function (){
            for (var i = 1; i < arguments.length; i++)
                for (var key in arguments[i])
                    if (arguments[i].hasOwnProperty(key)) {
                        if (typeof arguments[0][key] === 'object' && typeof arguments[i][key] === 'object')
                            extend(arguments[0][key], arguments[i][key]);
                        else arguments[0][key] = arguments[i][key];
                    }
            return arguments[0];
        }
        VideoSearchResults.prototype.Init = function (){
            const self = this;
            self.createPlaylist();
            self.Vues();

        }
        
        VideoSearchResults.prototype.LoadVideo = function (video, OOParams = null ){
            const self = this;
            let params = OOParams === null ? self.options.OOParams: OOParams;
            document.querySelector('#videoPlayer').classList.add('playing');
            document.querySelector('#videoPlayer').classList.remove('played');
            document.querySelector('.upcoming-video').classList.remove('active');
            if (typeof window.ps !== "undefined") {
                window.ps.destroy();
            }
            OO.ready(function () {
                window.ps = OO.Player.create("playerContainer", video.VideoSource, params);
               
            });
        }
        VideoSearchResults.prototype.OoyalaParams = function (){
            const self = this;
            let playerParams = {
                "debug":true,
                //"videoContainer": self.options.videoContainer,
                //"currentVideo": self.options.videos.currentVideo,
                //"videoPlaylist": self.options.videos.list,
                //    "loadVideo" : self.LoadVideo,
                "pcode": 'oyOWM6aW42sWVTTHd2ralFPwaILO',
                "playerBrandingId": 'NDU0YmRlYWM3NWFlMGU5OGI0YmYyZTBj',
                "autoplay": true,
                "loop": false,
                "platform": "html5",
                "encodingPriority": ["hls", "dash", "mp4", "hds"],
                "skin": {
                    'config': 'https://player.ooyala.com/static/v4/stable/4.26.10/skin-plugin/skin.json'
                }
                //onCreate : self.OoyalaPlayer
            };
            return playerParams;
        } 
        VideoSearchResults.prototype.OoyalaPlayer = function (player) {
            
            const self = this;
            void 0;
            const autoPlayNext = function() {
                        document.querySelector('.upcoming-video').classList.add('active');
                        window.setTimeout(function() {
                                if (window.autoPlayVideo === false) {
                                    return;
                                }
                                document.querySelector('#nextVideoBtn').click();
                            },
                            10000);
            }
            const errorPlayNext = function () {
                if (typeof window.videoPlayList !== "undefined") {
                    window.videoPlayList += 1;
                }
                else {
                    window.videoPlayList = 0;
                }
                document.querySelector('.upcoming-video').classList.add('active');
                window.setTimeout(function() {
                        if (window.autoPlayVideo === false) {
                            return;
                    }

                        document.querySelector('#videoPlayer').classList.add('playing');
                        document.querySelector('#videoPlayer').classList.remove('played');
                        document.querySelector('.upcoming-video').classList.remove('active');
                        OO.ready(function () {
                            window.ps = OO.Player.create("playerContainer", self.videoPlaylist[window.videoPlayList].VideoSource, self);
               
                        });
                    },
                    10000);
            }
                
                player.mb.subscribe("*",
                    "example",
                    function (eventName) {
                      
                        if (eventName === OO.EVENTS.ERROR) {
                            void 0;
                            
                        }
                        if (eventName === OO.EVENTS.VC_PLAYED) {
                            window.ps.destroy();
                            autoPlayNext();
                            return;
                        }
                    });
        }

        VideoSearchResults.prototype.Vues = function (){
            const self = this;
            Vue.component('listing',
                {
                    props: ['videos'],
                    template: document.querySelector('#filterListTemplate').innerHTML,
                    methods: {
                        loadSelected: function (video) {
                            self.options.videos.currentVideo = video;
                            let docTitle = document.title;
                            const pageTitle = docTitle.split("/")[0];
                            document.title = docTitle.replace(pageTitle, video.VideoTitle);
                            Backbone.history.navigate(video.VideoArticleURL, false);

                            self.LoadVideo(self.options.videos.currentVideo);
                        }
                    },
                    updated: function () {
                        window.setTimeout(function () {
                            if (self.options.addVideos === false) {
                                self.options.addVideos = true;
                            }
                        },
                            5000);
                    }
                });

            const playerList = new Vue({
                el: '#filterListing',
                data: {
                    list: self.options.videos
                }
            });



            const featuredVideo = new Vue({
                el: '#featuredVideo',
                data: {
                    featured: self.options.videos,
                    sticky: self.options.videos,
                    playing: self.options.videos
                },
                methods: {
                    loadNext: function (videoSource) {
                        for (let i = 0; i < self.options.videos.list.length; i++) {
                            if (videoSource === self.options.videos.list[i].VideoSource) {
                                self.options.videos.currentVideo = self.options.videos.list[i];
                                break;
                            }
                        }

                        const video = self.options.videos.currentVideo;
                        let docTitle = document.title;
                        const pageTitle = docTitle.split("/")[0];
                        document.title = docTitle.replace(pageTitle, video.VideoTitle);
                        Backbone.history.navigate(video.VideoArticleURL, false);
                        self.LoadVideo(self.options.videos.currentVideo);
                    },
                    loadSelected: function (video) {
                        self.options.videos.currentVideo = video;
                        let docTitle = document.title;
                        const pageTitle = docTitle.split("/")[0];
                        document.title = docTitle.replace(pageTitle, video.VideoTitle);
                        Backbone.history.navigate(video.VideoArticleURL, false);
                        self.LoadVideo(self.options.videos.currentVideo);
                    },
                    cancelAutoPlay: function (){
                        void 0;
                        if (self.options.videos.autoPlay) {
                            self.options.videos.autoPlay = false;
                            window.autoPlayVideo = false;

                        }
                        else {
                            self.options.videos.autoPlay = true;
                            window.autoPlayVideo = true;
                            document.querySelector('#nextVideoBtn').click();
                        }
                    },
                    upcomingVideo: function (video){
                        if (window.autoPlayVideo) {

                        }
                    }
                },
                mounted: function (){
                    if (typeof window.autoPlayVideo !== "undefined") {
                        self.options.videos.autoPlay = window.autoPlayVideo;

                    }
                    else {
                        window.autoPlayVideo = self.options.videos.autoPlay;
                    }
                    
                }
            });
        }


        VideoSearchResults.prototype.createPlaylist = function (){
            void 0;
            const self = this;
            const getVideoName = window.location.pathname.split("/")[4];
            const getCurrentVideo = getVideoName !== "all" ? self.options.videos.currentVideo : 0;

            const modifiedList = function (arr) {
                const modified = arr.slice();
                modified.push(modified.shift());
                for (let i = 0; i < arr.length; i++) {
                    const objectString = JSON.stringify(modified[i]);
                    arr[i].NextVideo = JSON.parse(objectString);
                }
                self.options.videos.list = arr;
            }

            const videoObj = function (){
                void 0;
                for (let i = 0; i < self.options.videos.list.length; i++) {
                    if (self.options.videos.currentVideo.VideoSource === self.options.videos.list[i].VideoSource) {
                        const objectString = JSON.stringify(self.options.videos.list[i].NextVideo);
                        self.options.videos.currentVideo.NextVideo = JSON.parse(objectString);
                        return;
                    }
                }
                void 0;


            }

            const getPlayerList = function () {
                const startIndex = self.options.videos.list.length;
                let searchURL =
                    "/-/ajax/videoapi/getvideos?channelName=" + self.options.selectedChannel + "&tournamentTagName=" + self.options.selectedTournament + "&playerTagName=" + self.options.selectedPlayer + "&yearTagName=" + self.options.selectedYear + "&otherTagName=" + self.options.selectedOther + "&languageName=" + self.options.language + "&startIndex=" + startIndex;
                Axios.get(searchURL).then(function (response) {
                    modifiedList(self.options.videos.list.concat(response.data));
                });

            }
            
            const videoContainer = self.options.videoContainer;
            const parentContainer = videoContainer.parentElement;
            const coordinates = videoContainer.getBoundingClientRect();
            const videoStartY = coordinates.top;
            const videoStartBottom = coordinates.bottom;
            const mainContainerCoordinates = document.querySelector('#mainContainer').getBoundingClientRect();
            const stickyVideoStyle = document.createElement('style');

            stickyVideoStyle.type = 'text/css';
            stickyVideoStyle.innerHTML =
                '.video-player { left: calc(' + mainContainerCoordinates.right + 'px - 320px);}';
            document.getElementsByTagName('head')[0].appendChild(stickyVideoStyle);


            const stickyVideo = function () {
                let scrollCount = Math.abs(document.querySelector('html').getBoundingClientRect().top) + videoStartY;
                void 0;
                if (scrollCount > videoStartBottom) {
                    self.options.videos.class = 'video-container sticky-video';

                }
                if (scrollCount === videoStartY) {
                    self.options.videos.class = '';
                }
            }
            const scroll = function () {

                const coordinates = document.querySelector('#filterListing').getBoundingClientRect();
                let listHeight = coordinates.height - 300;
                let scrollCount = Math.abs(document.querySelector('html').getBoundingClientRect().top);
                if (scrollCount >= listHeight && self.options.addVideos) {
                    void 0;
                    self.options.addVideos = false;
                    getPlayerList();
                }
            }
            const videoScrollers = function () {

                scroll();
                stickyVideo();
            }

            


            if (self.options.pageLoad) {
                modifiedList(self.options.videos.list);
                videoObj();
                
            }
            else {
                getPlayerList();
            }

            self.LoadVideo(self.options.videos.currentVideo);
            window.videoScrollers = videoScrollers;
            window.addEventListener('scroll', window.videoScrollers, true);
        }
        

        return VideoSearchResults;

    })();

});