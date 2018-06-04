(function () {

  var page = {
    el: {},
    init: function () {
      // INIT PAGE LEVEL COMPONENTS
      return true;
    },
    hero: {
      init: function () {
        page.hero.elSelectors();
        page.el.$playBtn.on('click', page.hero.showPopUp);
        $(window).on('resize', page.hero.resizeVideo);
        $(document).on('bt:intent:dismiss', page.hero.stopVideo);
        page.hero.resizeVideo();
      },
      elSelectors: function () {
        page.el.$videoModal = $('#video__modal');
        page.el.$playBtn = $('.btn-hero--play');
        page.el.$videoSpinner = $('#video-loading-spinner');
        page.el.$videoWrapper = $('#modal-video-wrapper');
        page.el.$videoId = $('#modal-video-frame');
      },
      startVideo: function () {
        var $videoEl = page.el.$videoId;
        var videoSrc = $videoEl.attr('src');
        $videoEl.attr('src', videoSrc += '&autoplay=1');
        $videoEl.load(function () {
          page.el.$videoSpinner.hide();
          page.el.$videoWrapper.animate(
            {
              opacity: 1,
            },
            250,
          );
        });
      },
      stopVideo: function () {
        var $videoEl = page.el.$videoId;
        var videoSrc = $videoEl.attr('src');
        $videoEl.attr('src', videoSrc.replace('&autoplay=1', ''));
        page.el.$videoWrapper.css('opacity', 0);
        page.el.$videoSpinner.show();
      },
      showPopUp: function () {
        page.el.$videoModal.addClass('show');
        page.hero.startVideo();
      },
      resizeVideo: function () {
        var $videoWrapper = page.el.$videoWrapper;
        var widthToSet = $(window).width() - 100;
        var maxWidth = 1000;

        if (widthToSet > maxWidth) {
          widthToSet = maxWidth;
        }

        var heightToSet = widthToSet * 0.5625;

        $videoWrapper.width(widthToSet);
        $videoWrapper.height(heightToSet);

      },
    },
  };

  $(document).on('bt:ready', page.init);
  $(document).on('bt:component:hero', page.hero.init);

})();
