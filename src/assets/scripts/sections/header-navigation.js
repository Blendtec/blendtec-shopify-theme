import _ from 'lodash';
import Drawers from '../util/drawer';
import DeviceType from '../util/device-type.enum'
import Platform from '../util/platform';

var navigation = {
    el: {},
    navigationStyle: null,
    navWidth: 0,
    NavDrawer: null,
    options: null,
    cacheSelectors: () => {
        navigation.el.$window = $(window);
        navigation.el.$logo = $('.site-header__logo');
        navigation.el.$header = $('.site-header');
        navigation.el.$hasDropdown = $('.has-dropdown');
        navigation.el.$dropdown = $('.dropdown.catalog-menu');
        navigation.el.$mainNav= $('.main-navigation');
        navigation.el.$mainNavItems= $('.main-navigation li');
        navigation.el.$openNavDrawer= $('.js-drawer-open-NavDrawer');
        navigation.el.$accountIcon = $('.js-account-icon');
    },
    init: options => {
        navigation.options = options;
        navigation.cacheSelectors();
        navigation.NavDrawer = new Drawers('NavDrawer', 'right');

        navigation.el.$window.on('resize', navigation.handleResize);
        navigation.el.$hasDropdown.on('mouseenter mouseleave', navigation.handleMouseEnterLeave);

        if (options.navigationInline) {
            navigation.navigationStyle = DeviceType.DESKTOP;
            if (navigation.el.$header.imagesLoaded) {
                navigation.el.$header.imagesLoaded(() => {
                    navigation.setNavStyle(navigation.whichNav());
                });
            }

            if (Platform.viewPortWidth() > 840) {
                navigation.navWidth = navigation.getNavWidth();
            }
        }

        if (navigation.el.$dropdown.length) {
            header.initCatalogMenu();
        }
    },
    initCatalogMenu: () => {
        var triggers = menu.find('ul li');
        var images = menu.find('.catalog-menu-collection-image');

        triggers.on('mouseenter', (event) => {
            var index = $(event.target).attr('data-index');
            images.filter('[data-index=' + index + ']').addClass('visible');
        });

        triggers.on('mouseleave', () => {
            images.removeClass('visible');
        });
    },
    setNavStyle: type => {
        if (type === DeviceType.MOBILE) {
            navigation.el.$openNavDrawer.css('display', 'inline-block');
            navigation.el.$accountIcon.css('display', 'none');
            navigation.el.$mainNav
                .hide()
                .removeClass('nav-loading');
        } else {
            navigation.el.$openNavDrawer.css('display', 'none');
            navigation.el.$accountIcon.css('display', 'inline-block');
            navigation.el.$mainNav
                .css({ left: '17%' })
                .show()
                .removeClass('nav-loading');
        }
    },
    whichNav: () => {
        var windowWidth = Math.ceil(navigation.el.$window.width()) * (3 / 4);
        var logoWidth = Math.ceil(navigation.el.$logo.outerWidth(true));
        var availableWidth = windowWidth - logoWidth;

        if (availableWidth - 15 < navigation.getNavWidth()) {
            return DeviceType.MOBILE;
        } else {
            return DeviceType.DESKTOP;
        }
    },
    getNavWidth: () => {
        var navWidth = 20;

        navigation.el.$mainNavItems.each((i, el) => {
            navWidth += Math.ceil($(el).outerWidth(true));
        });

        return navWidth;
    },
    handleResize: _.debounce(() => {
        if (navigation.options.navigationInline) {
            if (navigation.navigationStyle === DeviceType.DESKTOP) {
                navigation.setNavStyle(navigation.whichNav());
            } else if (
                navigation.navigationStyle === DeviceType.MOBILE &&
                Math.ceil(navigation.el.$window.width()) * (3 / 4) >
                    Math.ceil(navigation.el.$logo.outerWidth(true) + 1) +
                        navigation.navWidth +
                        15
            ) {
                navigation.navigationStyle = DeviceType.DESKTOP;
                navigation.setNavStyle(DeviceType.DESKTOP);
            }
        }
    }, 100),
    handleMouseEnterLeave: event => {
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
    }
};

export default navigation;
