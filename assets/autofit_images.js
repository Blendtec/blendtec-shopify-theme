(function(){
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
  
  function loadIfVisible () {
  	var doc = document.documentElement;
  	var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
    var win_height = window.innerHeight;
    var bottom_of_page = top+win_height;
    var top_of_page = top;
  
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
 


window.onresize = function () {
	loadImagesByWidth('imagebasesrc', 'backgroundimagesrc');
};



window.onload = function () {
	loadImagesByWidth('imagebasesrc', 'backgroundimagesrc');
};

window.onscroll = function () {
loadIfVisible();
};

  })();