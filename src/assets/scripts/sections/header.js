import $ from 'jquery';
import _ from 'lodash';
import converter from '../util/currency-converter';
import Platform from '../util/platform';
import Drawers from '../util/drawer';

var header = {
    el: {},
    navigationStyle: null,
    navWidth: 0,
    navDrawer: null,
    cartDrawer: null,
    allDrawers: [],
    cacheSelectors: function() {
        header.el.$document = $(document);
        header.el.$body = $(document.body);
        header.el.$notificationBar = $('#notification-bar');
        header.el.$header = $('.site-header');
        header.el.$html = $('html');
        header.el.$searchBar = $('#HeaderSearchBar');
        header.el.$headerControls = $('.site-header-controls');
    },
    init: function(ignoreNav) {
        this.cacheSelectors();
        header.NavDrawer = new Drawers('NavDrawer', 'right');
        header.CartDrawer = new Drawers('CartDrawer', 'right', {
            onDrawerOpen: () => { $(document).trigger('cart:load');}
        });
        header.el.$body.on('ajaxCart.afterCartLoad', () => { header.CartDrawer.open(); });
        header.stickyHeader({
            stickyHeaderEnabled:
                header.el.$header.attr('data-sticky-header') == 'true',
            notificationBarEnabled:
                header.el.$header.attr('data-notification-bar') == 'true'
        });

        header.transparentHeader({
            transparentHeaderEnabled:
                header.el.$header.attr('data-transparent-header') == 'true' ||
                $('.parallax-container')
                    .children()
                    .first()
                    .hasClass('carousel'),
            stickyHeaderEnabled:
                header.el.$header.attr('data-sticky-header') == 'true'
        });

        if (!ignoreNav) {
            header.setupNavigation({
                navigationInline:
                    header.el.$header.attr('data-inline-navigation') == 'true'
            });
        }

        header.searchInit({
            transparentHeaderEnabled:
                header.el.$header.attr('data-transparent-header') == 'true',
            stickyHeaderEnabled:
                header.el.$header.attr('data-sticky-header') == 'true'
        });

        if (header.el.$header.attr('data-currency-converter') == 'true') {
            setTimeout(converter.init(), 50);
        }

        var catalogMenu = $('.dropdown.catalog-menu');
        if (catalogMenu.length) {
            header.initCatalogMenu(catalogMenu);
        }

        if (header.el.$notificationBar.length > 0) {
            header.el.$body.addClass('respond-to-notification-bar');
        }

        header.el.$document.trigger('bt:header:init');
    },
    stickyHeader: function(options) {
        var CLASS_NAME = 'sticky-header';
        var stickyHeaderEnabled = options.stickyHeaderEnabled;
        var notificationBarEnabled = options.notificationBarEnabled;

        if (
            window.location.pathname.indexOf('products') !== -1 &&
            header.el.$html.hasClass('supports-touch')
        ) {
            // We don't want sticky header on the product page for mobile
            return $('.' + CLASS_NAME).removeClass(CLASS_NAME);
        }

        if (stickyHeaderEnabled) {
            var $searchBar = header.el.$searchBar;
            var $header = header.el.$header.add($searchBar);

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
            function notificationBarOffset() {
                var sheet = document.getElementById('js-notificationBarStyle');
                if (!sheet) {
                    sheet = document.createElement('style');
                    sheet.id = 'js-notificationBarStyle';
                }

                if (navigator.appVersion.indexOf('MSIE 8') > 0) {
                    // thanks ie8 for making the internet a better place
                    var ie8Styles = document.createElement('style');
                    document
                        .getElementsByTagName('head')[0]
                        .appendChild(ie8Styles);
                    ie8Styles.setAttribute('type', 'text/css');
                    ie8Styles.styleSheet.cssText =
                        '.offset-by-notification-bar {top: ' +
                        header.el.$notificationBar.height() +
                        'px}';
                } else {
                    sheet.innerHTML =
                        '.offset-by-notification-bar {top: ' +
                        header.el.$notificationBar.height() +
                        'px} @media (max-width: 839px) { :not(.js-drawer-open) .sm-offset-by-notification-bar {top: ' +
                        header.el.$notificationBar.height() +
                        'px}}';
                }

                document.body.appendChild(sheet);
            }

            var detachHeader = function() {
                if (header.el.$body.hasClass('js-drawer-open')) {
                    return;
                }
                var top = window.pageYOffset
                    ? window.pageYOffset
                    : document.documentElement.scrollTop
                        ? document.documentElement.scrollTop
                        : document.body.scrollTop;
                if (top <= controlsHeight) {
                    header.el.$headerControls.removeClass('medium-down--fixed');
                    header.el.$searchBar.removeClass('medium-down--fixed');
                    header.el.$body.removeClass('js-header-attached');

                    $(window).off('scroll', detachHeader);
                    $(window).on('scroll', attachAndCondenseHeader);
                }
            };

            var attachAndCondenseHeader = function() {
                if (header.el.$body.hasClass('js-drawer-open')) {
                    return;
                }
                var top = window.pageYOffset
                    ? window.pageYOffset
                    : document.documentElement.scrollTop
                        ? document.documentElement.scrollTop
                        : document.body.scrollTop;
                var controlsOffset = headerControls.position().top;

                // Add the && !() so it doesn't always re-register on scroll
                if (
                    top >= controlsHeight &&
                    !header.el.$headerControls.hasClass('medium-down--fixed')
                ) {
                    header.el.$headerControls.addClass('medium-down--fixed');
                    header.el.$searchBar.addClass('medium-down--fixed');
                    header.el.$body.addClass('js-header-attached');

                    if (
                        $(window).width() <= 840 &&
                        header.el.$searchBar.offset().top <
                            header.el.$headerControls.offset().top
                    ) {
                        header.el.$searchBar.css(
                            'top',
                            header.el.$header.height() + 1
                        );
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
    },
    transparentHeader: function(options) {
        var transparentHeaderEnabled = options.transparentHeaderEnabled;
        var stickyHeaderEnabled = options.stickyHeaderEnabled;
        var className = 'transparent-header';

        // Transparent header is only active on the homepage and collections pages with images.
        var onHomePage = window.location.pathname === '/';
        var onCollectionPage =
            window.location.pathname.split('/')[1] === 'collections';
        var onImageCollectionPage =
            onCollectionPage && $('.section-header--image').length;
        transparentHeaderEnabled = onHomePage || onImageCollectionPage;
        if (!onHomePage && !onImageCollectionPage) {
            $('.' + className).removeClass(className);
        }

        // Important to call this /after/ the classname has been removed.
        this.adjustContentOffset(options);

        var hasScrolled = false;
        var headerControlsHeight = header.el.$headerControls.height();
        var fadeInClassName = '.js-transparent-header-fadein:first';
        var carouselContainer = $(
            '.main-content .shopify-section.carousel:first-child, .main-content .shopify-section.video-player:first-child, .collection-pages .section-header'
        ).first();
        var animating = false;

        // As of this writing, that class is only apparent in index.
        // And we only want parallax on the index page.
        if ($(fadeInClassName).length === 0) {
            return;
        }

        if (transparentHeaderEnabled) {
            header.el.$body.addClass('respond-to-transparent-header');
        }

        if (transparentHeaderEnabled && stickyHeaderEnabled) {
            $(window).on('scroll', scrollAnimationLoop);
        }

        function scrollAnimationLoop() {
            if (!animating) {
                drawScroll();
                requestAnimationFrame(scrollAnimationLoop);
                animating = true;
            }
        }

        function drawScroll() {
            fadeInTransparentHeader();
            fadeOutHandler();
            animating = false;
        }

        function fadeInTransparentHeader() {
            var top = window.pageXOffset
                ? window.pageXOffset
                : document.documentElement.scrollTop
                    ? document.documentElement.scrollTop
                    : document.body.scrollTop;
            // storygridstart changes on resize events and such, so we should recalculate it each time
            // var storyGridStart = $(fadeInClassName).position().top;
            var offset = headerControlsHeight;

            if (carouselContainer.length) {
                offset = carouselContainer.height() - headerControlsHeight;
            }

            // we're at the smaller breakpoint so we need to push the offset up higher,
            // as we now have the carousel-text as a distinct element
            if (
                header.el.$headerControls.css('position') == 'fixed' &&
                Boolean(carouselContainer.length)
            ) {
                offset -= parseInt(
                    carouselContainer.css('padding-bottom').replace('px', ''),
                    10
                );
            }

            if (top >= offset) {
                // manually toggle transition time, since we want it to be set to 0
                // when the user opens the menu, but not on the scroll condition
                header.el.$headerControls.css('transition', '0.3s');
                header.el.$header.removeClass(className);

                $(window).on('scroll', fadeOutHandler);
                $(window).off('scroll', fadeInTransparentHeader);
            }
        }

        function fadeOutHandler() {
            var top = window.pageXOffset
                ? window.pageXOffset
                : document.documentElement.scrollTop
                    ? document.documentElement.scrollTop
                    : document.body.scrollTop;
            // storygridstart changes on resize events and such, so we should recalculate it each time
            // var storyGridStart = $(fadeInClassName).position().top;
            var offset = headerControlsHeight;

            if (carouselContainer.length) {
                offset = carouselContainer.height() - headerControlsHeight;
            }

            if (
                header.el.$headerControls.css('position') == 'fixed' &&
                Boolean(carouselContainer.length)
            ) {
                offset -= parseInt(
                    carouselContainer.css('padding-bottom').replace('px', ''),
                    10
                );
            }

            if (top <= offset) {
                if (header.el.$header.is('[data-transparent-header="true"]')) {
                    header.el.$header.addClass(className);
                }

                // set the transition time back to default now that the animation is over
                setTimeout(function() {
                    header.el.$headerControls.css('transition', '0s');
                }, 600);

                $(window).on('scroll', fadeInTransparentHeader);
                $(window).off('scroll', fadeOutHandler);
            }
        }
    },
    setupNavigation: function(options) {
        var debouncedPrepare = _.debounce(function() {
            if (options.navigationInline) {
                if (header.navigationStyle === 'desktop') {
                    header.setNavStyle(header.whichNav());
                } else if (
                    header.navigationStyle === 'mobile' &&
                    Math.ceil($(window).width()) * (3 / 4) >
                        Math.ceil(
                            $('.site-header__logo').outerWidth(true) + 1
                        ) +
                            header.navWidth +
                            15
                ) {
                    header.navigationStyle = 'desktop';
                    header.setNavStyle('desktop');
                }
            }
        }, 100);

        $(window).on('resize', debouncedPrepare);

        $('.has-dropdown').on('mouseenter mouseleave', function(event) {
            var target = $(event.target);
            var container = target.hasClass('has-dropdown')
                ? target
                : target.closest('.has-dropdown');
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
            header.navigationStyle = 'desktop';
            if ($('.site-header').imagesLoaded) {
                $('.site-header').imagesLoaded(function() {
                    header.setNavStyle(header.whichNav());
                });
            }

            if ($(window).width() > 840) {
                header.navWidth = header.getNavWidth();
            }
        }
    },
    setNavStyle: function(type) {
        if (type === 'mobile') {
            $('.js-drawer-open-NavDrawer').css('display', 'inline-block');
            $('.js-account-icon').css('display', 'none');
            $('.main-navigation')
                .hide()
                .removeClass('nav-loading');
        } else {
            $('.js-drawer-open-NavDrawer').css('display', 'none');
            $('.js-account-icon').css('display', 'inline-block');
            $('.main-navigation')
                .css({ left: '17%' })
                .show()
                .removeClass('nav-loading');
        }
    },
    whichNav: function() {
        var windowWidth = Math.ceil($(window).width()) * (3 / 4);
        var logoWidth = Math.ceil($('.site-header__logo').outerWidth(true));
        var availableWidth = windowWidth - logoWidth;

        if (availableWidth - 15 < header.getNavWidth()) {
            return 'mobile';
        } else {
            return 'desktop';
        }
    },
    getNavWidth: function() {
        var navWidth = 20;

        $('.main-navigation li').each(function(i, el) {
            navWidth += Math.ceil($(el).outerWidth(true));
        });

        return navWidth;
    },
    searchInit: function(options) {
        var config = {
            openClassSelector: '.search-open',
            closeClassSelector: '.search-close',
            searchBarSelector: '#HeaderSearchBar',
            searchInputSelector: '#searchBarInput',
            jsClassOpen: 'js-search-open'
        };

        var transparentHeaderEnabled = options.transparentHeaderEnabled;

        var $nodes = {
            open: $(config.openClassSelector),
            close: $(config.closeClassSelector),
            searchBar: $(config.searchBarSelector),
            input: $(config.searchInputSelector)
        };

        // Only have elements be tab-able when search is open
        $nodes.close.add($nodes.input).attr('tabindex', -1);

        function drawerOpenHandler(e) {
            $(document).trigger('drawer:open', ['Searchbar']);
            $nodes.searchBar.revealer('show');
            $nodes.close.add($nodes.input).attr('tabindex', 0);

            if (
                !(
                    (Platform.isIOS() && options.stickyHeaderEnabled) ||
                    Platform.isOldIE()
                )
            ) {
                $nodes.input[0].select();
            }

            header.el.$header.add(header.el.$html).addClass(config.jsClassOpen);
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        function drawerCloseHandler(e) {
            if (
                typeof e !== 'undefined' &&
                typeof e.preventDefault === 'function'
            ) {
                e.preventDefault();
            }
            $nodes.searchBar.revealer('hide');
            header.el.$header
                .add(header.el.$html)
                .removeClass(config.jsClassOpen);

            $nodes.close.add($nodes.input).attr('tabindex', 0);
        }

        function keyboardHandlers() {
            // Close the menu when the escape key is pressed.
            window.onkeydown = function(event) {
                if (event.keyCode === 27) {
                    drawerCloseHandler();
                }

                // alt+f brings up search
                if (event.keyCode === 70 && event.altKey) {
                    event.preventDefault();
                    drawerOpenHandler();
                }
            };
        }

        function closeOnOutsideClick(e) {
            // Only close if the user clicks outside of searchbox.
            // Also included header, otherwise it pre-emptively closes before opening.
            if (
                $('html').hasClass('js-search-open') &&
                $(e.target).closest($nodes.searchBar).length === 0 &&
                $(e.target).closest(header.el.$header).length === 0
            ) {
                drawerCloseHandler();
            }
        }

        function killEvent(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        // IE8 doesn't play nicely with some of our layout voodoo,
        // so when they click search just follow the href to search page.
        if (!Platform.isOldIE()) {
            $($nodes.open[0]).on('click', drawerOpenHandler);
            $($nodes.close[0]).on('click', drawerCloseHandler);
            $($nodes.searchBar[0]).on('click', killEvent);
            $(document).on('click', closeOnOutsideClick);
            keyboardHandlers();
        }
    },
    initCatalogMenu: function() {
        var triggers = menu.find('ul li');
        var images = menu.find('.catalog-menu-collection-image');

        triggers.on('mouseenter', function(event) {
            var index = $(event.target).attr('data-index');
            images.filter('[data-index=' + index + ']').addClass('visible');
        });

        triggers.on('mouseleave', function() {
            images.removeClass('visible');
        });
    },
    adjustContentOffset: function(options) {
        // Both transparent header and parallax are only for index page
        var transparentHeaderEnabled = options.transparentHeaderEnabled;
        var transparentHeaderEnabled =
            transparentHeaderEnabled && window.location.pathname === '/';
        var parallaxEnabled = window.location.pathname === '/';
        var stickyHeaderEnabled = options.stickyHeaderEnabled;

        function adjust() {
            var paddingTopDistance = 0;
            var headerSizeDistance = 0;
            // On medium breakpoint the header stacks but the height doesn't double.
            // So we have to manually add to the height.

            $('#notification-bar').each(function(i, e) {
                var height = $(e).height();
                paddingTopDistance += height;
                headerSizeDistance += height;
            });

            // IE8 always breaks the header into two rows
            if (
                $(window).width() <= 840 ||
                navigator.appVersion.indexOf('MSIE 8') > 1
            ) {
                headerSizeDistance += 80;
                if (!transparentHeaderEnabled) {
                    paddingTopDistance += 80;
                }
            }

            $('.site-header').each(function(i, e) {
                var height = $(e).height();
                headerSizeDistance += height;

                if (!transparentHeaderEnabled) {
                    paddingTopDistance += height;
                }
            });

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

            return paddingTopDistance;
        }

        if (!this.hasSetContentAdjustOnResize) {
            this.hasSetContentAdjustOnResize = true;
            $(window).resize(adjust);
        }

        return adjust();
    },
    otherDrawer: function() {
        var output;
        header.allDrawers.forEach(
            function(e) {
                if (e.id !== this.id) {
                    output = e;
                }
            }.bind(this)
        );
        return output;
    },
    otherDrawersOpen: function() {
        for (var i = 0; i < ira.allDrawers.length; i++) {
            var e = ira.allDrawers[i];
            if (e.drawerIsOpen && e.id !== this.id) {
                return true;
            }
        }
        return false;
    }
};

export default header;
