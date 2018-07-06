import $ from 'jquery';

var responsiveVideos = {
    init: function() {
        $('iframe[src*="youtube.com/embed"]').wrap(
            '<div class="video-wrapper"></div>'
        );
        $('iframe[src*="player.vimeo"]').wrap(
            '<div class="video-wrapper"></div>'
        );
    }
};

export default responsiveVideos;
