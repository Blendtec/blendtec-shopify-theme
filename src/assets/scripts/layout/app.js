/**
 * Ira main initializer
 */

var bt = {};
window.ira = window.ira || {};
window.bt = bt;

ira.cacheSelectors = function () {
  ira.cache = {
    // General
    $window: $(window),
    $html: $('html'),
    $body: $('body'),
    windowHeight: $(window).height(),

    // Navigation
    $navigation: $('#AccessibleNav'),
    $mobileSubNavToggle: $('.mobile-nav__has-sublist'),
    $header: $('.site-header'),
    $headerControls: $('.site-header-controls'),
    $headerCurrencyConverter: $('.header-message-currency'),

    // Drawers
    $allDrawers: $('.drawer'),

    // Customer Pages
    $recoverPasswordLink: $('#RecoverPassword'),
    $hideRecoverPasswordLink: $('#HideRecoverPasswordLink'),
    $recoverPasswordForm: $('#RecoverPasswordForm'),
    $customerLoginForm: $('#CustomerLoginForm'),
    $passwordResetSuccess: $('#ResetSuccess'),


    // Exit intent / misc
    $exitIntentOverlay: $('.exit-intent-overlay'),
    $closeModalBtn: $('.modal-exit__btn'),
    $notificationBar: $('#notification-bar'),
    $fadeOutOverlay: $('.fadeout-overlay'),
    $searchBar: $('#HeaderSearchBar'),
    $pageContainer: $('#PageContainer'),

    // Footer
    $footer: $('#shopify-section-footer'),
  };
};

bt.init = function () {
  // legacy
  ira.init();
  $(document).trigger('bt:ready');
};

ira.init = function () {
  ira.cacheSelectors();
  ira.accessibleNav();
  ira.drawersInit();
  ira.mobileNavToggle();
  ira.responsiveVideos();
  ira.loginForms();
  ira.exitIntentInit();
  ira.truncateExcerptText();
  ira.headerInit();

  if (ira.cache.$body.imagesLoaded) {
    ira.cache.$body.imagesLoaded(function () {
      ira.footerInit();
    });
  }

  $(window).on('resize', function () {
    var windowWidth = $(window).width(),
      windowHeight = $(window).height();
    if (windowWidth != ira.cache.windowWidth) {
      $(window).trigger('widthChange');
      ira.cache.windowWidth = windowWidth;
    }
    if (windowHeight != ira.cache.windowHeight) {
      $(window).trigger('heightChange');
      ira.cache.windowHeight = windowHeight;
    }
  }).trigger('resize');

  if (ira.isIOS) {
    $(document.body).addClass('ios');;
  } else {
    ira.initScrollTriggers();
  }

  $(window).on('widthChange', function () { ira.footerInit(); });

  // If we're on the index page
  if ($(document.body).hasClass('template-index')) {
    var $firstSection = $('.parallax-container .shopify-section').eq(0);

    // If the first section is a carousel, enable parallax functionality
    if ($firstSection.hasClass('carousel')) {
      $firstSection
        .addClass('has-parallax')
        .attr('data-parallax', 'true')
        .attr('data-speed', '0.5')
        .attr('data-direction', 'down');
    }
  }

  if ($(document.body).hasClass('template-collection')) {
    var $firstSection = $('.parallax-container #shopify-section-collection-template .section-header');

    $firstSection
      .addClass('has-parallax')
      .attr('data-parallax', 'true')
      .attr('data-speed', '0.5')
      .attr('data-direction', 'down');

  }

  if ($('.parallax-element').length) {
    var $firstSection = $('.parallax-element');

    $firstSection
      .addClass('has-parallax')
      .attr('data-parallax', 'true')
      .attr('data-speed', '0.5')
      .attr('data-direction', 'down');
  }

  $('.carousel-container').each(function (_, carouselEl) {
    var carousel = $(carouselEl);

    ira.carousels.push(new ira.Carousel({
      container: carousel,
      enableKenBurns: carousel.attr('data-ken-burns'),
      slideTimeout: carousel.attr('data-slide-timeout'),
    }));
  });

  // Parallax is on by default at Shopify's request.  If you'd like to remove it,
  // simply comment out the following line:
  ira.parallax();

  if (ira.cache.$notificationBar.length > 0) {
    ira.cache.$body.addClass('respond-to-notification-bar');
  }

  ira.cache.$body.addClass('ready');
  $(document).trigger('ira.ready');

};

ira.setupCurrencyConverter = function () {
  var currencySelect = $('.currency-picker');

  if (currencySelect.length && !$('.currency-picker-label').length) {
    var wrapper = $('<div class="currency-picker-outer" />');
    var label = $('<span class="currency-picker-label" />');
    currencySelect.wrap(wrapper);
    currencySelect.before(label);

    currencySelect
      .val(Currency.currentCurrency)
      .on('change', function () {
        label.text(currencySelect.children('option:selected').text());
      })
      .trigger('change');
  }
};

ira.initCatalogMenu = function (menu) {
  var triggers = menu.find('ul li');
  var images = menu.find('.catalog-menu-collection-image');

  triggers.on('mouseenter', function (event) {
    var index = $(event.target).attr('data-index');
    images.filter('[data-index=' + index + ']').addClass('visible');
  });

  triggers.on('mouseleave', function () {
    images.removeClass('visible');
  });
};

ira.initScrollTriggers = function () {
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
      ira.cache.$window.off('scroll', checkScrollPositions);
    }
  };

  ira.cache.$window.on('scroll', checkScrollPositions);
  setTimeout(checkScrollPositions, 100);
};

/**
 * This function makes background videos play on iOS.
 * Since Apple doesn't allow autoplaying videos on mobile,
 * we simply treat any touch event as a video-start event.
 */
ira.isIOS = /iPad|iPhone|iPod/.test(navigator.platform);
ira.isAndroid = /Android/i.test(navigator.userAgent);

ira.accessibleNav = function () {
  var $nav = ira.cache.$navigation,
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
    var $subMenu = $el.next('ul'),
      hasSubMenu = !!$subMenu.hasClass('sub-nav'),
      isSubItem = $('.site-nav__dropdown').has($el).length,
      $newFocus = null;

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
      ira.cache.$body.on('touchstart', function () {
        hideDropdown($el);
      });
    }, 250);
  }

  function hideDropdown ($el) {
    $el.removeClass(activeClass);
    ira.cache.$body.off('touchstart');
  }

  function addFocus ($el) {
    $el.addClass(focusClass);
  }

  function removeFocus ($el) {
    $el.removeClass(focusClass);
  }
};

ira.headerInit = function (ignoreNav) {
  var header = $('.site-header');

  ira.stickyHeader({
    stickyHeaderEnabled: header.attr('data-sticky-header') == 'true',
    notificationBarEnabled: header.attr('data-notification-bar') == 'true',
  });

  ira.transparentHeader({
    transparentHeaderEnabled: header.attr('data-transparent-header') == 'true' || $('.parallax-container').children().first()
.hasClass('carousel'),
    stickyHeaderEnabled: header.attr('data-sticky-header') == 'true',
  });

  if (!ignoreNav) {
    ira.setupNavigation({
      navigationInline: header.attr('data-inline-navigation') == 'true',
    });
  }

  ira.searchInit({
    transparentHeaderEnabled: header.attr('data-transparent-header') == 'true',
    stickyHeaderEnabled: header.attr('data-sticky-header') == 'true',
  });

  if (header.attr('data-currency-converter') == 'true') {
    setTimeout(ira.setupCurrencyConverter, 50);
  }

  var catalogMenu = $('.dropdown.catalog-menu');
  if (catalogMenu.length) {
    ira.initCatalogMenu(catalogMenu);
  }
};;

ira.footerInit = function () {
  var $container = ira.cache.$pageContainer,
    $footer = ira.cache.$footer;
  var containerHeight = ira.cache.$pageContainer.outerHeight(true),
    windowHeight = $(window).height(),
    fixed = $footer.hasClass('absolute');

  if (containerHeight <= windowHeight && ira.cache.containerHeight != containerHeight && !fixed) {
    var fh = $footer.outerHeight();

    $footer.addClass('hidden');

    $footer.addClass('absolute');
    $container.css({
      'padding-bottom': fh,
    });
    $footer.removeClass('hidden');
  } else if (containerHeight > windowHeight && ira.cache.containerHeight != containerHeight && fixed) {
    $footer.addClass('hidden').removeClass('absolute');
    $container.css({
      'padding-bottom': 0,
    });
    $footer.removeClass('hidden');
  }

  ira.cache.containerHeight = containerHeight;
};;

ira.stickyHeader = function (options) {
  var CLASS_NAME = 'sticky-header';
  var stickyHeaderEnabled = options.stickyHeaderEnabled;
  var notificationBarEnabled = options.notificationBarEnabled;

  if (window.location.pathname.indexOf('products') !== -1 &&
    ira.cache.$html.hasClass('supports-touch')) {
    // We don't want sticky header on the product page for mobile
    return $(`.${CLASS_NAME}`).removeClass(CLASS_NAME);
  }

  if (stickyHeaderEnabled) {
    // We want to add classes to the drawers too,
    // so they know what height to be via CSS.
    var header = $('.site-header');
    // var drawers = ira.cache.$allDrawers;
    var searchBar = ira.cache.$searchBar;
    var header = header.add(searchBar);

    var headerControls = $('.site-header-controls');
    var controlsHeight = headerControls.height();
    var notificationBarHeight = $('#notification-bar').height();

    if (notificationBarEnabled) {
      controlsHeight += notificationBarHeight;
    }

    /**
     * Set the .offset-by-notification-bar top to the CSS CLASS, /not/ the elements themselves
     * This is because the class is removed via JS when the user scrolls down, and we want
     * the "top: xx" to be gone as well.
     */
    function notificationBarOffset () {
      var sheet = document.getElementById('js-notificationBarStyle');
      if (!sheet) {
        sheet = document.createElement('style');
        sheet.id = 'js-notificationBarStyle';;
      }

      if (navigator.appVersion.indexOf('MSIE 8') > 0) {
        // thanks ie8 for making the internet a better place
        var ie8Styles = document.createElement('style');
        document.getElementsByTagName('head')[0].appendChild(ie8Styles);
        ie8Styles.setAttribute('type', 'text/css');
        ie8Styles.styleSheet.cssText = '.offset-by-notification-bar {top: ' + ira.cache.$notificationBar.height() + 'px}';

      } else {
        sheet.innerHTML = '.offset-by-notification-bar {top: ' + ira.cache.$notificationBar.height() + 'px} @media (max-width: 839px) { :not(.js-drawer-open) .sm-offset-by-notification-bar {top: ' + ira.cache.$notificationBar.height() + 'px}}';
      }


      document.body.appendChild(sheet);
    }


    var detachHeader = function () {
      if (ira.cache.$body.hasClass('js-drawer-open')) {
        return;
      }
      var top = window.pageYOffset ? window.pageYOffset : document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop;
      if (top <= controlsHeight) {
        headerControls.removeClass('medium-down--fixed');
        ira.cache.$searchBar.removeClass('medium-down--fixed');
        ira.cache.$body.removeClass('js-header-attached');

        $(window).off('scroll', detachHeader);
        $(window).on('scroll', attachAndCondenseHeader);
      }
    };;

    var attachAndCondenseHeader = function () {
      if (ira.cache.$body.hasClass('js-drawer-open')) {
        return;
      }
      var top = window.pageYOffset ? window.pageYOffset : document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop;
      var controlsOffset = headerControls.position().top;

      // if (notificationBarEnabled && top >= notificationBarHeight){
      if (notificationBarEnabled && top >= notificationBarHeight) {
        header.removeClass('offset-by-notification-bar');;
      } else if (notificationBarEnabled && top < notificationBarHeight) {
        header.addClass('offset-by-notification-bar');;
      }

      // Add the && !() so it doesn't always re-register on scroll
      if (top >= controlsHeight && !headerControls.hasClass('medium-down--fixed')) {
        headerControls.addClass('medium-down--fixed');
        ira.cache.$searchBar.addClass('medium-down--fixed');
        ira.cache.$body.addClass('js-header-attached');

        if ($(window).width() <= 840 && ira.cache.$searchBar.offset().top < ira.cache.$headerControls.offset().top) {
          ira.cache.$searchBar.css('top', ira.cache.$header.height() + 1);
        }


        // Only worry about detaching once it's been attached.
        $(window).on('scroll', detachHeader);
      }

    };

    $(window).on('scroll', attachAndCondenseHeader);
    $(window).on('resize', detachHeader);
    attachAndCondenseHeader();
    detachHeader();

    if (notificationBarEnabled) {
      notificationBarOffset();
      $(window).resize(notificationBarOffset);
    }

  }

};;

ira.transparentHeader = function (options) {
  var transparentHeaderEnabled = options.transparentHeaderEnabled;
  var stickyHeaderEnabled = options.stickyHeaderEnabled;
  var className = 'transparent-header';

  // Transparent header is only active on the homepage and collections pages with images.
  var onHomePage = window.location.pathname === '/';
  var onCollectionPage = window.location.pathname.split('/')[1] === 'collections';
  var onImageCollectionPage = onCollectionPage && $('.section-header--image').length;
  transparentHeaderEnabled = onHomePage || onImageCollectionPage;
  if (!onHomePage && !onImageCollectionPage) {
    $(`.${  className}`).removeClass(className);
  }

  // Important to call this /after/ the classname has been removed.
  this.adjustContentOffset(options);

  var hasScrolled = false;
  var header = ira.cache.$header;
  var headerControlsHeight = ira.cache.$headerControls.height();
  var fadeInClassName = '.js-transparent-header-fadein:first';
  var carouselContainer = $('.main-content .shopify-section.carousel:first-child, .main-content .shopify-section.video-player:first-child, .collection-pages .section-header').first();
  var animating = false;

  // As of this writing, that class is only apparent in index.
  // And we only want parallax on the index page.
  if ($(fadeInClassName).length === 0) {
    return;
  }

  if (transparentHeaderEnabled) {
    ira.cache.$body.addClass('respond-to-transparent-header');
  }

  if (transparentHeaderEnabled && stickyHeaderEnabled) {
    $(window).on('scroll', scrollAnimationLoop);
  }

  function scrollAnimationLoop () {
    if (!animating) {
      drawScroll();
      requestAnimationFrame(scrollAnimationLoop);
      animating = true;
    }
  }

  function drawScroll () {
    fadeInTransparentHeader();
    fadeOutHandler();
    animating = false;
  }

  function fadeInTransparentHeader () {
    var top = window.pageXOffset ? window.pageXOffset : document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop;
    // storygridstart changes on resize events and such, so we should recalculate it each time
    // var storyGridStart = $(fadeInClassName).position().top;
    var offset = headerControlsHeight;

    if (carouselContainer.length) {
      offset = carouselContainer.height() - headerControlsHeight;;
    }

    // we're at the smaller breakpoint so we need to push the offset up higher,
    // as we now have the carousel-text as a distinct element
    if (ira.cache.$headerControls.css('position') == 'fixed' && (Boolean(carouselContainer.length))) {
      offset -= parseInt(carouselContainer.css('padding-bottom').replace('px', ''), 10);;
    }

    if (top >= offset) {
      // manually toggle transition time, since we want it to be set to 0
      // when the user opens the menu, but not on the scroll condition
      ira.cache.$headerControls.css('transition', '0.3s');
      header.removeClass(className);

      $(window).on('scroll', fadeOutHandler);
      $(window).off('scroll', fadeInTransparentHeader);
    }
  };

  function fadeOutHandler () {
    var top = window.pageXOffset ? window.pageXOffset : document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop;
    // storygridstart changes on resize events and such, so we should recalculate it each time
    // var storyGridStart = $(fadeInClassName).position().top;
    var offset = headerControlsHeight;

    if (carouselContainer.length) {
      offset = carouselContainer.height() - headerControlsHeight;
    }

    if (ira.cache.$headerControls.css('position') == 'fixed' && (Boolean(carouselContainer.length))) {
      offset -= parseInt(carouselContainer.css('padding-bottom').replace('px', ''), 10);
    }

    if (top <= offset) {
      if (header.is('[data-transparent-header="true"]')) {
        header.addClass(className);
      }

      // set the transition time back to default now that the animation is over
      setTimeout(function () {
        ira.cache.$headerControls.css('transition', '0s');
      }, 600);

      $(window).on('scroll', fadeInTransparentHeader);
      $(window).off('scroll', fadeOutHandler);
    }
  };

};

ira.setupNavigation = function (options) {
  var debouncedPrepare = _.debounce(function () {
    if (options.navigationInline) {
      if (ira.navigationStyle === 'desktop') {
        ira.setNavStyle(ira.whichNav());
      } else if (ira.navigationStyle === 'mobile' && Math.ceil($(window).width()) * (3 / 4) > Math.ceil($('.site-header__logo').outerWidth(true) + 1) + ira.navWidth + 15) {
        ira.navigationStyle = 'desktop';
        ira.setNavStyle('desktop');
      }
    }
  }, 100);

  $(window).on('resize', debouncedPrepare);

  $('.has-dropdown').on('mouseenter mouseleave', function (event) {
    var target = $(event.target);
    var container = target.hasClass('has-dropdown') ? target : target.closest('.has-dropdown');
    var catalogMenu = container.find('.catalog-menu');

    if (catalogMenu.length && event.type == 'mouseenter') {
      catalogMenu.css('margin-left', 0);

      var offset = 0;

      catalogMenu.addClass('visibly-hidden');
      var width = catalogMenu.outerWidth();
      var left = catalogMenu.offset().left;
      var difference = window.innerWidth - (width + left);

      if (difference < 0) {
        offset = difference - 20;
      }

      catalogMenu.removeClass('visibly-hidden');
      catalogMenu.css('margin-left', offset);
    }

    container.find('a').toggleClass('active');
    container.find('.dropdown').revealer('toggle');
  });

  if (options.navigationInline) {
    ira.navigationStyle = 'desktop';
    if ($('.site-header').imagesLoaded) {
      $('.site-header').imagesLoaded(function () {
        ira.setNavStyle(ira.whichNav());
      });
    }

    if ($(window).width() > 840) {
      ira.navWidth = ira.getNavWidth();
    }
  }
};;

ira.setNavStyle = function (type) {
  if (type === 'mobile') {
    $('.js-drawer-open-NavDrawer').css('display', 'inline-block');
    $('.js-account-icon').css('display', 'none');
    $('.main-navigation').hide().removeClass('nav-loading');
  } else {
    $('.js-drawer-open-NavDrawer').css('display', 'none');
    $('.js-account-icon').css('display', 'inline-block');
    $('.main-navigation').css({'left': '17%'}).show()
.removeClass('nav-loading');
  }
};;

ira.whichNav = function () {
  var windowWidth = Math.ceil($(window).width()) * (3 / 4);
  var logoWidth = Math.ceil($('.site-header__logo').outerWidth(true));
  var availableWidth = windowWidth - logoWidth;

  if (availableWidth - 15 < ira.getNavWidth()) {
    return 'mobile';
  } else {
    return 'desktop';
  }
};;

ira.getNavWidth = function () {
  var navWidth = 20;

  $('.main-navigation li').each(function (i, el) {
    navWidth += Math.ceil($(el).outerWidth(true));
  });

  return navWidth;
};;

ira.adjustContentOffset = function (options) {

  // Both transparent header and parallax are only for index page
  var transparentHeaderEnabled = options.transparentHeaderEnabled;
  var transparentHeaderEnabled = (transparentHeaderEnabled && window.location.pathname === '/');
  var parallaxEnabled = (window.location.pathname === '/');
  var stickyHeaderEnabled = (options.stickyHeaderEnabled);

  function adjust () {
    var paddingTopDistance = 0;
    var headerSizeDistance = 0;
    // On medium breakpoint the header stacks but the height doesn't double.
    // So we have to manually add to the height.

    $('#notification-bar').each(function (i, e) {
      var height = $(e).height();
      paddingTopDistance += height;
      headerSizeDistance += height;
    });

    // IE8 always breaks the header into two rows
    if ($(window).width() <= 840 || navigator.appVersion.indexOf('MSIE 8') > 1) {
      headerSizeDistance += 80;
      if (!transparentHeaderEnabled) {
        paddingTopDistance += 80;
      }
    }


    $('.site-header').each(function (i, e) {
      var height = $(e).height();
      headerSizeDistance += height;

      if (!transparentHeaderEnabled) {
        paddingTopDistance += height;
      }
    });;


    // Fixes an issue where, if the header is non-fixed/transparent + parallax
    // is enabled, then a white gap from where the parallax els move from could
    // be visible.
    if (parallaxEnabled && !transparentHeaderEnabled) {
      paddingTopDistance -= 40;
    }

    // FF fix having subpixel gaps with notification bar
    if (paddingTopDistance >= 40) {
      paddingTopDistance -= 1;
    }


    // ira.cache.$pageContainer.css('padding-top', paddingTopDistance);
    return paddingTopDistance;
  }

  if (!this.hasSetContentAdjustOnResize) {
    this.hasSetContentAdjustOnResize = true;
    $(window).resize(adjust);
  }


  return adjust();

};;

ira.searchInit = function (options) {

  var config = {
    openClassSelector: '.search-open',
    closeClassSelector: '.search-close',
    searchBarSelector: '#HeaderSearchBar',
    searchInputSelector: '#searchBarInput',
    jsClassOpen: 'js-search-open',
  };;

  var transparentHeaderEnabled = options.transparentHeaderEnabled;

  var $nodes = {
    open: $(config.openClassSelector),
    close: $(config.closeClassSelector),
    searchBar: $(config.searchBarSelector),
    input: $(config.searchInputSelector),
  };

  // Only have elements be tab-able when search is open
  $nodes.close.add($nodes.input).attr('tabindex', -1);

  function drawerOpenHandler (e) {
    ira.NavDrawer.close();
    ira.CartDrawer.close();
    $nodes.searchBar.revealer('show');
    $nodes.close.add($nodes.input).attr('tabindex', 0);;

    // iOS has a known issue for focusing on a fixed element
    if (!((navigator.userAgent.match(/(iPod|iPhone|iPad)/) && options.stickyHeaderEnabled)  ||
      navigator.appVersion.indexOf('MSIE 8') > 0)) {


      $nodes.input[0].select();
    }


    ira.cache.$header.add(ira.cache.$html).addClass(config.jsClassOpen);
    e.preventDefault();
    e.stopPropagation();
    return false;

  }

  function drawerCloseHandler (e) {
    if (typeof e !== 'undefined' && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    $nodes.searchBar.revealer('hide');
    ira.cache.$header.add(ira.cache.$html).removeClass(config.jsClassOpen);

    $nodes.close.add($nodes.input).attr('tabindex', 0);
  }

  function keyboardHandlers () {
    // Close the menu when the escape key is pressed.
    window.onkeydown = function (event) {
      if (event.keyCode === 27) {
          drawerCloseHandler();
      }

      // alt+f brings up search
      if (event.keyCode === 70 && event.altKey) {
        event.preventDefault();
        drawerOpenHandler();;
      }
    };
  }

  function closeOnOutsideClick (e) {
    // Only close if the user clicks outside of searchbox.
    // Also included header, otherwise it pre-emptively closes before opening.
    if ($('html').hasClass('js-search-open') && $(e.target).closest($nodes.searchBar).length === 0 && $(e.target).closest(ira.cache.$header).length === 0) {
      drawerCloseHandler();
    }
  }

  function killEvent (e) {
    e.preventDefault();
    e.stopPropagation();
  }


  // IE8 doesn't play nicely with some of our layout voodoo,
  // so when they click search just follow the href to search page.
  if (navigator.appVersion.indexOf('MSIE 8') <= 0) {
    $($nodes.open[0]).on('click', drawerOpenHandler);
    $($nodes.close[0]).on('click', drawerCloseHandler);
    $($nodes.searchBar[0]).on('click', killEvent);;
    $(document).on('click', closeOnOutsideClick);
    keyboardHandlers();
  }
};;

ira.drawersInit = function () {
  ira.NavDrawer = new ira.Drawers('NavDrawer', 'right');
  ira.CartDrawer = new ira.Drawers('CartDrawer', 'right', {
    onDrawerOpen: ajaxCart.load,
  });

  ira.allDrawers = [ira.NavDrawer, ira.CartDrawer];
};

bt.dismissIntent = function (e) {
  $(document).trigger('bt:intent:dismiss', e);
  e.preventDefault();
  ira.cache.$exitIntentOverlay.removeClass('show');
};

// Always init the exit intent so that things like clicking
// the 'subscribe now' button can open the modal, but only
// listen to mouse exit intent if the user has activated it
ira.exitIntentInit = function () {
  var $overlay = this.cache.$exitIntentOverlay;

  if (window.ThemeEditor == null && $('[data-exit-intent-overlay]').length) {
    setTimeout(function () {
      $(document).on('mouseleave', function () {
        if (!sessionStorage.disableExitIntent) {
          sessionStorage.disableExitIntent = true;
          $('[data-exit-intent-overlay]').addClass('show');
        }
      });
    }, 2500);
  }

  $('body').on('click', '.close-exit-intent', function (e) {
    bt.dismissIntent(e);
  });

  $('body').on('click', '.show-exit-intent', function (e) {
    e.preventDefault();
    $overlay.addClass('show');
  });;

  // Close if user clicks outside of exit intent on overlay
  $('body').on('click', '.exit-intent-overlay', function (e) {
    if ($(e.target).parents('.exit-intent').length === 0) {
      bt.dismissIntent(e);
    }
  });

  // checks URL for successful submission of form, then shows the popup
  q = window.location.search.slice(1);
  if (q == 'customer_posted=true') {
    $overlay.addClass('show');
  }
};;

ira.mobileNavToggle = function () {
  $('.mobile-nav__has-sublist').on('click', function () {
    $(this).toggleClass('mobile-nav--expanded');
    $(this).find('button > .icon').toggleClass('fade-in fade-and-flip');
  });
};

ira.getHash = function () {
  return window.location.hash;
};

ira.updateHash = function (hash) {
  window.location.hash = `#${  hash}`;
  $(`#${  hash}`).attr('tabindex', -1).focus();
};

ira.responsiveVideos = function () {
  $('iframe[src*="youtube.com/embed"]').wrap('<div class="video-wrapper"></div>');
  $('iframe[src*="player.vimeo"]').wrap('<div class="video-wrapper"></div>');
};


ira.blogFilter = function () {
  $('.blog-filtering').on('change', 'select', function (event) {
    _filterArticles(event);
  });

  $('.blog-filters').children().each(function (i, el) {
     var $el = $(el);
    var width = $el.find('.blog-filters-title').width();

     $el.find('select').css({
      'padding-left': width + 20,
    });
  });

  var _filterArticles = function (event) {
    var $target = $(event.currentTarget);
     var value = $target.val();;
     value = value.replace(/ /gi, '-');;
    value = value.toLowerCase();
    var blog = $target.data('collection-handle');
    var collection = `/blogs/${  encodeURIComponent(blog) }/tagged/`;
    if (value) {
       location = collection + encodeURIComponent(value);
    } else {
       location = `/blogs/${  encodeURIComponent(blog)}`;
    }
  };;
};;

ira.loginForms = function () {
  function showRecoverPasswordForm () {
    ira.cache.$recoverPasswordForm.show();
    ira.cache.$customerLoginForm.hide();
  }

  function hideRecoverPasswordForm () {
    ira.cache.$recoverPasswordForm.hide();
    ira.cache.$customerLoginForm.show();
  }

  ira.cache.$recoverPasswordLink.on('click', function (evt) {
    evt.preventDefault();
    showRecoverPasswordForm();
  });

  ira.cache.$hideRecoverPasswordLink.on('click', function (evt) {
    evt.preventDefault();
    hideRecoverPasswordForm();
  });

  // Allow deep linking to recover password form
  if (ira.getHash() == '#recover') {
    showRecoverPasswordForm();
  }
};

ira.resetPasswordSuccess = function () {
  ira.cache.$passwordResetSuccess.show();
};

ira.parallax = function () {

  var parallaxElement = $('.parallax-element').length;
  var onImageCollectionPage = $('.section-header--image').length;

  if (!parallaxElement && !onImageCollectionPage) {
    return;
  }

  var animating = false,
    $parallax = $('[data-parallax="true"]');

  ira.cache.$body.addClass('js-parallax');

  scrollEvent();

  function scrollEvent () {

    if (!is_touch_device() && ira.cache.windowWidth > 840) {

      var viewportTop = ira.cache.$window.scrollTop();
      var windowHeight = ira.cache.windowHeight;

      if (viewportTop <= windowHeight + 40) {

        $parallax.each(function (i, el) {
          var $el = $(el);
          var sym;
          var direction = $el.attr('data-direction');
          var speed = $el.attr('data-speed');
          var distance = viewportTop * speed;

          if (direction === 'up') {
            sym = '-';
          } else {
            sym = '';
          }

          distance = Number(distance.toFixed(2));

          $el.css({
            transform: `translate3d(0, ${  sym  }${distance  }px, 0)`,
          });
        });
      }

      animating = false;
    }
  }

  function is_touch_device () {
    return 'ontouchstart' in window || // works on most browsers
        'onmsgesturechange' in window; // works on ie10
  }

  var throttlePrepare = _.throttle(function () {
    if (!animating) {
      window.requestAnimationFrame(scrollEvent);
      animating = true;
    }
  }, 1000 / 60);

  ira.cache.$window.on('scroll', throttlePrepare);
};

ira.truncateExcerptText = function () {
  var MAX_CHARS = 180;

  $('.excerpt').each(function (i, e) {
    var origText = $(this).text();
    if (origText.length > MAX_CHARS) {

      var cut = cutKeepingTags(this, 180);
      var elements = $(cut.text);
      // Add the elipses to the last child element in whatever tag its in.
      elements.find('*:last-child').last().text(`${elements.find('*:last-child').last().text()  }...`);

      $(this).text('')
        .append(elements);

    }
  });

  function cutKeepingTags (elem, reqCount) {
    var grabText = '',
      missCount = reqCount;
    $(elem).contents().each(function () {
      switch (this.nodeType) {
          case Node.TEXT_NODE:
          // Get node text, limited to missCount.
            grabText += this.data.substr(0, missCount);
            missCount -= Math.min(this.data.length, missCount);
            break;
          case Node.ELEMENT_NODE:
          // Explore current child:
            var childPart = cutKeepingTags(this, missCount);
            grabText += childPart.text;
            missCount -= childPart.count;
            break;
      }
      if (missCount == 0) {
        // We got text enough, stop looping.
        return false;
      }
    });
    return {
      text:
        // Wrap text using current elem tag.
        `${elem.outerHTML.match(/^<[^>]+>/m)[0]
        + grabText
         }</${  elem.localName  }>`,
      count: reqCount - missCount,
    };
  }
};;


/*= ===========================================================================
  Drawer modules
  - Docs http://shopify.github.io/timber/#drawers
==============================================================================*/
ira.Drawers = (function () {
  var Drawer = function (id, position, options) {
    var defaults = {
      close: '.js-drawer-close',
      open: `.js-drawer-open-${  id}`,
      openClass: 'js-drawer-open',
      dirOpenClass: `js-drawer-open-${  id}`,
    };

    this.$nodes = {
      parent: $('body, html'),
      page: $('#PageContainer'),
      moved: $('.is-moved-by-drawer'),
      headerControl: $(`${'.header-control' + '.'}${defaults.dirOpenClass}`),
      background: $('.drawer__background'),
      content: $(`#${  id  } .drawer__content`),
    };

    this.config = $.extend(defaults, options);
    this.position = position;
    this.id = id;

    this.$drawer = $(`#${  id}`);

    if (!this.$drawer.length) {
      return false;
    }

    this.drawerIsOpen = ira.cache.$body.hasClass('js-drawer-open-NavDrawer');
    this.init();
  };

  Drawer.prototype.init = function () {
    $(this.config.open).on('click', $.proxy(this.open, this));
    this.$drawer.find(this.config.close).on('click', $.proxy(this.close, this));

    // Close on click - Make it so clicking anywhere outside of the drawer closes them
    // this.$nodes.background.add(this.$nodes.content).on('click',
    this.$drawer.on('click',
      function (e) {
        e.stopPropagation();
      });

    this.$nodes.parent.on('click', function (e) {
      ira.NavDrawer.close();
      ira.CartDrawer.close();
    });

  };

  Drawer.prototype.open = function (evt) {
    // Keep track if drawer was opened from a click, or called by another function
    var externalCall = false;

    // Prevent following href if link is clicked
    if (evt) {
      evt.preventDefault();
    } else {
      externalCall = true;
    }

    $(`.js-drawer-open-${  this.id}`).closest('.header-control').addClass('active');

    // ira.carousels.forEach(function(carousel) {
    //   carousel.pause();
    // });

    // Without this, the drawer opens, the click event bubbles up to $nodes.page
    // which closes the drawer.
    if (evt && evt.stopPropagation) {
      evt.stopPropagation();
      // save the source of the click, we'll focus to this on close
      this.$activeSource = $(evt.currentTarget);
    }

    if (this.drawerIsOpen && !externalCall) {
      return this.close();
    }

    if (this.otherDrawersOpen()) {
      this.otherDrawer().close();
    }

    this.scrollPositionOnOpen = $(window).scrollTop();

    // Add is-transitioning class to moved elements on open so drawer can have
    // transition for close animation
    this.$nodes.moved.addClass('is-transitioning');
    this.$drawer.prepareTransition();

    this.$nodes.parent.addClass(`${this.config.openClass  } ${  this.config.dirOpenClass}`);
    this.drawerIsOpen = true;

    Drawer.prototype.trapFocus(this.$drawer, 'drawer_focus');

    // Run function when draw opens if set
    if (this.config.onDrawerOpen && typeof (this.config.onDrawerOpen) === 'function') {
      if (!externalCall) {
        this.config.onDrawerOpen();
      }
    }

    if (this.$activeSource && this.$activeSource.attr('aria-expanded')) {
      this.$activeSource.attr('aria-expanded', 'true');
    }

    this.$nodes.page.on('click.drawer', $.proxy(function () {
      this.close();
      return false;
    }, this));


  };

  Drawer.prototype.close = function (evt) {
    if (!this.drawerIsOpen) { // don't close a closed drawer
      return;
    }

    if ($(window).width() <= 840) {
      $(window).scrollTop(this.scrollPositionOnOpen);
    }

    // ira.carousels.forEach(function(carousel) {
    //   carousel.play();
    // });

    // deselect any focused form elements
    $(document.activeElement).trigger('blur');

    // Ensure closing transition is applied to moved elements, like the nav
    this.$nodes.moved.prepareTransition({disableExisting: true});
    this.$drawer.prepareTransition({disableExisting: true});

    this.$nodes.parent.removeClass(`${this.config.dirOpenClass  } ${  this.config.openClass}`);

    this.drawerIsOpen = false;

    Drawer.prototype.removeTrapFocus(this.$drawer, 'drawer_focus');

    this.$nodes.page.off('.drawer');
    this.$nodes.headerControl.removeClass('active');
  };


  Drawer.prototype.trapFocus = function ($container, eventNamespace) {
    var eventName = eventNamespace ? `focusin.${  eventNamespace}` : 'focusin';

    $container.attr('tabindex', '-1');

    $container.focus();

    $(document).on(eventName, function (evt) {
      if ($container[0] !== evt.target && !$container.has(evt.target).length) {
        $container.focus();
      }
    });
  };

  Drawer.prototype.removeTrapFocus = function ($container, eventNamespace) {
    var eventName = eventNamespace ? `focusin.${  eventNamespace}` : 'focusin';

    $container.removeAttr('tabindex');
    $(document).off(eventName);
  };

  /**
   * This function assumes that there are only two drawers.  It returns the other drawer.
   * @return Drawer
   */
  Drawer.prototype.otherDrawer = function () {
    var output;
    ira.allDrawers.forEach(function (e) {
      if (e.id !== this.id) {
        output = e;
      }
    }.bind(this));
    return output;
  };;

  Drawer.prototype.otherDrawersOpen = function () {
    for (var i = 0; i < ira.allDrawers.length; i++) {
      var e = ira.allDrawers[i];
      if (e.drawerIsOpen && (e.id !== this.id)) {
        return true;
      }
    }
    return false;

  };;

  return Drawer;
})();

/*= ===========================================================================
  Carousel
==============================================================================*/
ira.carousels = [];

ira.Carousel = (function () {

  var Carousel = function (config) {
    var defaults = {
      slideTimeout: 10000, // Should this be a setting?
      enableKenBurns: false,
    };

    this.config = $.extend(defaults, config);
    this.slides = this.config.container.find('.carousel-slides');

    if (config.offsetNotificationBar) {
      this.config.container.addClass('offset-notification-bar');
    }

    this.config.enableKenBurns = (this.config.enableKenBurns == 'true');

    $(window).on('resize', this.setTextMaxHeight.bind(this));

    this.init();
  };

  Carousel.prototype.init = function () {
    this.slides.on('init', this.slideInit.bind(this));
    this.slides.on('afterChange', this.afterChange.bind(this));

    this.slides.slick({
      autoplay: true,
      dots: true,
      arrows: false,
      mobileFirst: true,
      respondTo: 'min',
      adaptiveHeight: false,
      autoplaySpeed: this.config.slideTimeout,
      pauseOnHover: false,
      draggable: false,
      fade: true,
      lazyload: 'progressive',
    });

    $(window).trigger('resize');
  };

  Carousel.prototype.pause = function () {
    this.slides.slick('pause');
  };

  Carousel.prototype.play = function () {
    this.slides.slick('play');
  };

  Carousel.prototype.goTo = function (index) {
    this.slides.slick('slickGoTo', index);
  };

  Carousel.prototype.slideInit = function (_, slick) {
    var currentSlideIndex = slick.slickCurrentSlide();

    this.slick = slick;
    this.slides.trigger('afterChange', [slick, currentSlideIndex]);

    this.getSlide(currentSlideIndex).addClass('visible');

    if (this.config.enableKenBurns) {
      this.getSlide(currentSlideIndex).addClass('ken-burns');
    }
  };

  Carousel.prototype.afterChange = function (_, slick, index) {
    var previousSlide = this.getSlide(index - 1);
    var currentSlide = this.getSlide(index);

    previousSlide.removeClass('visible');
    currentSlide.addClass('visible');

    if (this.config.enableKenBurns) {
      previousSlide.removeClass('ken-burns');
      currentSlide.addClass('ken-burns');
    }
  };

  Carousel.prototype.getSlide = function (index) {
    if (index < 0) {index = this.slick.$slides.length - 1;}
    return $(this.slick.$slides[index]);
  };

  Carousel.prototype.setTextMaxHeight = function () {
    var heights = this.slick.$slides.toArray().map(function (slide) {
      if ($(slide).find('.carousel-slide-text-inner').length) {
        return slide.querySelector('.carousel-slide-text-inner').clientHeight;
      }
    });

    var maxHeight = Math.max(...heights);;

    this.slick.$slides.each(function (_, slide) {
      if ($(slide).children('.carousel-slide-text').length) {
        $(slide).children('.carousel-slide-text').css('height', maxHeight);
      }
    });
  };

  return Carousel;
})();

$(bt.init);


history.navigationMode = 'compatible';


(function () {
  // IE8 fix to improve layout.
  $(document).ready(function () {
    if (!(navigator.appVersion.indexOf('MSIE 8') > 0)) {
      return;
    }

    if ($(window).width() > 841) {
      $('.large--one-third').css('width', '33.33%');
    }

    $('.site-header .large--one-third').css('width', '33.33%');
    $('.controls-container').css('width', '100%');

  });
})();;

$(document)
  .on('shopify:section:load', function (event) {
    var section = $(event.target);
    var type = section.attr('class').replace('shopify-section', '').trim();

    ira.initScrollTriggers();

    switch (type) {
        case 'header':
      case 'collection-pages':
          ira.headerInit(type == 'collection-pages');
          ira.drawersInit();
          ira.mobileNavToggle();

          if ($('#notification-bar').length > 0) {
            ira.cache.$body.addClass('respond-to-notification-bar');
            $('#HeaderSearchBar').addClass('offset-by-notification-bar');
          } else {
            ira.cache.$body.removeClass('respond-to-notification-bar');
            $('#HeaderSearchBar').removeClass('offset-by-notification-bar');
          }

        $(window).trigger('scroll');
        break;
      case 'carousel':
          ira.carousels = [];
          var carousel = section.children('.carousel-container');

          ira.carousels.push(new ira.Carousel({
            container: carousel,
            enableKenBurns: carousel.attr('data-ken-burns'),
            slideTimeout: carousel.attr('data-slide-timeout'),
          }));
          break;
        case 'product-pages':
          // ira.productImageSwitch();
          // ira.productSidebar();
          // new ProductPage();
          break;
    }
  })
  .on('shopify:section:select', function (event) {
    var section = $(event.target);
    var type = section.attr('class').replace('shopify-section', '').trim();

    switch (type) {
      case 'popup':
        $('.exit-intent-overlay').addClass('show');
          break;
    }
  })
  .on('shopify:section:deselect', function (event) {
    var section = $(event.target);
    var type = section.attr('class').replace('shopify-section', '').trim();

    switch (type) {
        case 'popup':
          $('.exit-intent-overlay').removeClass('show');
          break;
    }
  })
  .on('shopify:block:select', function (event) {
    var section = $(event.target);
    var type = section.closest('.shopify-section').attr('class').replace('shopify-section', '')
.trim();

    switch (type) {
        case 'carousel':
          var slide = $(event.target);

          ira.carousels.forEach(function (carousel) {
            carousel.pause();
            carousel.goTo(slide.attr('data-slick-index'));
          });
          break;
    }
  })
  .on('shopify:block:deselect', function (event) {
    var id = event.originalEvent.detail.sectionId;
    var slide = $(event.target);

    ira.carousels.forEach(function (carousel) {
      carousel.play();
    });
  });
