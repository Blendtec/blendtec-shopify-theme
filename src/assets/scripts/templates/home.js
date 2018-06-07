(function () {

  var page = {
    el: {},
    isIOS: false,
    isAndroid: false,
    $videoPlayers: null,
    init: function () {
      page.isIOS = /iPad|iPhone|iPod/.test(navigator.platform);
      page.isAndroid = /Android/i.test(navigator.userAgent);
    },
    editorReload: function (event) {
      var $section = $(event.target);
      var type = $section.attr('class').replace('shopify-section', '').trim();

      /* eslint-disable */
      switch (type) {
        case 'bt-hero':
          page.hero.init();
          break;
        case 'instagram':
          page.instagram.init();
          break;
        case 'featured-content':
          page.storyGrid.init();
          break;
        case 'review-carousel':
          page.reviewCarousel.init();
          break;
        case 'video-player':
          page.videoPlayer.init();
          break;
        default:
          break;
      }
      /* eslint-enable */
    },
    hero: {
      init: function () {
        page.hero.cacheSelectors();
        page.el.$playBtn.on('click', page.hero.showPopUp);
        $(window).on('resize', page.hero.resizeVideo);
        $(document).on('bt:intent:dismiss', page.hero.stopVideo);
        page.hero.resizeVideo();
      },
      cacheSelectors: function () {
        page.el.$videoModal = $('#video__modal');
        page.el.$playBtn = $('.btn-hero--play');
        page.el.$videoSpinner = $('#video-loading-spinner');
        page.el.$videoWrapper = $('#modal-video-wrapper');
        page.el.$videoId = $('#modal-video-frame');
      },
      startVideo: function () {
        var $videoEl = page.el.$videoId;
        var videoSrc = $videoEl.attr('src');
        $videoEl.attr('src', videoSrc += '&autoplay=1');
        $videoEl.load(function () {
          page.el.$videoSpinner.hide();
          page.el.$videoWrapper.animate(
            {
              opacity: 1,
            },
            250,
          );
        });
      },
      stopVideo: function () {
        var $videoEl = page.el.$videoId;
        var videoSrc = $videoEl.attr('src');
        $videoEl.attr('src', videoSrc.replace('&autoplay=1', ''));
        page.el.$videoWrapper.css('opacity', 0);
        page.el.$videoSpinner.show();
      },
      showPopUp: function () {
        page.el.$videoModal.addClass('show');
        page.hero.startVideo();
      },
      resizeVideo: function () {
        var $videoWrapper = page.el.$videoWrapper;
        var widthToSet = $(window).width() - 100;
        var maxWidth = 1000;

        if (widthToSet > maxWidth) {
          widthToSet = maxWidth;
        }

        var heightToSet = widthToSet * 0.5625;

        $videoWrapper.width(widthToSet);
        $videoWrapper.height(heightToSet);

      },
    },
    instagram: {
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

      init: function () {
        page.instagram.cacheSelectors();
        var accessToken = page.el.$instagramContainer.attr('data-access-token');
        page.instagram.clientId = accessToken;

        if (!page.el.$instagramContainer.length || accessToken == null || !accessToken.length) {
          return;
        }
        page.instagram.populate(accessToken);
      },
      instaGrid: {},
      authenticateWithAccessToken: function (options) {
        if (typeof options.feedType !== 'string') {
          options.feedType = 'recent';
        }


        var promise = jQuery.Deferred();
        var url = page.instagram.baseAPI + 'users/self/media/' + options.feedType + '?access_token=' + options.accessToken;

        $.ajax({
          type: 'GET',
          dataType: 'jsonp',
          data: {},
          url: url,
          success: function (response) {

            if (!response) {
              promise.reject({ code: 400, message: "No response from Instagram servers" });
            }

            if (response.meta.code === 400) {
              promise.reject(response);
            }

            if (response.meta.code === 200 || String(response.meta.code).indexOf('2') === 0) {
              page.instagram.instagramImageData = response.data;
              promise.resolve(response.data);
            }
            promise.reject(response);
          },
        });

        return promise.promise();
      },
      populate: function (accessToken) {
        return page.instagram.authenticateWithAccessToken({
          accessToken: accessToken,
          feedType: 'recent',
        })
          .then(function (images) {
            page.instagram.insertImages(images);
            page.instagram.continuallyUpdateImages();
          })
          .fail(function () {
            page.el.$instagramContainer.remove();
          });
      },
      insertImages: function (images) {
        var $exampleDiv = page.el.$instagramContainer.find('div:first').detach();
        var classes = $exampleDiv[0].className;
        var allImages = [];

        if (page.instagram.numberOfImages > images.length) {
          page.instagram.numberOfImages = images.length;
        }

        images.forEach(function (image, i) {
          if (i >= page.instagram.maxImages) return;

          var div = document.createElement('div');
          var src = image.images.standard_resolution.url;
          var imgWrapper = document.createElement('span');
          var img = document.createElement('img');
          var link = document.createElement('a');

          var spacer = document.createElement('div');
          spacer.className = 'spacer'

          img.src = src;
          img.className = 'photo';
          div.className = classes;
          imgWrapper.className = 'image-wrapper';

          link.href = image.link;
          imgWrapper.appendChild(img);
          div.appendChild(imgWrapper);
          page.instagram.createAndAppendCaption(image, div);
          div.appendChild(link);

          allImages.push(div);
        });
        page.el.$instagramContainer.append(allImages);
      },
      doesImageHaveCaption: function (image) {
        var likes = (!_.isNull(image.likes) && typeof image.likes.count === 'number')
        var text = (!_.isNull(image.caption) && typeof image.caption.text === 'string')

        if (!text && !likes) {
          return false;
        }

        return { text: text, likes: likes }
      },
      getUserID: function (userName) {
        var url = page.instagram.baseAPI + 'users/search?q=' + userName + '&client_id=' + page.instagram.clientID;

        url += '&callback=callbackFunction'; //make it a JSONP request
        var promise = jQuery.Deferred();

        $.ajax({
          'type': 'GET',
          dataType: 'jsonp',
          data: {},
          url: url,
          success: function (data) {
            if (typeof data.data === "undefined") {
              return promise.reject(data.meta);
            }
            var target = data.data.filter(function (e) {
              return e.username === userName;
            });
            promise.resolve(target[0].id);
          },
        });

        return promise.promise();
      },
      haltUpdatingImages: function () {
        clearInterval(page.instagram.updateInterval);
      },
      createAndAppendCaption: function (image, target) {
        var caption = page.instagram.createCaption(image);
        return target.appendChild(caption);
      },
      createCaption: function (image) {
        var caption = document.createElement('div');
        var likes = document.createElement('p');
        var heart = $('<svg width="16px" height="15px" viewBox="0 0 16 15" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"><title>0219-heart</title><desc>Created with Sketch.</desc><defs></defs><g id="Index-—-Presets" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage"><g id="Preset-4-—-Footer-1" sketch:type="MSArtboardGroup" transform="translate(-108.000000, -2697.000000)" fill="#FFFFFF"><g id="0219-heart-+-0-copy" sketch:type="MSLayerGroup" transform="translate(108.000000, 2696.000000)"><path d="M11.7993748,1 C10.1184373,1 8.67062483,2.38538538 8.00062484,3.83119748 C7.32906236,2.38538538 5.88124989,1 4.20031242,1 C1.88124996,1 0,2.90581446 0,5.25264907 C0,10.0276255 4.75843741,11.2795026 8.00062484,16.0003796 C11.0656248,11.3092414 15.9996872,9.87576773 15.9996872,5.25264907 C15.9996872,2.90581446 14.1187497,1 11.7993748,1 L11.7993748,1 Z" id="0219-heart" sketch:type="MSShapeGroup"></path></g></g></g></svg>')[0];
        var span = document.createElement('span');
        var text = document.createElement('p');

        caption.className = page.instagram.captionClassName;
        text.className = 'quote';
        span.className = 'count';
        likes.className = 'likes';

        var willImageHave = page.instagram.doesImageHaveCaption(image);

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
      replaceCaption: function (index, image) {
        var target = page.el.$instagramContainer.children().eq(index);
        var captionSelector = '.instagrid-caption'
        var countSelector = captionSelector + ' .likes .count';
        var quoteSelector = captionSelector + ' .quote';
        var captionText = '';
        var likeCount = 0;
        var willImageHave = page.instagram.doesImageHaveCaption(image);

        if (willImageHave.text) {
          captionText = image.caption.text;
        }

        if (willImageHave.likes) {
          likeCount = image.likes.count;
        }

        target.find(quoteSelector).text(captionText);
        target.find(countSelector).text(likeCount);

      },
      replaceImage: function (index, image) {
        var nodes = page.el.$instagramContainer.children();
        var target = nodes.eq(index);
        var originalImg = target.find('img.photo');
        var newImg = document.createElement('img');
        var transitionCSS = page.instagram.transitionSpeed + 'ms ease-in-out';
        var instagramLink = image.images.standard_resolution.url;
        var source = image.link;

        target.attr('href', source);
        newImg.src = instagramLink;
        newImg.className = 'photo';

        originalImg.css('transition', transitionCSS)
          .css('opacity', '0');

        setTimeout(function () {
          originalImg.remove();
        }, page.instagram.transitionSpeed)

        $(newImg).css('position', 'absolute')
        target.children('.image-wrapper').prepend(newImg);

        page.instagram.replaceCaption(index, image);
      },
      updateImages: function (index) {
        if (page.instagram.imageIndex >= page.instagram.instagramImageData.length - 1) {

          if (!page.instagram.loopAnimation) {
            return page.instagram.haltUpdatingImages();
          }

          page.instagram.imageIndex = 0;
        }
        var img = page.instagram.instagramImageData[page.instagram.imageIndex++];


        var duplicates = page.el.$instagramContainer.children().toArray().filter(function (e, i) {
          return e.href === img.link;
        });

        if (duplicates.length) {
          return;
        }

        return page.instagram.replaceImage(index, img);
      },
      continuallyUpdateImages: function () {
        var index = 0;


        if (page.instagram.instagramImageData.length <= page.instagram.maxImages) {
          return;
        }

        page.instagram.updateInterval = setInterval(function () {
          if (page.instagram.randomize) {
            index = Math.floor(Math.random() * page.instagram.numberOfImages + 1);
          }

          if (index >= page.instagram.numberOfImages) index = 0;
          page.instagram.updateImages(index++);
        }, page.instagram.refreshTime)
      },
      cacheSelectors: function () {
        page.el.$instagramContainer = $('#instagrid');
      },
    },
    storyGrid: {
      init: function () {
        page.storyGrid.cacheSelectors();
        page.el.$featuredContent.each(function (i, el) {
          $(el).imagesLoaded(function () {
            $(el).find('.grid--story__image').each(function (idx, ele) {
              var $ele = $(ele);
              var $image = $ele.find('img');

              if (!$image.length) { return; }

              var image = $image.get(0).getBoundingClientRect();

              var aspect = image.height / image.width;

              if (aspect > 0.6) {
                $ele.addClass('aspect-wide');
              } else {
                $ele.addClass('aspect-narrow');
              }
            });
          });
        });
      },
      cacheSelectors: function () {
        page.reviewCarousel.cacheSelectors();
        page.el.$featuredContent = $('.featured-content');
      },
    },
    reviewCarousel: {
      init: function () {
        page.reviewCarousel.cacheSelectors();
        page.el.$singleItem.slick({
          dots: true,
          arrows: true,
          mobileFirst: true,
          respondTo: 'min',
          adaptiveHeight: true,
          pauseOnHover: false,
          draggable: true,
          lazyload: 'progressive',
        }).init(function () { });
      },
      cacheSelectors: function () {
        page.el.$singleItem = $('.single-item');
      },
    },
    videoPlayer: {
      init: function () {
        page.videoPlayer.cacheSelectors();
        page.$videoPlayers = page.el.$featureVideoContainer.map(function (idx, el) {
          return page.videoPlayer.Create({$container: $(el)});
        });
      },
      Create: function (cfg) {
        var supportsInlinePlayer = ('playsInline' in document.createElement('video'));
        var defaults = {};
        var config = $.extend(defaults, cfg);

        config.sectionID = config.$container.attr('data-id');

        if (config.offsetNotificationBar) {
          config.$container.addClass('offset-notification-bar');
        }

        if (page.isIOS && !supportsInlinePlayer) {
          config.$container.find('.feature-video-video').hide();
        }

      },
      cacheSelectors: function () {
        page.el.$featureVideo = $('.feature-video-video');
        page.el.$featureVideoContainer = $('.feature-video-container');
      },
      supportsInlinePlayer: false,
    },
  };

  $(document).on('bt:ready', page.init);
  $(document).on('bt:component:hero', page.hero.init);
  $(document).on('bt:component:instagram', page.instagram.init);
  $(document).on('bt:component:storygrid', page.storyGrid.init);
  $(document).on('bt:component:review-carousel', page.reviewCarousel.init);
  $(document).on('bt:component:video-player', page.videoPlayer.init);
  $(document).on('shopify:section:load', page.editorReload);
})();
