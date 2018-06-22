	function changePriceSpiderButton () {
		var currentVariant = new URL(window.location.href).searchParams.get('variant');
		var variantSKU = $('.ps-widget').attr('ps-sku-'+currentVariant);
		$('.ps-widget').attr('ps-sku', variantSKU);
		PriceSpider.rebind();
	}
	$(document).on('change', '#productSelect-option-0', function() {
		changePriceSpiderButton();
	});

	$(document).on('change', '#productSelect-option-1', function() {
		changePriceSpiderButton();
	});