import $ from 'jquery';
import initScrollTriggers from './scroll-triggers';
import hero from '../sections/hero';
import footer from '../sections/footer';
import instagram from '../sections/instagram';
import grid from '../sections/grid';
import storyGrid from '../sections/story-grid';
import reviewCarousel from '../sections/review-carousel';
import videoPlayer from '../sections/video-player';
import carousel from '../sections/carousel';
import header from '../sections/header';


var shopify = {
    el: {},
    cacheSelectors: function() {
        shopify.el.$document = $(document);
        // TODO 
        shopify.el.$carousel = $('.carousel');
    },
    init: function() {
        shopify.cacheSelectors(); 
        shopify.el.$document
            .on('shopify:section:load', shopify.handleSectionLoad)
            .on('shopify:section:select', shopify.handleSectionSelect)
            .on('shopify:section:deselect', shopify.handleSectionDeselect)
            .on('shopify:block:select', shopify.handleSectionSelect)
            .on('shopify:block:deselect', shopify.handleSectionDeselect);
    },
    handleSectionLoad: function() {
        var section = $(event.target);
        var type = section
            .attr('class')
            .replace('shopify-section', '')
            .trim();
   
        initScrollTriggers();
        switch (type) {
            case 'header':
                header.init();
                break;
            case 'bt-hero':
                hero.init();
                break;
            case 'instagram':
                instagram.init();
                break;
            case 'featured-content':
                storyGrid.init();
                break;
            case 'review-carousel':
                reviewCarousel.init();
                break;
            case 'video-player':
                videoPlayer.init();
                break;
            case 'index-grid-wrapper':
                grid.init();
                break;
            case 'featured-collections':
                grid.init();
                break;
            case 'featured-products':
                grid.init();
                break;
            case 'featured-blog':
                grid.init();
            case 'bt-footer':
                footer.init();
                break;    
            case 'collection-pages':
                header.init(type == 'collection-pages');
                if ($('#notification-bar').length > 0) {
                    $(document.body).addClass('respond-to-notification-bar');
                    $('#HeaderSearchBar').addClass(
                        'offset-by-notification-bar'
                    );
                } else {
                    $(document.body).removeClass('respond-to-notification-bar');
                    $('#HeaderSearchBar').removeClass(
                        'offset-by-notification-bar'
                    );
                }

                $(window).trigger('scroll');
                break;
            case 'carousel':
                break;
            case 'product-pages':
            // TODO
                break;
        }
    },
    handleSectionSelect: function() {
        var section = $(event.target);
        var type = section
            .attr('class')
            .replace('shopify-section', '')
            .trim();

        switch (type) {
            case 'popup':
                $('.exit-intent-overlay').addClass('show');
                break;
        }
    },
    handleSectionDeselect: function() {
        var section = $(event.target);
        var type = section.attr('class').replace('shopify-section', '').trim();
    
        switch (type) {
            case 'popup':
              $('.exit-intent-overlay').removeClass('show');
              break;
        }
    },
    handleSectionBlockSelect: function() {
        var section = $(event.target);
        var type = section.closest('.shopify-section').attr('class').replace('shopify-section', '')
    .trim();
    
        switch (type) {
            case 'carousel':
              var slide = $(event.target);
    
              ira.carousels.forEach(function (carousel) {
                carousel.pause();
                carousel.goTo(slide.attr('data-slick-index'));
              });
              break;
        }
    },
    handleSectionBlockDeselect: function() {
        var id = event.originalEvent.detail.sectionId;
        var slide = $(event.target);
    
        page.$el.carousels.forEach(function (carousel) {
          carousel.play();
        });
    }
};
