import $ from 'jquery';
import 'slick-carousel';

//import 'slick-carousel/slick/slick.css';
//import 'slick-carousel/slick/slick-theme.css';;


var reviewCarousel = {
    el: {},
    init: function() {
        reviewCarousel.cacheSelectors();
        reviewCarousel.el.$singleItem
            .slick({
                dots: true,
                arrows: true,
                mobileFirst: true,
                respondTo: 'min',
                adaptiveHeight: true,
                pauseOnHover: false,
                draggable: true,
                lazyload: 'progressive'
            })
            .init(function() {});
    },
    cacheSelectors: function() {
        reviewCarousel.el.$singleItem = $('.single-item');
    }
};

export default reviewCarousel;
