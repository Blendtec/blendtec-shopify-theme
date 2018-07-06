import $ from 'jquery';
import _ from 'lodash';

var grid = {
    el: {},
    config: {},
    $nodes: null,
    $grid: null,
    $subpixelGrid: null,
    $imageCells: null,
    init: function(options) {
        grid.cacheSelectors();
        var defaults = {};
        grid.config = $.extend(defaults, options);
        var maxCallFrequency = 100;

        grid.$imageCells = grid.el.$gridImage;
        grid.$grid = grid.el.$gridFull;
        grid.$subpixelGrid = grid.el.$subpixelGrid;

        var throttlePrepare = _.throttle(function() {
            if (grid.$grid) {
                grid.resizeImages();
            }
            if (grid.$subpixelGrid) {
                grid.subpixelGrid();
            }
        }, maxCallFrequency);

        if (grid.$grid) {
            grid.resizeImages();
        }
        if (grid.$subpixelGrid) {
            grid.subpixelGrid();
        }

        if (grid.$grid && grid.$grid.imagesLoaded) {
            grid.$grid.imagesLoaded().done(function() {
                if (grid.$grid) {
                    grid.resizeImages();
                }
                if (grid.$subpixelGrid) {
                    grid.bindEvents();
                    grid.subpixelGrid();
                }
                grid.el.$window.on('widthChange', throttlePrepare);
            });
        }
    },
    cacheSelectors: function() {
        grid.el.$window = $(window);
        grid.el.$bodyHtml = $('body, html');
        grid.el.$gridFull = $('grid--full');
        grid.el.$gridImage = $('grid__image');
        grid.el.$subpixelGrid = $('[data-grid-subpixel]');
    },
    bindEvents: function() {
        grid.$subpixelGrid
            .find('[data-grid-item].has-hover')
            .on('mouseenter mouseleave', function(event) {
                var $target = $(event.currentTarget).find(
                    '.index-grid-item-overlay'
                );
                if ($target.length) {
                    var opacityType =
                        event.type === 'mouseenter'
                            ? 'hover-opacity'
                            : 'opacity';
                    var newOpacity = parseFloat(
                        $target.data(opacityType),
                        10
                    );
                    $target.css('opacity', newOpacity);
                }
            });
    },
    subpixelGrid: function() {
        var $cells = grid.$subpixelGrid.find('[data-grid-item]');

        $cells
            .addClass('height-css')
            .height('auto')
            .find('img')
            .removeClass('processed')
            .width('auto')
            .height('auto');

        if (!$cells.length) {
            return;
        }

        $cells.each(function(i, el) {
            var $cell = $(el);
            var $wrapper = $cell.find('.image-wrapper');
            var $img = $wrapper.find('img:first');

            $cell.imagesLoaded(function() {
                if ($img.length) {
                    var wrapperWidth = $wrapper.outerWidth();
                    var wrapperHeight = $wrapper.outerHeight();
                    var wrapperAspect = wrapperWidth / wrapperHeight;
                    var aspectRatio =
                        $img[0].naturalWidth / $img[0].naturalHeight;

                    if (aspectRatio > wrapperAspect) {
                        $img.height(Math.ceil(wrapperHeight + 2)).addClass(
                            'processed'
                        );
                    } else {
                        $img.width(Math.ceil(wrapperWidth + 2)).addClass(
                            'processed'
                        );
                    }
                }

                $cell
                    .height(parseInt($cell.height(), 10))
                    .removeClass('height-css');
            });
        });
    },
    resizeImages: function() {
        var $cells = grid.$imageCells;
        $cells.removeClass('processed');

        if (!$cells.length) {
            return;
        }

        $cells.each(function(i, el) {
            var $cell = $(el);
            var $wrapper = $cell.find('.cell-wrapper');
            var $img = $wrapper.find('img:last');
            /* eslint-disable */
            var imgVariant = $wrapper.find('img:first').length
                ? $wrapper.find('img:first')
                : false;
            /* eslint-enable */

            if ($img.length) {
                $wrapper.add($img).css({
                    height: 'auto'
                });

                $cell.imagesLoaded(function() {
                    var wrapperWidth = $wrapper.outerWidth();
                    var aspectRatio =
                        $img[0].naturalWidth / $img[0].naturalHeight;

                    if (imgVariant) {
                        var aspectRatioVariant =
                            imgVariant[0].naturalWidth /
                            imgVariant[0].naturalHeight;
                        if (aspectRatio < aspectRatioVariant) {
                            imgVariant.addClass('is-short');
                        }
                    }

                    $wrapper.height(Math.floor(wrapperWidth / aspectRatio));
                    $img.height(Math.floor(wrapperWidth / aspectRatio));
                    $cell.addClass('processed');
                });
            }
        });
    }
};

export default grid;