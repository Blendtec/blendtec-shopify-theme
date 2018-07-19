import $ from 'jquery';
import Platform from '../util/platform';
import initScrollTriggers from '../util/scroll-triggers';
import autoFitImages from '../util/autofit-images';
import randomImages from '../util/random-images';
import accesibleNav from '../util/accessible-nav';
import truncator from '../util/truncator';
import responsiveVideos from '../util/responsive-videos';

import '../../styles/app.scss';

var page = {
    el: {},
    windowHeight: 0,
    windowWidth: 0,
    init: () => {
        randomImages.init();
        autoFitImages.init();
        page.cacheSelectors();
        page.el.$document.on('bt:header:init', accesibleNav.init);
        page.el.$window.on('resize', page.windowResizeHandler);
        if (Platform.isIOS() === true) {
            page.el.$body.addClass('ios');
        } else {
            initScrollTriggers();
        }

        if (Platform.isOldIE()) {
            page.ie8Resize();
        }

        // TODO - move this server side
        truncator.truncate(180, page.el.$excerpts);
        responsiveVideos.init();
        page.el.$document.trigger('bt:ready');
        page.el.$body.addClass('ready');
        page.mobileNavToggle();
        page.cookieController();
    },
    cacheSelectors: () => {
        page.el.$window = $(window);
        page.el.$document = $(document);
        page.el.$body = $(document.body);
        page.el.$excerpts = $('.excerpt');
        page.el.$navSubList = $('.mobile-nav__has-sublist');
        page.windowHeight = page.el.$window.height();
        page.windowWidth = page.el.$window.width();
        page.el.$cookieWrapper = $('.cookie-wrapper');
        page.el.$cookieButton = $('.cookie-button');
    },
    windowResizeHandler: () => {
        var width = page.el.$window.width();
        var height = page.el.$window.height();
        if (page.windowWidth != width) {
            page.el.$window.trigger('widthChange');
            page.windowWidth = width;
        }
        if (page.windowHeight != height) {
            page.el.$window.trigger('heightChange');
            page.windowHeight = height;
        }
    },
    cookieController: () => {
        if (!$.cookie('acceptCookies')) {
            page.el.$cookieWrapper.show();
              page.el.$cookieWrapper.animate({
                bottom: '0px',
              }, 500, function() {
              });

              page.el.$cookieButton.on('click', function() {
                  page.el.$cookieWrapper.animate({
                    bottom: '-200px',
                  }, 100, function() {
                    page.el.$cookieWrapper.hide();
                    $.cookie("acceptCookies", 1, {expires: 14});
                  });
              });
        }
    },
    ie8Resize: () => {
        if (page.el.$window.width() > 841) {
            $('.large--one-third').css('width', '33.33%');
        }

        $('.site-header .large--one-third').css('width', '33.33%');
        $('.controls-container').css('width', '100%');
    },
    mobileNavToggle: () => {
        page.el.$navSubList.on('click', function() {
            $(this).toggleClass('mobile-nav--expanded');
            $(this)
                .find('button > .icon')
                .toggleClass('fade-in fade-and-flip');
        });
    }
};

$(document).ready(page.init);
