import $ from 'jquery';

var fitVids = {
    el: {},
    init: function (element) {
        fitVids.cacheSelectors(element);
        var $vid = fitVids.el.$parent.find('iframe');
  
        if ($vid.length) {
          $vid.fitVids();
        }
    },
    cacheSelectors: function (element) {
        fitVids.el.$parent = $(element);
    },
};

export default fitVids;