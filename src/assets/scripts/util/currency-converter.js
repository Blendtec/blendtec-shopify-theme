import $ from 'jquery';

var converter = {
    el: {},
    cacheSelectors: function () {
        converter.el.$currency= $('.currency-picker');
        converter.el.$pickerLabel = $('.currency-picker-label');
    },
    init: function() {
        var currencySelect = $('.currency-picker');

        if (converter.el.$currency.length && !converter.el.$pickerLabel.length) {
            var wrapper = $('<div class="currency-picker-outer" />');
            var label = $('<span class="currency-picker-label" />');
            currencySelect.wrap(wrapper);
            currencySelect.before(label);

            currencySelect
                .val(Currency.currentCurrency)
                .on('change', function() {
                    label.text(
                        currencySelect.children('option:selected').text()
                    );
                })
                .trigger('change');
        }
    }
};

export default converter;
