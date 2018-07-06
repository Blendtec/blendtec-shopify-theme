import $ from 'jquery';
import Platform from '../util/platform';

var videoPlayer = {
    el: {},
    $videoPlayers: null,
    init: function() {
        videoPlayer.cacheSelectors();
        videoPlayer.$videoPlayers = videoPlayer.el.$featureVideoContainer.map(function(
            idx,
            el
        ) {
            return videoPlayer.Create({ $container: $(el) });
        });
    },
    Create: function(cfg) {
        var supportsInlinePlayer =
            'playsInline' in document.createElement('video');
        var defaults = {};
        var config = $.extend(defaults, cfg);

        config.sectionID = config.$container.attr('data-id');

        if (config.offsetNotificationBar) {
            config.$container.addClass('offset-notification-bar');
        }

        if (Platform.isIOS() && !supportsInlinePlayer) {
            config.$container.find('.feature-video-video').hide();
        }
    },
    cacheSelectors: function() {
        videoPlayer.el.$featureVideo = $('.feature-video-video');
        videoPlayer.el.$featureVideoContainer = $('.feature-video-container');
    },
    supportsInlinePlayer: false
};

export default videoPlayer;
