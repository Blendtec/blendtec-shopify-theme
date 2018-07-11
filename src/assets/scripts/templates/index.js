var index = {
    init: function () {
        var $firstSection = $('.parallax-container .shopify-section').eq(0);

        if ($firstSection.hasClass('carousel')) {
          $firstSection
            .addClass('has-parallax')
            .attr('data-parallax', 'true')
            .attr('data-speed', '0.5')
            .attr('data-direction', 'down');
        }
    }
};

$(index.init);