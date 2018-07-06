import $ from 'jquery';

var ProductPage = function() {
    var _this = this;
  
    this.product = $("#product-outer-container");
  
    if (!this.product.length) return;
  
    // I don't know why we're doing this
    if (navigator.appVersion.indexOf("MSIE 8") > 0) {
      return console.log('no thanks ie8');
    };
  
    new Shopify.OptionSelectors('productSelect', {
      product: JSON.parse(this.product.attr('data-product')),
      onVariantSelected: this.selectCallback.bind(this),
      enableHistoryState: true
    });
  
    $('#ProductPhotoSlideshow').slick({
      dots: true,
      arrows: false,
      mobileFirst: true,
      respondTo: 'min',
      adaptiveHeight: true,
      pauseOnHover: false,
      draggable: true,
      lazyload: 'progressive',
    }).init(function() {
      var imagePosition = _this.product.attr('data-initial-image-position');
  
      if (imagePosition) {
        $('#ProductPhotoSlideshow').slick('slickGoTo', imagePosition, false);
      }
    });
  
    // Add label if only one product option and it isn't 'Title'. Could be 'Size'.
    if (Number(this.product.attr('data-product-options-size')) == 1 && this.product.attr('data-product-options-first') != 'Title') {
      $('.selector-wrapper:eq(0)').prepend('<label for="productSelect-option-0">' + this.product.attr('data-product-options-first') + '</label>');
    };
  
    // Hide selectors if we only have 1 variant and its title contains 'Default'.
    if (Number(this.product.attr('data-product-variants-size')) == 1 && this.product.attr('data-product-variants-first').indexOf('Default') !== -1) {
      $('.selector-wrapper').hide();
    };
  
    this.initFitVids();
    this.setupTabs();
    this.extendTab();
    this.switchTabs();
    this.openLightbox();
    this.closeLightbox();
    this.addLabelsToSelectTags();
  
    $(window).on('widthChange', _.debounce(this.setupTabs, 50));
  };
  
  ProductPage.prototype.initFitVids = function() {
    var $vid = this.product.find('iframe');
  
    if ($vid.length) {
      $vid.fitVids();
    }
  };
  
  ProductPage.prototype.selectCallback = function(variant, selector) {
    if (!variant) return;
  
    ira.productPage({
      money_format: this.product.attr('data-money-format'),
      default_currency: this.product.attr('data-shop-default-currency'),
      variant: variant,
      selector: selector
    });
  
    if (variant.featured_image) {
      this.gotoSlide(variant.featured_image);
      this.updateVariantImage(variant.featured_image);
    }
  };
  
  ProductPage.prototype.openLightbox = function() {
    $('[data-product-lightbox-button="open"]').on('click', function() {
      ira.cache.$body.addClass('no-scroll');
      $('[data-product-lightbox]').addClass('active');
    });
  }
  
  ProductPage.prototype.closeLightbox = function() {
    $('[data-product-lightbox-button="close"]').on('click', function() {
      ira.cache.$body.removeClass('no-scroll');
      $('[data-product-lightbox]').removeClass('active');
    });
  }
  
  ProductPage.prototype.setupTabs = function() {
    var $tab = $('[data-product-tab]'),
        $content = $('[data-product-tab-content]');
  
    $tab.removeClass('inactive');
    $content
      .height('auto')
      .removeClass('truncated');
    $content.children('[data-product-tab-content-inner]')
      .height('auto')
      .removeClass('truncated');
  
    setTimeout(function() {
      $content.each(function(i, el) {
        var $el = $(el);
        var $parent = $el.closest('[data-product-tab]'),
            $inner = $el.children('[data-product-tab-content-inner]');
  
        $el.imagesLoaded(function() {
          var height = $el.height(),
              innerHeight = $inner.height();
  
          if (innerHeight > 400) {
            $inner
              .addClass('truncated')
              .height(innerHeight);
  
            $el.height('auto').addClass('truncated');
          } else {
            $parent
              .find('[data-read-more]')
              .remove();
  
            $el.height($el.height()).addClass('truncated');
          }
  
          $parent.toggleClass('inactive', !$parent.hasClass('active'));
        });
      });
    }, 10);
  };
  
  ProductPage.prototype.extendTab = function() {
    $('[data-product-tab]').on('click', '[data-read-more]', function(event) {
      var $target = $(event.currentTarget);
      var oldText = $target.text(),
          newText = $target.data('read-more');
  
      $target.closest('[data-product-tab]').find('[data-product-tab-content-inner]').toggleClass('truncated');
  
      $target
        .text(newText)
        .data('read-more', oldText);
  
      $(window).trigger('tab-extended');
    });
  };
  
  ProductPage.prototype.switchTabs = function() {
    $('[data-product-tab]').on('click', '[data-product-tab-title]', function() {
      var $this = $(this);
      var $parent = $this.closest('[data-product-tab]');
      var $sibs = $parent.siblings();
  
      $(window).trigger('tab-changed');
  
      if ($parent.hasClass('active')) {
        $parent
          .removeClass('active')
          .addClass('inactive');
      } else if ($sibs.hasClass('active')) {
        $sibs
          .removeClass('active')
          .addClass('inactive');
  
        $parent
          .removeClass('inactive')
          .addClass('active');
  
        setScrollTop($parent);
      } else {
        $parent
          .removeClass('inactive')
          .addClass('active');
  
        setScrollTop($parent);
      }
    });
  
    var setScrollTop = function($parent) {
      if (ira.cache.$productSidebar.hasClass('sticky-sidebar')) return;
      var offset = $('[data-sticky-header="true"]').length ? $('[data-sticky-header]').height() - 1 : 0;
      setTimeout(function() {
        var parentTop = Math.ceil($parent[0].getBoundingClientRect().top),
            bodyTop = Math.ceil($(document.body)[0].getBoundingClientRect().top);
        $(document.body).animate({
          scrollTop: parentTop - bodyTop - offset + 'px'
        }, 150);
      }, 100);
    }
  };
  
  ProductPage.prototype.addLabelsToSelectTags = function() {
    var _this = this;
    var selects = $('.selector-wrapper');
    selects.each(this.addInitialLabelToSelect.bind(this));
    this.addLabelToQuantityInput();
    $('.selector-wrapper select').on('change', function(e){
      selects.each(_this.updateLabel.bind(_this));
    });
  };
  
  ProductPage.prototype.updateLabel = function(i, e) {
    var select, labelText, textOverlay;
    labelText = $(e).find('label:first').text();
    select = $(e).find('select:first');
    textOverlay = $(e).find('.select-overlay:first');
    textOverlay.html('<strong>' + labelText + "</strong>: " + select.val());
    // hack from this stack overflow post to force a repaint on the element
    // http://stackoverflow.com/questions/7840384/select-inputs-not-responding-in-android-mobile-browser
    select.attr("forceRePaint", "yes");
  };
  
  ProductPage.prototype.addInitialLabelToSelect = function(i, e) {
    var label, select, labelText, textOverlay, transparentColor;
    label = $(e).find('label:first');
    select = $(e).find('select:first');
  
    if (label.is(':visible')){
      labelText = label.text();
      label.hide();
  
      select.css('color', 'rgba(0, 0, 0, 0)');
      textOverlay = $('<div class="select-overlay">');
      textOverlay.html('<strong>' + labelText + "</strong>: " + select.val());
      $(e).prepend(textOverlay);
    }
  };
  
  ProductPage.prototype.addLabelToQuantityInput = function() {
    $('.quantity-selector').wrapAll('<div class="quantity-wrapper">');
    var input = $('#Quantity');
    var label = $('label.quantity-selector');
  
    label.css({
      'position' : 'absolute',
    });
  
    label.wrap("<strong>");
    label.text(label.text() + ": ");
  
    input.css({
      'paddingLeft' : label.outerWidth() + 5,
    })
  
    $(window).on('resize', function(){
      input.css({
        'paddingLeft' : label.outerWidth() + 5,
      });
    });
  };
  
  ProductPage.prototype.updateVariantImage = function(image) {
    if ($('[data-product-images="stacked"]').length) {
      ira.switchImage(image.src, null, $('#ProductPhoto'), true, image.position);
    } else {
      ira.switchImage(image.src, null, $('#ProductPhotoImg'));
    }
  }
  
  ProductPage.prototype.gotoSlide = function(image) {
    if (image) {
      var $slideshow = $('#ProductPhotoSlideshow');
  
      if ($('.slick-initialized').length) {
        $slideshow.slick('slickGoTo', image.position - 1, false);
      }
    }
  };

var product = {
    el: {},
    productPage: null,
    cacheSelectors: function () {
        product.el.$body = $(document.body);
    },
    init: function(){
        console.log("PRODUCT INIT");
        product.cacheSelectors();
        product.productSidebar();
        product.productImageSwitch();
        new ProductPage();
        bvEnableScrollToReviews();
        product.el.$body.trigger('bt:product:ready');
    },
    bvEnableScrollToReviews: function () {},
    enableTags: function (el) {},
    changeColor: function (color, text, id) {},
    changeJar: function (jar, text, id) {},
    changeImage: function (id) {},
    changeQuantity: function (id) {},
    switchImage: function (src, imgObject, el, scroll, position) {},
    productImageswitch: function () {},
    productSidebar: function () {},
    productPage: function (options) {}
};
$(product.init);

