import $ from 'jquery';
import _ from 'lodash';

var instagram = {
    el: {},
    clientId: '',
    baseAPI: 'https://api.instagram.com/v1/',
    numberOfImages: 8,
    maxImages: 8,
    imageIndex: 8,
    transitionSpeed: 1000,
    instagramImageData: [],
    captionClassName: 'instagrid-caption',
    refreshTime: 2500,
    randomize: true,
    loopAnimation: true,
    init: function() {
        instagram.cacheSelectors();
        var accessToken = instagram.el.$instagramContainer.attr(
            'data-access-token'
        );
        instagram.clientId = accessToken;

        if (
            !instagram.el.$instagramContainer.length ||
            accessToken == null ||
            !accessToken.length
        ) {
            return;
        }
        instagram.populate(accessToken);
    },
    instaGrid: {},
    authenticateWithAccessToken: function(options) {
        if (typeof options.feedType !== 'string') {
            options.feedType = 'recent';
        }

        var promise = jQuery.Deferred();
        var url = `${instagram.baseAPI}users/self/media/${
            options.feedType
        }?access_token=${options.accessToken}`;

        $.ajax({
            type: 'GET',
            dataType: 'jsonp',
            data: {},
            url: url,
            success: function(response) {
                if (!response) {
                    promise.reject({
                        code: 400,
                        message: 'No response from Instagram servers'
                    });
                }

                if (response.meta.code === 400) {
                    promise.reject(response);
                }

                if (
                    response.meta.code === 200 ||
                    String(response.meta.code).indexOf('2') === 0
                ) {
                    instagram.instagramImageData = response.data;
                    promise.resolve(response.data);
                }
                promise.reject(response);
            }
        });

        return promise.promise();
    },
    populate: function(accessToken) {
        return instagram
            .authenticateWithAccessToken({
                accessToken: accessToken,
                feedType: 'recent'
            })
            .then(function(images) {
                instagram.insertImages(images);
                instagram.continuallyUpdateImages();
            })
            .fail(function() {
                instagram.el.$instagramContainer.remove();
            });
    },
    insertImages: function(images) {
        var $exampleDiv = instagram.el.$instagramContainer
            .find('div:first')
            .detach();
        var classes = $exampleDiv[0].className;
        var allImages = [];

        if (instagram.numberOfImages > images.length) {
            instagram.numberOfImages = images.length;
        }

        images.forEach(function(image, i) {
            if (i >= instagram.maxImages) {
                return;
            }

            var div = document.createElement('div');
            var src = image.images.standard_resolution.url;
            var imgWrapper = document.createElement('span');
            var img = document.createElement('img');
            var link = document.createElement('a');

            var spacer = document.createElement('div');
            spacer.className = 'spacer';

            img.src = src;
            img.className = 'photo';
            div.className = classes;
            imgWrapper.className = 'image-wrapper';

            link.href = image.link;
            imgWrapper.appendChild(img);
            div.appendChild(imgWrapper);
            instagram.createAndAppendCaption(image, div);
            div.appendChild(link);

            allImages.push(div);
        });
        instagram.el.$instagramContainer.append(allImages);
    },
    doesImageHaveCaption: function(image) {
        var likes =
            !_.isNull(image.likes) && typeof image.likes.count === 'number';
        var text =
            !_.isNull(image.caption) &&
            typeof image.caption.text === 'string';

        if (!text && !likes) {
            return false;
        }

        return { text: text, likes: likes };
    },
    getUserID: function(userName) {
        var url = `${
            instagram.baseAPI
        }users/search?q=${userName}&client_id=${instagram.clientID}`;

        url += '&callback=callbackFunction'; // make it a JSONP request
        var promise = jQuery.Deferred();

        $.ajax({
            type: 'GET',
            dataType: 'jsonp',
            data: {},
            url: url,
            success: function(data) {
                if (typeof data.data === 'undefined') {
                    return promise.reject(data.meta);
                }
                var target = data.data.filter(function(e) {
                    return e.username === userName;
                });
                promise.resolve(target[0].id);
            }
        });

        return promise.promise();
    },
    haltUpdatingImages: function() {
        clearInterval(instagram.updateInterval);
    },
    createAndAppendCaption: function(image, target) {
        var caption = instagram.createCaption(image);
        return target.appendChild(caption);
    },
    createCaption: function(image) {
        var caption = document.createElement('div');
        var likes = document.createElement('p');
        var heart = $(
            '<svg width="16px" height="15px" viewBox="0 0 16 15" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"><title>0219-heart</title><desc>Created with Sketch.</desc><defs></defs><g id="Index-—-Presets" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage"><g id="Preset-4-—-Footer-1" sketch:type="MSArtboardGroup" transform="translate(-108.000000, -2697.000000)" fill="#FFFFFF"><g id="0219-heart-+-0-copy" sketch:type="MSLayerGroup" transform="translate(108.000000, 2696.000000)"><path d="M11.7993748,1 C10.1184373,1 8.67062483,2.38538538 8.00062484,3.83119748 C7.32906236,2.38538538 5.88124989,1 4.20031242,1 C1.88124996,1 0,2.90581446 0,5.25264907 C0,10.0276255 4.75843741,11.2795026 8.00062484,16.0003796 C11.0656248,11.3092414 15.9996872,9.87576773 15.9996872,5.25264907 C15.9996872,2.90581446 14.1187497,1 11.7993748,1 L11.7993748,1 Z" id="0219-heart" sketch:type="MSShapeGroup"></path></g></g></g></svg>'
        )[0];
        var span = document.createElement('span');
        var text = document.createElement('p');

        caption.className = instagram.captionClassName;
        text.className = 'quote';
        span.className = 'count';
        likes.className = 'likes';

        var willImageHave = instagram.doesImageHaveCaption(image);

        if (willImageHave.text) {
            text.innerHTML = image.caption.text;
        }

        if (willImageHave.likes) {
            var likesText = document.createTextNode(image.likes.count);
            span.appendChild(likesText);
        }

        likes.appendChild(span);
        likes.appendChild(heart);
        caption.appendChild(text);
        caption.appendChild(likes);
        return caption;
    },
    replaceCaption: function(index, image) {
        var target = instagram.el.$instagramContainer.children().eq(index);
        var captionSelector = '.instagrid-caption';
        var countSelector = `${captionSelector} .likes .count`;
        var quoteSelector = `${captionSelector} .quote`;
        var captionText = '';
        var likeCount = 0;
        var willImageHave = instagram.doesImageHaveCaption(image);

        if (willImageHave.text) {
            captionText = image.caption.text;
        }

        if (willImageHave.likes) {
            likeCount = image.likes.count;
        }

        target.find(quoteSelector).text(captionText);
        target.find(countSelector).text(likeCount);
    },
    replaceImage: function(index, image) {
        var nodes = instagram.el.$instagramContainer.children();
        var target = nodes.eq(index);
        var originalImg = target.find('img.photo');
        var newImg = document.createElement('img');
        var transitionCSS = `${
            instagram.transitionSpeed
        }ms ease-in-out`;
        var instagramLink = image.images.standard_resolution.url;
        var source = image.link;

        target.attr('href', source);
        newImg.src = instagramLink;
        newImg.className = 'photo';

        originalImg.css('transition', transitionCSS).css('opacity', '0');

        setTimeout(function() {
            originalImg.remove();
        }, instagram.transitionSpeed);

        $(newImg).css('position', 'absolute');
        target.children('.image-wrapper').prepend(newImg);

        instagram.replaceCaption(index, image);
    },
    updateImages: function(index) {
        if (
            instagram.imageIndex >=
            instagram.instagramImageData.length - 1
        ) {
            if (!instagram.loopAnimation) {
                return instagram.haltUpdatingImages();
            }

            instagram.imageIndex = 0;
        }
        var img =
            instagram.instagramImageData[instagram.imageIndex++];

        var duplicates = instagram.el.$instagramContainer
            .children()
            .toArray()
            .filter(function(e, i) {
                return e.href === img.link;
            });

        if (duplicates.length) {
            return;
        }

        return instagram.replaceImage(index, img);
    },
    continuallyUpdateImages: function() {
        var index = 0;

        if (
            instagram.instagramImageData.length <=
            instagram.maxImages
        ) {
            return;
        }

        instagram.updateInterval = setInterval(function() {
            if (instagram.randomize) {
                index = Math.floor(
                    Math.random() * instagram.numberOfImages + 1
                );
            }

            if (index >= instagram.numberOfImages) {
                index = 0;
            }
            instagram.updateImages(index++);
        }, instagram.refreshTime);
    },
    cacheSelectors: function() {
        instagram.el.$instagramContainer = $('#instagrid');
    }
};

export default instagram;