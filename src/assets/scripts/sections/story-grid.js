import $ from 'jquery';

var storyGrid = {
    el: {},
    init: function() {
        storyGrid.cacheSelectors();
        storyGrid.el.$featuredContent.each(function(i, el) {
            $(el).imagesLoaded(function() {
                $(el)
                    .find('.grid--story__image')
                    .each(function(idx, ele) {
                        var $ele = $(ele);
                        var $image = $ele.find('img');

                        if (!$image.length) {
                            return;
                        }

                        var image = $image.get(0).getBoundingClientRect();

                        var aspect = image.height / image.width;

                        if (aspect > 0.6) {
                            $ele.addClass('aspect-wide');
                        } else {
                            $ele.addClass('aspect-narrow');
                        }
                    });
            });
        });
    },
    cacheSelectors: function() {
        storyGrid.el.$featuredContent = $('.featured-content');
    }
};

export default storyGrid;