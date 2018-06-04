(function () {

  var page = {
    cache: {},
    init: function () {
      // INIT PAGE LEVEL COMPONENTS
      return true;
    },
    hero: {
      init: function () {
        page.hero.cacheSelectors();
        page.cache.$playBtn.on('click', page.hero.showPopUp);
        $(window).on('resize', page.hero.resizeVideo);
        $(document).on('bt:intent:dismiss', page.hero.stopVideo);
        page.hero.resizeVideo();
      },
      cacheSelectors: function () {
        page.cache.$videoModal = $('#video__modal');
        page.cache.$playBtn = $('.btn-hero--play');
        page.cache.$videoSpinner = $('#video-loading-spinner');
        page.cache.$videoWrapper = $('#modal-video-wrapper');
        page.cache.$videoId = $('#modal-video-frame');
      },
      startVideo: function () {
        var $videoEl = page.cache.$videoId;
        var videoSrc = $videoEl.attr('src');
        $videoEl.attr('src', videoSrc += '&autoplay=1');
        $videoEl.load(function () {
          page.cache.$videoSpinner.hide();
          page.cache.$videoWrapper.animate(
            {
              opacity: 1,
            },
            250,
          );
        });
      },
      stopVideo: function () {
        var $videoEl = page.cache.$videoId;
        var videoSrc = $videoEl.attr('src');
        $videoEl.attr('src', videoSrc.replace('&autoplay=1', ''));
        page.cache.$videoWrapper.css('opacity', 0);
        page.cache.$videoSpinner.show();
      },
      showPopUp: function () {
        page.cache.$videoModal.addClass('show');
        page.hero.startVideo();
      },
      resizeVideo: function () {
        var widthToSet = $(window).width() - 100;
        var maxWidth = 1000;

        if (widthToSet > maxWidth) {
          widthToSet = maxWidth;
        }

        var heightToSet = widthToSet * 0.5625;

        page.cache.$videoWrapper.width(widthToSet);
        page.cache.$videoWrapper.height(heightToSet);

      },
    },
  };

  $(document).on('bt:ready', page.init);
  $(document).on('bt:component:hero', page.hero.init);

})();
