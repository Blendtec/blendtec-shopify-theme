import $ from 'jquery';

class Platform {
    static isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.platform);
    } 
 
    static isAndroid() {
        return /Android/i.test(navigator.userAgent);
    }

    static isOldIE() {
        return navigator.appVersion.indexOf('MSIE 8') > 0;
    }

    static isTouchDevice() {
          return 'ontouchstart' in window || // works on most browsers
              'onmsgesturechange' in window; // works on ie10
    }

    static viewPortWidth() {
        return $(window).width();
    }
 }
 
 export default Platform;