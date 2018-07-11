import $ from 'jquery';
/*= ===========================================================================
  Drawer modules
  - Docs http://shopify.github.io/timber/#drawers
==============================================================================*/
var Drawers = (function () {
  var Drawer = function (id, position, options) {
    var defaults = {
      close: '.js-drawer-close',
      open: '.js-drawer-open-' +id,
      openClass: 'js-drawer-open',
      dirOpenClass: 'js-drawer-open-' + id,
    };

    this.IDS = [
      'CartDrawer',
      'NavDrawer',
      'Searchbar'
    ];

    this.$nodes = {
      parent: $('body, html'),
      page: $('#PageContainer'),
      moved: $('.is-moved-by-drawer'),
      headerControl: $('.header-control' + '.' + defaults.dirOpenClass),
      background: $('.drawer__background'),
      content: $('#' + id + '.drawer__content'),
    };

    this.config = $.extend(defaults, options);
    this.position = position;
    this.id = id;

    this.$drawer = $('#' + id);

    if (!this.$drawer.length) {
      return false;
    }

    this.drawerIsOpen = $('body').hasClass('js-drawer-open-NavDrawer');
    this.init();
  };

  Drawer.prototype.init = function () {
    $(this.config.open).on('click', $.proxy(this.open, this));
    this.$drawer.find(this.config.close).on('click', $.proxy(this.close, this));

    this.$drawer.on('click',
      function (e) {
        e.stopPropagation();
      });

    $(document).on('drawer:open', this.handleDrawerOpen.bind(this));

  };

  Drawer.prototype.handleDrawerOpen = function(event, id) {
    if(this.drawerIsOpen && this.id !== id && this.IDS.includes(id)) {
      this.close();
      event.stopPropagation();
    }
  }

  Drawer.prototype.open = function (evt) {
    // Keep track if drawer was opened from a click, or called by another function
    var externalCall = false;

    // Prevent following href if link is clicked
    if (evt) {
      evt.preventDefault();
    } else {
      externalCall = true;
    }
    $(document).trigger('drawer:open', [this.id]);

    $('.js-drawer-open-' + this.id).closest('.header-control').addClass('active');

    // Without this, the drawer opens, the click event bubbles up to $nodes.page
    // which closes the drawer.
    if (evt && evt.stopPropagation) {
      evt.stopPropagation();
      // save the source of the click, we'll focus to this on close
      this.$activeSource = $(evt.currentTarget);
    }

    if (this.drawerIsOpen && !externalCall) {
      return this.close();
    }

    this.scrollPositionOnOpen = $(window).scrollTop();

    // Add is-transitioning class to moved elements on open so drawer can have
    // transition for close animation
    if(!this.$nodes) return;

    this.$nodes.moved.addClass('is-transitioning');
    this.$drawer.prepareTransition();

    this.$nodes.parent.addClass(this.config.openClass + ' ' + this.config.dirOpenClass);
    this.drawerIsOpen = true;

    Drawer.prototype.trapFocus(this.$drawer, 'drawer_focus');

    // Run function when draw opens if set
    if (this.config.onDrawerOpen && typeof (this.config.onDrawerOpen) === 'function') {
      if (!externalCall) {
        this.config.onDrawerOpen();
      }
    }

    if (this.$activeSource && this.$activeSource.attr('aria-expanded')) {
      this.$activeSource.attr('aria-expanded', 'true');
    }

    this.$nodes.page.on('click.drawer', $.proxy(function () {
      this.close();
      return false;
    }, this));


  };

  Drawer.prototype.close = function (evt) {
    if (!this.drawerIsOpen) { // don't close a closed drawer
      return;
    }

    if ($(window).width() <= 840) {
      $(window).scrollTop(this.scrollPositionOnOpen);
    }

    // deselect any focused form elements
    $(document.activeElement).trigger('blur');

    // Ensure closing transition is applied to moved elements, like the nav
    this.$nodes.moved.prepareTransition({disableExisting: true});
    this.$drawer.prepareTransition({disableExisting: true});

    this.$nodes.parent.removeClass(this.config.dirOpenClass + ' ' + this.config.openClass);

    this.drawerIsOpen = false;

    Drawer.prototype.removeTrapFocus(this.$drawer, 'drawer_focus');

    this.$nodes.page.off('.drawer');
    this.$nodes.headerControl.removeClass('active');
  };


  Drawer.prototype.trapFocus = function ($container, eventNamespace) {
    var eventName = eventNamespace ? 'focusin.' + eventNamespace : 'focusin';

    $container.attr('tabindex', '-1');

    $container.focus();

    $(document).on(eventName, function (evt) {
      if ($container[0] !== evt.target && !$container.has(evt.target).length) {
        $container.focus();
      }
    });
  };

  Drawer.prototype.removeTrapFocus = function ($container, eventNamespace) {
    var eventName = eventNamespace ? 'focusin.' + eventNamespace : 'focusin';

    $container.removeAttr('tabindex');
    $(document).off(eventName);
  };

  /**
   * This function assumes that there are only two drawers.  It returns the other drawer.
   * @return Drawer
   */
  Drawer.prototype.otherDrawer = function () {
    var output;
    ira.allDrawers.forEach(function (e) {
      if (e.id !== this.id) {
        output = e;
      }
    }.bind(this));
    return output;
  };;

  return Drawer;
})();

export default Drawers;