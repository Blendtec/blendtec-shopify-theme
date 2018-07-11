import $ from 'jquery';
var hash = {
    getHash: function() {
        return window.location.hash;
    },
    updateHash: function(hash) {
        window.location.hash = '#' + hash;
        $('#' + hash)
            .attr('tabindex', -1)
            .focus();
    }
};
