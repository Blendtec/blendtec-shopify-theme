import $ from 'jquery';
import _ from 'lodash';
import Platform from './platform';

var parallax = {
    el: {},
    animating: false,
    init: function(containerSelector) {
        parallax.cacheSelectors();

        const $container = $(containerSelector);
        if (!$container.length) {
            return;
        }
        $container
            .addClass('has-parallax')
            .attr('data-parallax', 'true')
            .attr('data-speed', '0.5')
            .attr('data-direction', 'down');

        var $parallax = $('[data-parallax="true"]:not(#notification-bar');
        parallax.el.$body.addClass('js-parallax');
        parallax.scrollEvent($parallax);
        parallax.el.$window.on('scroll', () => {
            parallax.throttlePrepare($parallax);
        });
    },
    cacheSelectors: function() {
        parallax.el.$window = $(window);
        parallax.el.$body = $(document.body);
        parallax.el.windowHeight = parallax.el.$window.height();
        parallax.el.$parallaxElement = $('.parallax-element');
        parallax.el.windowWidth = parallax.el.$window.width();
    },
    throttlePrepare: _.throttle(function(element) {
        if (!parallax.animating) {
            window.requestAnimationFrame(() => parallax.scrollEvent(element));
            parallax.animating = true;
        }
    }, 1000 / 60),
    scrollEvent: function(element) {
        var windowWidth = $(window).width();
        var windowHeight = $(window).height();

        if (!Platform.isTouchDevice() && windowWidth > 840) {
            var viewportTop = $(window).scrollTop();

            if (viewportTop <= windowHeight + 40) {
                $(element).each(function(i, el) {
                    var $el = $(el);
                    var sym;
                    var direction = $el.attr('data-direction');
                    var speed = $el.attr('data-speed');
                    var distance = viewportTop * speed;

                    if (direction === 'up') {
                        sym = '-';
                    } else {
                        sym = '';
                    }

                    distance = Number(distance.toFixed(2));

                    $el.css({
                        transform: 'translate3d(0,' + sym + distance + 'px, 0)'
                    });
                });
            }

            parallax.animating = false;
        }
    }
};

export default parallax;
