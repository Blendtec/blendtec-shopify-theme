import $ from 'jquery';
 

var randomImages = {
  el: {
  },
  cacheSelectors: function () {
  },
  init: function(self = this) {
    self.cacheSelectors();

    self.randomize(); 
  },
  addAttributes: function(nodeName, elem, num) {
    for (var i = 0; i < elem.attributes.length; i++) {
        var attrib = elem.attributes[i];
        if (attrib.name.match(new RegExp(num+nodeName))) {
          var att = document.createAttribute(attrib.name.replace(/[0-9]*/,''));
          att.value = attrib.value;
          elem.setAttributeNode(att);

        }
    }
  },
  showText: function(className) {
      $('.'+className).show();
  },
  setUrl: function(className, which) {
    var elements = $('.' + className);
    for (var i = 0; i < elements.length; i++) {
      var tempHref = $(elements[i]).attr(which+'href');
      $(elements[i]).attr('href', tempHref);
    }
  },
  randomize: function () {
      var maxArrLength = 0;
      var images = $('.javascript-load-image');
      maxArrLength = Number(images.attr('numblocks'));
      if (maxArrLength > 0) {
        var randomImageToShow = Math.floor((Math.random() * maxArrLength) + 1);

        for (var i in images) {
          if (images[i] && images[i].attributes && images[i].attributes['typeImage'] && images[i].attributes['typeImage'].nodeValue) {
            var numToPass = randomImageToShow;
            if (!isNaN(images[i].attributes['numBlocks'].nodeValue) && randomImageToShow > Number(images[i].attributes['numBlocks'].nodeValue)) {
              numToPass = Number(images[i].attributes['numBlocks'].nodeValue);
            }
            if (images[i].attributes['tieTextClass'] && images[i].attributes['tieTextClass'].nodeValue) {
              this.showText(images[i].attributes['tieTextClass'].nodeValue + numToPass);
              this.setUrl(images[i].attributes['tieTextClass'].nodeValue + 'href', numToPass);
            }
            var nodeName = images[i].attributes['typeImage'].nodeValue;
            this.addAttributes(nodeName, images[i], numToPass);

          }
        }
      }
  }
};
 
export default randomImages;
