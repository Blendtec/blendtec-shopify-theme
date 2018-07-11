import $ from 'jquery';
import Platform from '../util/platform';
import events from '../util/events';

var search = {
    el: {},
    config: {
            openClassSelector: '.search-open',
            closeClassSelector: '.search-close',
            searchBarSelector: '#HeaderSearchBar',
            searchInputSelector: '#searchBarInput',
            jsClassOpen: 'js-search-open'
    },
    cacheSelectors: function() {
        search.el.$open = $('.search-open');
        search.el.$close= $('.search-close');
        search.el.$searchBar= $('#HeaderSearchBar');

        search.el.$input= $('#searchBarInput');
        search.el.$header = $('.site-header');
        search.el.$window = $(window);
        search.el.$html = $('html');
        search.el.$document= $(document);

    },
    init: function(options) {
        search.cacheSelectors();
        var transparentHeaderEnabled = options.transparentHeaderEnabled;

        var $nodes = {
            open: $(search.config.openClassSelector),
            close: $(search.config.closeClassSelector),
            searchBar: $(search.config.searchBarSelector),
            input: $(search.config.searchInputSelector)
        };

        // Only have elements be tab-able when search is open
        search.el.$close.add(search.el.$input).attr('tabindex', -1);

        if (!Platform.isOldIE()) {
            search.el.$open.on('click', search.drawerOpenHandler);
            search.el.$close.on('click', search.drawerCloseHandler.bind);
            search.el.$searchBar.on('click', events.kill);
            search.el.$document.on('click', search.closeOnOutsideClick);
            search.el.$window.on('keydown', search.keyboardHandlers); 
        }
    },
    drawerOpenHandler: function(e) {
        search.el.$document.trigger('drawer:open', ['Searchbar']);
        search.el.$searchBar.revealer('show');
        search.el.$close.add(search.el.$input).attr('tabindex', 0);

        if (
            !(
                (Platform.isIOS() && options.stickyHeaderEnabled) ||
                Platform.isOldIE()
            )
        ) {
            search.el.$input[0].select();
        }

        search.el.$header.add(search.el.$html).addClass(search.config.jsClassOpen);
        events.kill(e);
        return false;
    },
    drawerCloseHandler: function(e) {
        if (
            typeof e !== 'undefined' &&
            typeof e.preventDefault === 'function'
        ) {
            e.preventDefault();
        }
        search.el.$searchBar.revealer('hide');
        search.el.$header.add(search.el.$html).removeClass(search.config.jsClassOpen);

        search.el.$close.add(search.el.$input).attr('tabindex', 0);
    },
    keyboardHandlers: function(event) {
            if (event.keyCode === 27) {
                search.drawerCloseHandler();
            }

            // alt+f brings up search
            if (event.keyCode === 70 && event.altKey) {
                event.preventDefault();
                search.drawerOpenHandler();
            }
    },
    closeOnOutsideClick: function(e) {
        if (
            search.el.$html.hasClass('js-search-open') &&
            $(e.target).closest(search.el.$searchBar).length === 0 &&
            $(e.target).closest(search.el.$header).length === 0
        ) {
            search.drawerCloseHandler();
        }
    }
};
export default search;
