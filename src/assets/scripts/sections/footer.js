import $ from 'jquery';

var footer = {
    el: {},
    init: function() {
        footer.cacheSelectors();
        footer.style();
    },
    style: function() {
        var $container = footer.el.$container;
        var $footer = footer.el.$footer;
        var containerHeight = footer.el.$container.outerHeight(true);
        var windowHeight = footer.el.$window.height();
        var fixed = $footer.hasClass('absolute');

        if (
            containerHeight <= windowHeight &&
            footer.el.containerHeight != containerHeight &&
            !fixed
        ) {
            var fh = $footer.outerHeight();

            $footer.addClass('hidden');

            $footer.addClass('absolute');
            $container.css({
                'padding-bottom': fh
            });
            $footer.removeClass('hidden');
        } else if (
            containerHeight > windowHeight &&
            footer.el.containerHeight != containerHeight &&
            fixed
        ) {
            $footer.addClass('hidden').removeClass('absolute');
            $container.css({
                'padding-bottom': 0
            });
            $footer.removeClass('hidden');
        }

        footer.el.containerHeight = containerHeight;
    },
    cacheSelectors: function() {
        footer.el.$window = $(window);
        footer.el.$footer = $('#shopify-section-footer');
        footer.el.$container = $('#PageContainer');
        footer.el.containerHeight = footer.el.$container.outerHeight(true);
    }
};

export default footer;