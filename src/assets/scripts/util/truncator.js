import $ from 'jquery';

var truncator = {
    truncate: function(maxChars, elements) {
        var MAX_CHARS = maxChars;
        $(elements).each(function(i, e) {
            var origText = $(this).text();
            if (origText.length > MAX_CHARS) {
                var cut = truncator.cutKeepingTags(this, 180);
                var elements = $(cut.text);
                // Add the elipses to the last child element in whatever tag its in.
                elements
                    .find('*:last-child')
                    .last()
                    .text(
                        elements
                            .find('*:last-child')
                            .last()
                            .text() + '...'
                    );

                $(this)
                    .text('')
                    .append(elements);
            }
        });
    },
    cutKeepingTags: function(elem, reqCount) {
        var grabText = '',
            missCount = reqCount;
        $(elem)
            .contents()
            .each(function() {
                switch (this.nodeType) {
                    case Node.TEXT_NODE:
                        // Get node text, limited to missCount.
                        grabText += this.data.substr(0, missCount);
                        missCount -= Math.min(this.data.length, missCount);
                        break;
                    case Node.ELEMENT_NODE:
                        // Explore current child:
                        var childPart = cutKeepingTags(this, missCount);
                        grabText += childPart.text;
                        missCount -= childPart.count;
                        break;
                }
                if (missCount == 0) {
                    // We got text enough, stop looping.
                    return false;
                }
            });
        return {
            text:
                // Wrap text using current elem tag.
                elem.outerHTML.match(/^<[^>]+>/m)[0] +
                grabText +
                '</${  elem.localName  }>',
            count: reqCount - missCount
        };
    }
};
export default truncator;
