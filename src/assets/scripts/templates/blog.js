import $ from 'jquery';

var blog = {
    init:  function() {
        $('.blog-filtering').on('change', 'select', function (event) {
            _filterArticles(event);
          });
        
          $('.blog-filters').children().each(function (i, el) {
             var $el = $(el);
            var width = $el.find('.blog-filters-title').width();
        
             $el.find('select').css({
              'padding-left': width + 20,
            });
          });
        
          var _filterArticles = function (event) {
            var $target = $(event.currentTarget);
             var value = $target.val();;
             value = value.replace(/ /gi, '-');;
            value = value.toLowerCase();
            var blog = $target.data('collection-handle');
            var collection = '/blogs/' + encodeURIComponent(blog) + '/tagged/';
            if (value) {
               location = collection + encodeURIComponent(value);
            } else {
               location = '/blogs/' + encodeURIComponent(blog);
            }
          };
    }
};

$(document).ready(blog.init);