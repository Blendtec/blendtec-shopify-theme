(function(){
  var colorSection = document.getElementsByClassName('make-same-size-colors');
  var tallestSection = 0;
  for (var i = 0; i < colorSection.length; i++) {
    if (colorSection[i].offsetHeight  > tallestSection) {
      tallestSection = colorSection[i].offsetHeight;
    }
  }
  for (var i = 0; i < colorSection.length; i++) {
    colorSection[i].style.height = tallestSection+'px';
  }
})();

  var changeVisible =  function(variantObj) {
    document.getElementById('productImage-'+variantObj.productId).src = variantObj.src;
    document.getElementById('productSecondaryTitle-'+variantObj.productId).innerHTML = variantObj.title;
    document.getElementById('productPrice-'+variantObj.productId).innerHTML = variantObj.price;
    var links = document.getElementsByClassName('product-link-'+variantObj.productId);
    for (var i in links) {
      links[i].href = variantObj.url+'?variant='+variantObj.variantId;
    }
  }

  var selectOption1 = function(color, product) {
    var index = productSelectedVariant[product];
    var jar = variantToOptions[index].jar;
    for (var i in variantToOptions) {
      if (variantToOptions[i].jar === jar && variantToOptions[i].color === color && variantToOptions[i].productId === product) {
        productSelectedVariant[product] = i;
      }
    }
    changeVisible(variantToOptions[productSelectedVariant[product]]);
  };

  var selectOption2 = function(jar, product) {
    var index = productSelectedVariant[product];
    var color = variantToOptions[index].color;
    for (var i in variantToOptions) {
      if (variantToOptions[i].jar === jar && variantToOptions[i].color === color && variantToOptions[i].productId === product) {
        productSelectedVariant[product] = i;
      }
    }
    changeVisible(variantToOptions[productSelectedVariant[product]]);
  };

  var getHeightOfEachCell = function(obj, output, highest) {
    for (var i in obj['childNodes']) {
      if (obj['childNodes'][i].classList && obj['childNodes'][i].classList.contains('cell')) {
        obj['childNodes'][i].style.height = null;
        output.push(obj['childNodes'][i].offsetHeight);
        if (!highest[output.length-1] || (highest[output.length-1] && output[output.length - 1] > highest[output.length-1]) ) {
          highest[output.length-1] = output[output.length - 1];
        }
      }
      if (obj['childNodes'][i].childNodes) {
        getHeightOfEachCell(obj['childNodes'][i], output, highest);
      }
    }
  };

  var setCellHeight = function(obj, highest) {
    for (var i in obj['childNodes']) {
      if (obj['childNodes'][i].classList && obj['childNodes'][i].classList.contains('cell')) {
        var height = highest.shift();
        obj['childNodes'][i].style.height = height+'px';
      }
      if (obj['childNodes'][i].childNodes) {
        setCellHeight(obj['childNodes'][i], highest);
      }
    }
  };

  var setCellHeightByGridItem = function (grid, highest) {
    for (var i in grid['childNodes']) {
      if (grid['childNodes'][i] && grid['childNodes'][i].classList && grid['childNodes'][i].classList.contains('grid__item')) {
        var tempHighest = highest.slice();
        setCellHeight(grid['childNodes'][i], tempHighest);
      }
    }
  }

  var getTallestHeight = function(grid) {
    var highest = [];
    for (var i in grid['childNodes']) {
      if (grid['childNodes'][i] && grid['childNodes'][i].classList && grid['childNodes'][i].classList.contains('grid__item')) {
        getHeightOfEachCell(grid['childNodes'][i], [], highest);
      }
    }
    return highest;
  };

  var standardize_cell_size = function() {
    var grids = document.getElementsByClassName('grid');
    for (var i = 0; i < grids.length; i++) {
      var arrOfHeights = [];
      var highest = getTallestHeight(grids[i]);
      setCellHeightByGridItem(grids[i], highest);
    }
  };

  var makeOnlyLeftMostInfoVisible = function() {
    var sections = document.getElementsByClassName('blender-info-side');
    for (var i in sections) {
      if (sections[i] && sections[i].style) {
          sections[i].style.display = null;
          var parentLeftDiff = sections[i].parentElement.offsetLeft;
        if (sections[i].offsetLeft - parentLeftDiff > 25) {
          sections[i].style.display = 'none';
        } else {
          sections[i].style.display = null;
        }
      }
    }
  };

  var showPopUp = function() {
    document.getElementById('popupBackground').style.display = null;
    document.getElementById('thePopup').style.display = null;
    if (window.jQuery) {
      $('#thePopup').animate({opacity: 1, top: '5%'}, "slow");
    } else {
      document.getElementById('thePopup').style.opacity = 1;
      document.getElementById('thePopup').style.top = '5%';
    }
  }

  var zoomin = function(product) {
    var index = productSelectedVariant[product];

    document.getElementById('zoomInProduct').src = variantToOptions[index].src;
    document.getElementById('zoomInPanel').src = variantToOptions[index].panel;
    document.getElementById('thePopUp').classList.add('show');
  };

  var exitPopup = function() {
    document.getElementById('thePopUp').classList.remove('show');
  };

standardize_cell_size();
makeOnlyLeftMostInfoVisible();
window.addEventListener("resize", function() {
 standardize_cell_size();
 makeOnlyLeftMostInfoVisible();
});
