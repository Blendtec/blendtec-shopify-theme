import $ from 'jquery';

function initScrollTriggers() {
    var triggerSelectors = [
        '.shopify-section.featured-text',
        '.shopify-section.testimonials',
        '.shopify-section.featured-collections',
        '.shopify-section.video-player',
        '.shopify-section.features',
        '.grid--products > .grid__item',
        '.index-grid-items .index-grid-item',
      ];;
    
      // Using above selectors, get each element found
      var triggers = triggerSelectors.map(function (selector) {
        return $(selector).toArray();
      });
    
      // Flatten the array
      triggers = [].concat.apply([], triggers);
    
      if (triggers.length <= 0) {return;}
    
      function shouldTrigger (scrollTop, windowHeight, element) {
        var elementTop = element.offset().top;
        var elementHeight = element.outerHeight();
        var shouldTriggerElement = scrollTop + windowHeight > elementTop + (elementHeight * 0.5);
    
        if (shouldTriggerElement) {
          element.addClass('visible');
          return true;
        }
    
        return false;
      }
    
      function checkScrollPositions () {
        var scrollTop = window.pageYOffset ? window.pageYOffset : document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop;
        var windowHeight = window.innerHeight;
    
        triggers.forEach(function (trigger, index) {
          if (shouldTrigger(scrollTop, windowHeight, $(trigger))) {
            triggers.splice(index, 1);
          }
        });
    
        if (triggers.length == 0) {
          $(window).off('scroll', checkScrollPositions);
        }
      };
    
      $(window).on('scroll', checkScrollPositions);
      setTimeout(checkScrollPositions, 100);
}

export default initScrollTriggers;