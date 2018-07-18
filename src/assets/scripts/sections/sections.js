import $ from 'jquery';
import hero from './hero';
import footer from './footer';
import instagram from './instagram';
import grid from './grid';
import storyGrid from './story-grid';
import reviewCarousel from './review-carousel';
import videoPlayer from './video-player';
import carousel from './carousel';
import header from './header';
import exitIntent from './exit-intent';

var imagesLoaded = require('imagesloaded');
imagesLoaded.makeJQueryPlugin($);

var page = {
    el: {},
    init: function() {
        page.cacheSelectors();
        header.init(); 
        exitIntent.init();
        page.el.$window.on('widthChange', footer.init);
        page.el.$body.imagesLoaded(footer.init);
    },
    cacheSelectors: function() {
        page.el.$window = $(window);
        page.el.$document = $(document);
        page.el.$body = $(document.body);
    }
};

page.init();
$(document).on('bt:component:hero', hero.init);
$(document).on('bt:component:instagram', instagram.init);
$(document).on('bt:component:storygrid', storyGrid.init);
$(document).on('bt:component:review-carousel', reviewCarousel.init);
$(document).on('bt:component:video-player', videoPlayer.init);
$(document).on('bt:component:grid', grid.init);
$(document).on('bt:component:featured-blog', grid.init);
$(document).on('bt:component:carousel',(event, id) =>  {
    carousel.init(id);
});
