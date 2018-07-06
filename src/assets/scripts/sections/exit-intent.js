import $ from 'jquery';

var exitIntent = {
    el: {},
    cacheSelectors: function() {
       exitIntent.el.$exitIntentOverlay = $('.exit-intent-overlay');
       exitIntent.el.$document = $(document);
       exitIntent.el.$body= $(document.body);
    },
    init: function() {
        var $overlay = this.cache.$exitIntentOverlay;

        if (window.ThemeEditor == null && $('[data-exit-intent-overlay]').length) {
          setTimeout(function () {
            exitIntent.el.$document.on('mouseleave', function () {
              if (!sessionStorage.disableExitIntent) {
                sessionStorage.disableExitIntent = true;
                $('[data-exit-intent-overlay]').addClass('show');
              }
            });
          }, 2500);
        }
      
        $('body').on('click', '.close-exit-intent', function (e) {
          exitIntent.dismiss(e);
        });
      
        $('body').on('click', '.show-exit-intent', function (e) {
          e.preventDefault();
          $overlay.addClass('show');
        });;
      
        // Close if user clicks outside of exit intent on overlay
        $('body').on('click', '.exit-intent-overlay', function (e) {
          if ($(e.target).parents('.exit-intent').length === 0) {
            exitIntent.dismiss(e);
          }
        });
      
        // checks URL for successful submission of form, then shows the popup
        q = window.location.search.slice(1);
        if (q == 'customer_posted=true') {
          $overlay.addClass('show');
        }
    },
    dismiss: function(e) {
        exitIntent.el.$document.trigger('bt:intent:dismiss', e);
        e.preventDefault();
        exitIntent.el.$exitIntentOverlay.removeClass('show');
    }
};

export default exitIntent;