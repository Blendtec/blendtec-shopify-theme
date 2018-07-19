import $ from 'jquery';

var cookieNotification = {
    el: {},
    init: () => {
        cookieNotification.cacheSelectors();
        cookieNotification.showCookieBanner();
        cookieNotification.hideCookieBanner();
    },
    cacheSelectors: () => {
        cookieNotification.el.$cookieWrapper = $('.cookie-wrapper');
        cookieNotification.el.$cookieButton = $('.cookie-button');
    },
    showCookieBanner: () => {
        cookieNotification.el.$cookieWrapper.show();
          cookieNotification.el.$cookieWrapper.animate({
            bottom: '0px',
          }, 500, function() {
        });
    },
    hideCookieBanner: () => {
        cookieNotification.el.$cookieButton.on('click', () => {
          cookieNotification.el.$cookieWrapper.animate({
            bottom: '-200px',
          }, 100, () => {
            cookieNotification.el.$cookieWrapper.hide();
            $.cookie("acceptCookies", 1, {expires: 14});
          });
        });
    }
};


export default cookieNotification;
