function initAutofitImages() {


  function getClosestWidth (element, baseNode) {
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
  }

  function getPosition(element) {
      var yPosition = 0;

      while(element) {
          yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
          element = element.offsetParent;
      }

      return yPosition;
  }

    function animateImageIfjQuery (element, source, backgroundImage) {
      element.alreadyLoaded = true;
      if (typeof element != 'undefined' && typeof source != 'undefined' && typeof backgroundImage != 'undefined') {
        if ((!element.src || element.src.length === 0) && !backgroundImage) {
  		    element.src = source;

          var originalElementOpacity = element.style.opacity;
          if (!originalElementOpacity || originalElementOpacity == 0) {
            originalElementOpacity = 1;
          }
          element.style.opacity = 0;

          element.onload = function() {
            element.style.opacity = 0;
            if (window.jQuery) {
                $(element).animate({
                                  opacity: originalElementOpacity
                                }, 500, function() {
                    element.onload = null;
                                });
            } else {
                element.style.opacity = originalElementOpacity;
                element.onload = null;
            }

          }


        } else if (backgroundImage && element.style.backgroundImage != 'url('+source+')') {
            element.style.backgroundImage = 'url('+source+')';
        } else if (element.src != source) {
            element.src = source;
        }
      }

    }

    function loadIfVisible (bottomSet, topSet) {
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
        var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
        var win_height = window.innerHeight;
        bottom_of_page = top+win_height;
        top_of_page = top;
        keepOpaque = false;
      }

      var imagesToLoad = document.getElementsByClassName('javascript-load-image');
      for (var i in imagesToLoad) {
        if (imagesToLoad && imagesToLoad[i] && (imagesToLoad[i].selectedSrc || imagesToLoad[i].selectedBackgroundSrc)) {
        	var elem_position_top = getPosition(imagesToLoad[i]);
          var elem_position_bottom = elem_position_top + imagesToLoad[i].offsetHeight;
          if ((elem_position_top >= top_of_page && elem_position_top <= bottom_of_page) || (elem_position_bottom >= top_of_page && elem_position_bottom <= bottom_of_page) && imagesToLoad[i].selectedSrc) {
            animateImageIfjQuery(imagesToLoad[i], imagesToLoad[i].selectedSrc, false);
          }
          if ((elem_position_top >= top_of_page && elem_position_top <= bottom_of_page) || (elem_position_bottom >= top_of_page && elem_position_bottom <= bottom_of_page) && imagesToLoad[i].selectedBackgroundSrc) {
            animateImageIfjQuery(imagesToLoad[i], imagesToLoad[i].selectedBackgroundSrc, true);
          }
        }
      }

    }

  function loadImagesByWidth (imagesrc, backgroundimagesrc) {
  	var imagesToLoad = document.getElementsByClassName('javascript-load-image');

  	for (var i in imagesToLoad) {
  		 var chosenNode = getClosestWidth(imagesToLoad[i], imagesrc);
  		 if (chosenNode && imagesToLoad[i] && imagesToLoad[i].attributes && imagesToLoad[i].attributes[chosenNode]) {
              imagesToLoad[i].selectedSrc = imagesToLoad[i].attributes[chosenNode].nodeValue;
  		 }
        var chosenBackgroundNode = getClosestWidth(imagesToLoad[i], backgroundimagesrc);
        if (chosenBackgroundNode && imagesToLoad[i] && imagesToLoad[i].attributes && imagesToLoad[i].attributes[chosenBackgroundNode]) {
          imagesToLoad[i].selectedBackgroundSrc = imagesToLoad[i].attributes[chosenBackgroundNode].nodeValue;
        }
  	}
    loadIfVisible();
  }
  var newImg = new Image;
  function preloadImage (element, source, backgroundImage, callback) {
      newImg.onload = function() {
        if (backgroundImage) {
          element.style.backgroundImage = 'url('+source+')';
        }
        callback();
      }
      newImg.src = source;

  }

  function loadIfNotVisible (i) {
    var imagesToLoad = document.getElementsByClassName('javascript-load-image');
    if (i < imagesToLoad.length) {
      var imageToLoad = imagesToLoad[i];
      if (imageToLoad && imageToLoad.alreadyLoaded) {
        loadIfNotVisible(i + 1);
      } else {
        if (imageToLoad && (imageToLoad.selectedSrc || imageToLoad.selectedBackgroundSrc)) {
          if (imageToLoad.selectedSrc) {
            preloadImage(imageToLoad, imageToLoad.selectedSrc, false, function () {
              loadIfNotVisible(i + 1);
            });
          }
          if (imageToLoad.selectedBackgroundSrc) {
            preloadImage(imageToLoad, imageToLoad.selectedBackgroundSrc, true, function () {
              loadIfNotVisible(i + 1);
            });
          }
        }
      }
    } else {
      return;
    }
  }

  var addAttributes = function(nodeName, elem, num) {
  for (var i = 0; i < elem.attributes.length; i++) {
      var attrib = elem.attributes[i];
      if (attrib.name.match(new RegExp(num+nodeName))) {
        var att = document.createAttribute(attrib.name.replace(/[0-9]*/,''));
        att.value = attrib.value;
        elem.setAttributeNode(att);

      }
  }

  };

  var showText = function(className) {
    if (window.jQuery) {
      $('.'+className).show();
    } else {
      var elements = document.getElementsByClassName(className);
      for (var i = 0; i < elements.length; i++) {
        elements[i].style.display = null;
      }
    }
  };

  var setUrl = function(className, which) {
  var elements = document.getElementsByClassName(className);
  for (var i = 0; i < elements.length; i++) {
    var tempHref = elements[i].getAttribute(which+'href');
    elements[i].href = tempHref;
  }
  };

  var backgroundString = 'backgroundimagesrc';
  var imageString = 'imagebasesrc';


  var randomImages = function () {
      var maxArrLength = 0;
    var images = document.getElementsByClassName('javascript-load-image');
    for (var i in images) {
      if (images[i] && images[i].attributes && images[i].attributes['numBlocks'] && images[i].attributes['numBlocks'].nodeValue) {
        if (!isNaN(images[i].attributes['numBlocks'].nodeValue) && Number(images[i].attributes['numBlocks'].nodeValue) > maxArrLength) {
          maxArrLength = Number(images[i].attributes['numBlocks'].nodeValue);
        }
      }
    }
    if (maxArrLength > 0) {
      var randomImageToShow = Math.floor((Math.random() * maxArrLength) + 1);

      for (var i in images) {
        if (images[i] && images[i].attributes && images[i].attributes['typeImage'] && images[i].attributes['typeImage'].nodeValue) {
          var numToPass = randomImageToShow;
          if (!isNaN(images[i].attributes['numBlocks'].nodeValue) && randomImageToShow > Number(images[i].attributes['numBlocks'].nodeValue)) {
            numToPass = Number(images[i].attributes['numBlocks'].nodeValue);
          }
          //tieTextClass
          if (images[i].attributes['tieTextClass'] && images[i].attributes['tieTextClass'].nodeValue) {
            showText(images[i].attributes['tieTextClass'].nodeValue + numToPass);
            setUrl(images[i].attributes['tieTextClass'].nodeValue + 'href', numToPass);
          }
          var nodeName = images[i].attributes['typeImage'].nodeValue;
          addAttributes(nodeName, images[i], numToPass);

        }
      }
    }


  };

  $(window).onresize = function () {
  	loadImagesByWidth(imageString, backgroundString);
  };


  $(window).onscroll = function () {
    loadIfVisible();
  };

  randomImages();
  loadImagesByWidth(imageString, backgroundString);

  loadIfNotVisible(0);

};

export default initAutofitImages;