import $ from 'jquery';

var hero = {
        el: {},
        init: function() { 
            hero.cacheSelectors();
            hero.el.$playBtn.on('click', hero.showPopUp);
            hero.el.$window.on('resize', hero.resizeVideo);
            hero.el.$document.on('bt:intent:dismiss', hero.stopVideo);
            hero.resizeVideo();
            hero.youtubeButtonInit();
        },
        cacheSelectors: function() {
            hero.el.$window = $(window);
            hero.el.$document = $(document);
            hero.el.$body = $(document.body);
            hero.el.$videoModal = $('#video__modal');
            hero.el.$playBtn = $('.btn-hero--play');
            hero.el.$videoSpinner = $('#video-loading-spinner');
            hero.el.$videoWrapper = $('#modal-video-wrapper');
            hero.el.$videoId = $('#modal-video-frame');
            hero.el.$videoClips = $('.youtube-video-start');
        },
        startVideo: function() {
            var $videoEl = hero.el.$videoId;
            var videoSrc = $videoEl.attr('src');
            $videoEl.attr('src', (videoSrc += '&autoplay=1'));
            $videoEl.load(function() {
                hero.el.$videoSpinner.hide();
                hero.el.$videoWrapper.animate(
                    {
                        opacity: 1
                    },
                    250
                );
            });
        },
        stopVideo: function() {
            var $videoEl = hero.el.$videoId;
            var videoSrc = $videoEl.attr('src');
            $videoEl.attr('src', videoSrc.replace('&autoplay=1', ''));
            hero.el.$videoWrapper.css('opacity', 0);
            hero.el.$videoSpinner.show();
        },
        showPopUp: function() {
            hero.el.$videoModal.addClass('show');
            hero.startVideo();
        },
        resizeVideo: function() {
            var $videoWrapper = hero.el.$videoWrapper;
            var widthToSet = hero.el.$window.width() - 100;
            var maxWidth = 1000;

            if (widthToSet > maxWidth) {
                widthToSet = maxWidth;
            }

            var heightToSet = widthToSet * 0.5625;

            $videoWrapper.width(widthToSet);
            $videoWrapper.height(heightToSet);
        },
        setVideoSource: function(videoId) {
            hero.el.$videoId.attr('src', 'https://www.youtube.com/embed/' + videoId + '?playlist=' + videoId);
        },
        youtubeButtonInit: function() {
            hero.el.$videoClips.on('click', function () {
                var videoId = $(this).attr('data-variant-id');
                hero.setVideoSource(videoId);
                hero.showPopUp();
            });
        }
    };

export default hero;


