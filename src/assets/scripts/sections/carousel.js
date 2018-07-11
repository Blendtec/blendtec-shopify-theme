import $ from 'jquery';
import 'slick-carousel';
//import 'slick-carousel/slick/slick.css';
//import 'slick-carousel/slick/slick-theme.css';

var Carousel = (function() {
    var Carousel = function(config) {
        var defaults = {
            slideTimeout: 10000, // Should this be a setting?
            enableKenBurns: false
        };

        this.config = $.extend(defaults, config);
        this.slides = this.config.container.find('.carousel-slides');

        if (config.offsetNotificationBar) {
            this.config.container.addClass('offset-notification-bar');
        }

        this.config.enableKenBurns = this.config.enableKenBurns == 'true';

        $(window).on('resize', this.setTextMaxHeight.bind(this));

        this.init();
    };

    Carousel.prototype.init = function() {
        this.slides.on('init', this.slideInit.bind(this));
        this.slides.on('afterChange', this.afterChange.bind(this));

        this.slides.slick({
            autoplay: true,
            dots: true,
            arrows: false,
            mobileFirst: true,
            respondTo: 'min',
            adaptiveHeight: false,
            autoplaySpeed: this.config.slideTimeout,
            pauseOnHover: false,
            draggable: false,
            fade: true,
            lazyload: 'progressive'
        });

        $(window).trigger('resize');
    };

    Carousel.prototype.pause = function() {
        this.slides.slick('pause');
    };

    Carousel.prototype.play = function() {
        this.slides.slick('play');
    };

    Carousel.prototype.goTo = function(index) {
        this.slides.slick('slickGoTo', index);
    };

    Carousel.prototype.slideInit = function(_, slick) {
        var currentSlideIndex = slick.slickCurrentSlide();

        this.slick = slick;
        this.slides.trigger('afterChange', [slick, currentSlideIndex]);

        this.getSlide(currentSlideIndex).addClass('visible');

        if (this.config.enableKenBurns) {
            this.getSlide(currentSlideIndex).addClass('ken-burns');
        }
    };

    Carousel.prototype.afterChange = function(_, slick, index) {
        var previousSlide = this.getSlide(index - 1);
        var currentSlide = this.getSlide(index);

        previousSlide.removeClass('visible');
        currentSlide.addClass('visible');

        if (this.config.enableKenBurns) {
            previousSlide.removeClass('ken-burns');
            currentSlide.addClass('ken-burns');
        }
    };

    Carousel.prototype.getSlide = function(index) {
        if (index < 0) {
            index = this.slick.$slides.length - 1;
        }
        return $(this.slick.$slides[index]);
    };

    Carousel.prototype.setTextMaxHeight = function() {
        var heights = this.slick.$slides.toArray().map(function(slide) {
            if ($(slide).find('.carousel-slide-text-inner').length) {
                return slide.querySelector('.carousel-slide-text-inner')
                    .clientHeight;
            }
        });

        var maxHeight = Math.max.apply(heights);

        this.slick.$slides.each(function(_, slide) {
            if ($(slide).children('.carousel-slide-text').length) {
                $(slide)
                    .children('.carousel-slide-text')
                    .css('height', maxHeight);
            }
        });
    };

    return Carousel;
})();

var carousel = {
    carousels: [],
    init: function(id) {
        var $carousel = $(id);
        carousel.carousels.push(
            new Carousel({
                container: $carousel,
                enableKenBurns: $carousel.attr('data-ken-burns'),
                slideTimeout: $carousel.attr('data-slide-timeout')
            })
        );
    }
};

export default carousel;
