import $ from 'jquery';
 
var autoFitImages = {
  el: {
  },
  cacheSelectors: function () {
    this.el.backgroundString = 'backgroundimagesrc';
    this.el.imageString = 'imagebasesrc';
    this.el.newImg = new Image;
    this.el.window = $(window);
    this.el.$classesAffected = $('.javascript-load-image');
  },
  init: function() {
    var self = this;
    this.cacheSelectors();
    this.el.window.resize(function () {
      self.loadImagesByWidth(self.el.imageString, self.el.backgroundString);
    });
    this.el.window.scroll(function () {
      self.loadIfVisible();
    });
    this.loadImagesByWidth(self.el.imageString, self.el.backgroundString);
    this.loadIfNotVisible(0);    

  },
  getClosestWidth: function(element, baseNode) {
      var elementWidth = element.offsetWidth;
      var baseWidthCheck = 50;
      var widthMaximum = 4800;
      var diffFromWidth = widthMaximum;
      var chosenNode = "";
      for (var i = baseWidthCheck; i < widthMaximum; i+=50) {
        if (Math.abs(elementWidth - i) < diffFromWidth && element && element.attributes && element.attributes[baseNode+i] && element.attributes[baseNode+i].nodeValue && element.attributes[baseNode+i].nodeValue.length > 1) {
          diffFromWidth = elementWidth - i;
          chosenNode = baseNode+i;
        }
      }
      return chosenNode;
  },
  getPosition: function(element) {
        var yPosition = 0;
        while(element) {
            yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
            element = element.offsetParent;
        }
        return yPosition; 
  },
  showImage: function(element, source, backgroundImage) {
        element.alreadyLoaded = true;
        var $element = $(element);
        if (typeof element != 'undefined' && typeof source != 'undefined' && typeof backgroundImage != 'undefined') {
          if ((!element.src || element.src.length === 0) && !backgroundImage) {
            element.src = source;
            var originalElementOpacity = $(element).css('opacity');
            if (!originalElementOpacity || originalElementOpacity == 0) {
              originalElementOpacity = 1;
            }
            $element.css('opacity', 0);

            element.onload = function() {
              $element.animate({
                                opacity: originalElementOpacity
                              }, 500, function() {
                                element.onload = null;
                              });
            }
          } else if (backgroundImage && $element.css('background-image') !== 'url('+source+')' ) {
              $element.css('backgroundImage', 'url('+source+')');
          } else if ($(element).attr('src') != source) {
              $element.attr('src', source);
          }
        }
  },
  loadIfVisible: function(bottomSet, topSet) {
        if (!bottomSet) {
          bottomSet = null;
        }
        if (!topSet) {
          topSet = null;
        }
        var bottom_of_page = bottomSet;
        var top_of_page = topSet;
        var keepOpaque = true;
        if (bottom_of_page === null && top_of_page === null) {
          var doc = document.documentElement;
          var top = (this.el.window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
          var win_height = this.el.window.innerHeight();
          bottom_of_page = top+win_height;
          top_of_page = top;
          keepOpaque = false;
        }
        var self = this;
        var imagesToLoad = this.el.$classesAffected;
        for (var i in imagesToLoad) {
          if (imagesToLoad && imagesToLoad[i] && (imagesToLoad[i].selectedSrc || imagesToLoad[i].selectedBackgroundSrc)) {
            var elem_position_top = this.getPosition(imagesToLoad[i]);
            var elem_position_bottom = elem_position_top + imagesToLoad[i].offsetHeight;
            if ((elem_position_top >= top_of_page && elem_position_top <= bottom_of_page) || (elem_position_bottom >= top_of_page && elem_position_bottom <= bottom_of_page) && imagesToLoad[i].selectedSrc) {
              self.showImage(imagesToLoad[i], imagesToLoad[i].selectedSrc, false);
            }
            if ((elem_position_top >= top_of_page && elem_position_top <= bottom_of_page) || (elem_position_bottom >= top_of_page && elem_position_bottom <= bottom_of_page) && imagesToLoad[i].selectedBackgroundSrc) {
              self.showImage(imagesToLoad[i], imagesToLoad[i].selectedBackgroundSrc, true);
            }
          }
        }  
  },
  loadImagesByWidth: function(imagessrc, backgroundimagesrc) {
      var imagesToLoad = this.el.$classesAffected;
      for (var i in imagesToLoad) {
         var chosenNode = this.getClosestWidth(imagesToLoad[i], imagessrc);
         if (chosenNode && imagesToLoad[i] && imagesToLoad[i].attributes && imagesToLoad[i].attributes[chosenNode]) {
                imagesToLoad[i].selectedSrc = imagesToLoad[i].attributes[chosenNode].nodeValue;
         }
          var chosenBackgroundNode = this.getClosestWidth(imagesToLoad[i], backgroundimagesrc);
          if (chosenBackgroundNode && imagesToLoad[i] && imagesToLoad[i].attributes && imagesToLoad[i].attributes[chosenBackgroundNode]) {
            imagesToLoad[i].selectedBackgroundSrc = imagesToLoad[i].attributes[chosenBackgroundNode].nodeValue;
          }
      }
      this.loadIfVisible();
  },
  preloadImage: function(element, source, backgroundImage, callback) {
        this.el.newImg.onload = function() {
          if (backgroundImage) {
            $(element).css('background-image', 'url('+source+')');
          }
          callback();
        }
        this.el.newImg.src = source;
  },
  loadIfNotVisible: function(i) {
      var imagesToLoad = this.el.$classesAffected;
      var self = this;
      if (i < imagesToLoad.length) {
        var imageToLoad = imagesToLoad[i];
        if (imageToLoad && imageToLoad.alreadyLoaded) {
          self.loadIfNotVisible(i + 1);
        } else {
          if (imageToLoad && (imageToLoad.selectedSrc || imageToLoad.selectedBackgroundSrc)) {
            if (imageToLoad.selectedSrc) {
              self.preloadImage(imageToLoad, imageToLoad.selectedSrc, false, function () {
                self.loadIfNotVisible(i + 1);
              });
            }
            if (imageToLoad.selectedBackgroundSrc) {
              self.preloadImage(imageToLoad, imageToLoad.selectedBackgroundSrc, true, function () {
                self.loadIfNotVisible(i + 1);
              });
            }
          }
        }
      } else {
        return;
      }
  }
};
 
export default autoFitImages;
