import $ from 'jquery';
import parallax from '../util/parallax';

var collection = {
    el: {},
    init: function() {
        collection.cacheSelectors();
        collection.changeView();

        $('.collection-filtering').on('change', 'select', collection.filter);
        $('.collection-filters')
            .children()
            .each(collection.pad);
        $('.collection-sort').on('change', 'select', collection.sort);
        $('.supports-touch .product_image_caption').each(
            collection.adjustHeadings
        );

        $('.single-item').slick({
            dots: false,
            arrows: false,
            mobileFirst: true,
            respondTo: 'min',
            adaptiveHeight: true,
            pauseOnHover: false,
            draggable: true,
            lazyload: 'progressive',
        }).init(function () {
            var imagePosition = '0';
            $('.slick-dots').addClass('large--hide');
            if (imagePosition) {
                $('.single-item').slick('slickGoTo', imagePosition, false);
            }
        });
        $('.single-item').on('beforeChange', function (event, slick, currentSlide, nextSlide) {
            collection.slackChangeItem(event, slick, currentSlide, nextSlide);
        });

        parallax.init('.parallax-container #shopify-section-collection-template .section-header');
    },
    slackChangeItem: function (event, slick, currentSlide, nextSlide) {
        var productId = event.target.getAttribute('productId');
        var title = document.getElementById('title-' + productId).getAttribute('title' + (nextSlide + 1));
        if (title !== 'Default Title') {
          $('#title-' + productId).text(title);
        }

        var isAvailable = document.getElementById('soldout-' + productId).getAttribute('soldout' + (nextSlide + 1));
        if (isAvailable === "false") {
            $('#soldout-' + productId).show();
        } else {
            $('#soldout-' + productId).hide();
        }

        $('.price-' + productId).hide();
        $('#price-' + productId + '-' + (nextSlide + 1)).show();

        var link = document.getElementById('link-' + productId).getAttribute('link' + (nextSlide + 1));
        $('#link-' + productId).attr('href', link);
    },
    cacheSelectors: function() {
        collection.el.$changeView = $('.change-view');
        collection.el.$collectionFilter = $('collection-filtering');
        collection.el.$collectionSort = $('collection-sort');
        collection.changeView();
        collection.adjustHeadings();
    },
    editorReload: function(event) {
        var $section = $(event.target);
        var type = $section
            .attr('class')
            .replace('shopify-section', '')
            .trim();

        if (type === 'collection-pages') {
            collection.init();
        }
    },
    pad: function(i, el) {
        var $el = $(el);
        var width = $el.find('.collection-filters-title').width();

        $el.find('select').css({
            'padding-left': width + 20
        });
    },
    filter: function(event) {
        var $target = $(event.currentTarget);
        var value = $target.val();
        var collection = `/collections/${$target.data('collection-handle')}/`;

        location = collection + value;
    },
    sort: function(event) {
        var $target = $(event.currentTarget);
        var Sorting = {};
        Sorting.sort_by = $target.val();

        if ($target.closest('.collection-sort').hasClass('vendor-page')) {
            var currentSearch = location.search;
            var searchParts = currentSearch.split('&');

            $.each(searchParts, function(index, part) {
                if (part.indexOf('sort_by') !== -1) {
                    searchParts.splice(index, 1);
                }
            });

            var search = searchParts.join('&');
            location.search = `${search}&${$.param(Sorting)}`;
        } else {
            location.search = $.param(Sorting);
        }
    },
    changeView: function() {
        if (collection.el.$changeView.length) {
            collection.el.$changeView.on('click', function() {
                var view = $(this).data('view');
                var url = document.URL;
                var hasParams = url.indexOf('?') > -1;

                if (hasParams) {
                    window.location = replaceUrlParam(url, 'view', view);
                } else {
                    window.location = `${url}?view=${view}`;
                }
            });
        }
    },
    adjustHeadings: function() {
        $('.supports-touch .product_image_caption').each(function(i, el) {
            var $e = $(el);
            var textLength = $e.find('.h2').text().length;
            var fontSize = 16;

            /* eslint-disable */
            switch (true) {
                case textLength < 50:
                    fontSize = 16;
                    break;
                case textLength < 100:
                    fontSize = 15;
                    break;
                case textLength < 150:
                    fontSize = 14;
                    break;
                case textLength < 200:
                    fontSize = 13;
                    break;
                case textLength >= 200:
                    fontSize = 12;
                    break;
                default:
                    fontSize = 16;
                    break;
            }
            /* eslint-enable */
            $e.css('font-size', fontSize);
        });
    }
};


$(collection.init);