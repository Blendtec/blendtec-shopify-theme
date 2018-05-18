try { pswtb } catch (ex) { pswtb = {} } if (!pswtb.loader) {
pswtb.loader = {
	lsc: [], waitLoad: function () {
		var e =
			pswtb.loader; if (e.finish) {
				for (var t = 0; t < e.lsc.length; t++)e.finish(e.lsc[t].wcid); window
					.clearInterval(e.waitLoadTimer); e.waitLoadTimer = null
			} else {
				if (!e.waitLoadTimer) e.waitLoadTimer =
					window.setInterval(e.waitLoad, 20)
		}
	}, show: function (e) {
		for (var t = 0; t < this.lsc.length; t++)if (this
			.lsc[t].wcid === e.widgetConfigurationId) { this.lsc[t].ops.push(e); return } var n = document
				.createElement("script"); n.type = "text/javascript"; var r = e.server; n.language = "javascript"; n.src =
					(r ? (r.match(/\/\//) ? "" : "//") + r + (r.charAt(r.length - 1) === "/" ? "" : "/") : "//embedded.pricespider.com/")
					+ "WidgetScript.psjs?d=al&wc=" + e.widgetConfigurationId; this.lsc.push({
						wcid: e.
							widgetConfigurationId, ops: [e]
					}); if (navigator.userAgent.match(/msie [6-7]/i)) {
						document.write('<'
							+ 'script type="' + n.type + '" src="' + n.src.replace(/d=al&/i, "") + '"><' + "/script>"); this.waitLoad();
						return
					} var i = navigator.userAgent.match(/msie [8-9]/i); n.async = true; if (i) n.onreadystatechange =
						new Function("if ((/loaded|completed/i).test(this.readyState)) pswtb.loader.finish('" + e.
							widgetConfigurationId + "');"); else n.onload = new Function("pswtb.loader.finish('" + e.
								widgetConfigurationId + "');"); (i ? document.getElementsByTagName("head")[0] : document.body)
									.appendChild(n)
	}
}
}