import $ from 'jquery';

var accessibleNav = {
    el: {},
    cacheSelectors: function() {
        accessibleNav.el.$nav = $('#AccesibleNav'); 
        accessibleNav.el.$body= $('body'); 
    },
    init: function() {
        var $nav = accessibleNav.el.$nav,
        $allLinks = $nav.find('a'),
        $topLevel = $nav.children('li').find('a'),
        $parents = $nav.find('.site-nav--has-dropdown'),
        $subMenuLinks = $nav.find('.site-nav__dropdown').find('a'),
        activeClass = 'nav-hover',
        focusClass = 'nav-focus';
    
      // Mouseenter
      $parents.on('mouseenter touchstart', function (evt) {
        var $el = $(this);
    
        if (!$el.hasClass(activeClass)) {
          evt.preventDefault();
        }
    
        showDropdown($el);
      });
    
      // Mouseout
      $parents.on('mouseleave', function () {
        hideDropdown($(this));
      });
    
      $subMenuLinks.on('touchstart', function (evt) {
        // Prevent touchstart on body from firing instead of link
        evt.stopImmediatePropagation();
      });
    
      $allLinks.blur(function () {
        removeFocus($topLevel);
      });
    
      // accessibleNav private methods
      function handleFocus ($el) {
        var $subMenu = $el.next('ul');
        var hasSubMenu = !!$subMenu.hasClass('sub-nav');
        var isSubItem = $('.site-nav__dropdown').has($el).length;
        var $newFocus = null;
    
        // Add focus class for top level items, or keep menu shown
        if (!isSubItem) {
          removeFocus($topLevel);
          addFocus($el);
        } else {
          $newFocus = $el.closest('.site-nav--has-dropdown').find('a');
          addFocus($newFocus);
        }
      }
    
      function showDropdown ($el) {
        $el.addClass(activeClass);
    
        setTimeout(function () {
          accessibleNav.el.$body.on('touchstart', function () {
            hideDropdown($el);
          });
        }, 250);
      }
    
      function hideDropdown ($el) {
        $el.removeClass(activeClass);
        accessibleNav.el.$body.off('touchstart');
      }
    
      function addFocus ($el) {
        $el.addClass(focusClass);
      }
    
      function removeFocus ($el) {
        $el.removeClass(focusClass);
      }
    }
};

export default accessibleNav;