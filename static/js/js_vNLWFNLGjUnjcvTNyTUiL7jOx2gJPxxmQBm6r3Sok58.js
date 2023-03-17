/* ========================================================================
 * Bootstrap: affix.js v3.3.5
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)

    this.$target = $(this.options.target)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element     = $(element)
    this.affixed      = null
    this.unpin        = null
    this.pinnedOffset = null

    this.checkPosition()
  }

  Affix.VERSION  = '3.3.5'

  Affix.RESET    = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0,
    target: window
  }

  Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
    var scrollTop    = this.$target.scrollTop()
    var position     = this.$element.offset()
    var targetHeight = this.$target.height()

    if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false

    if (this.affixed == 'bottom') {
      if (offsetTop != null) return (scrollTop + this.unpin <= position.top) ? false : 'bottom'
      return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom'
    }

    var initializing   = this.affixed == null
    var colliderTop    = initializing ? scrollTop : position.top
    var colliderHeight = initializing ? targetHeight : height

    if (offsetTop != null && scrollTop <= offsetTop) return 'top'
    if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) return 'bottom'

    return false
  }

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset
    this.$element.removeClass(Affix.RESET).addClass('affix')
    var scrollTop = this.$target.scrollTop()
    var position  = this.$element.offset()
    return (this.pinnedOffset = position.top - scrollTop)
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var height       = this.$element.height()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom
    var scrollHeight = Math.max($(document).height(), $(document.body).height())

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

    var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom)

    if (this.affixed != affix) {
      if (this.unpin != null) this.$element.css('top', '')

      var affixType = 'affix' + (affix ? '-' + affix : '')
      var e         = $.Event(affixType + '.bs.affix')

      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      this.affixed = affix
      this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

      this.$element
        .removeClass(Affix.RESET)
        .addClass(affixType)
        .trigger(affixType.replace('affix', 'affixed') + '.bs.affix')
    }

    if (affix == 'bottom') {
      this.$element.offset({
        top: scrollHeight - height - offsetBottom
      })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.affix

  $.fn.affix             = Plugin
  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom
      if (data.offsetTop    != null) data.offset.top    = data.offsetTop

      Plugin.call($spy, data)
    })
  })

}(jQuery);
;
/* ========================================================================
 * Bootstrap: alert.js v3.3.5
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.VERSION = '3.3.5'

  Alert.TRANSITION_DURATION = 150

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.closest('.alert')
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      // detach from parent, fire event then clean up data
      $parent.detach().trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one('bsTransitionEnd', removeElement)
        .emulateTransitionEnd(Alert.TRANSITION_DURATION) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.alert

  $.fn.alert             = Plugin
  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);
;
/* ========================================================================
 * Bootstrap: button.js v3.3.5
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element  = $(element)
    this.options   = $.extend({}, Button.DEFAULTS, options)
    this.isLoading = false
  }

  Button.VERSION  = '3.3.5'

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state += 'Text'

    if (data.resetText == null) $el.data('resetText', $el[val]())

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function () {
      $el[val](data[state] == null ? this.options[state] : data[state])

      if (state == 'loadingText') {
        this.isLoading = true
        $el.addClass(d).attr(d, d)
      } else if (this.isLoading) {
        this.isLoading = false
        $el.removeClass(d).removeAttr(d)
      }
    }, this), 0)
  }

  Button.prototype.toggle = function () {
    var changed = true
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked')) changed = false
        $parent.find('.active').removeClass('active')
        this.$element.addClass('active')
      } else if ($input.prop('type') == 'checkbox') {
        if (($input.prop('checked')) !== this.$element.hasClass('active')) changed = false
        this.$element.toggleClass('active')
      }
      $input.prop('checked', this.$element.hasClass('active'))
      if (changed) $input.trigger('change')
    } else {
      this.$element.attr('aria-pressed', !this.$element.hasClass('active'))
      this.$element.toggleClass('active')
    }
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  var old = $.fn.button

  $.fn.button             = Plugin
  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document)
    .on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      var $btn = $(e.target)
      if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
      Plugin.call($btn, 'toggle')
      if (!($(e.target).is('input[type="radio"]') || $(e.target).is('input[type="checkbox"]'))) e.preventDefault()
    })
    .on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type))
    })

}(jQuery);
;
/* ========================================================================
 * Bootstrap: carousel.js v3.3.5
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      = null
    this.sliding     = null
    this.interval    = null
    this.$active     = null
    this.$items      = null

    this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this))

    this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element
      .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
      .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))
  }

  Carousel.VERSION  = '3.3.5'

  Carousel.TRANSITION_DURATION = 600

  Carousel.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true,
    keyboard: true
  }

  Carousel.prototype.keydown = function (e) {
    if (/input|textarea/i.test(e.target.tagName)) return
    switch (e.which) {
      case 37: this.prev(); break
      case 39: this.next(); break
      default: return
    }

    e.preventDefault()
  }

  Carousel.prototype.cycle = function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getItemIndex = function (item) {
    this.$items = item.parent().children('.item')
    return this.$items.index(item || this.$active)
  }

  Carousel.prototype.getItemForDirection = function (direction, active) {
    var activeIndex = this.getItemIndex(active)
    var willWrap = (direction == 'prev' && activeIndex === 0)
                || (direction == 'next' && activeIndex == (this.$items.length - 1))
    if (willWrap && !this.options.wrap) return active
    var delta = direction == 'prev' ? -1 : 1
    var itemIndex = (activeIndex + delta) % this.$items.length
    return this.$items.eq(itemIndex)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) }) // yes, "slid"
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || this.getItemForDirection(type, $active)
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var that      = this

    if ($next.hasClass('active')) return (this.sliding = false)

    var relatedTarget = $next[0]
    var slideEvent = $.Event('slide.bs.carousel', {
      relatedTarget: relatedTarget,
      direction: direction
    })
    this.$element.trigger(slideEvent)
    if (slideEvent.isDefaultPrevented()) return

    this.sliding = true

    isCycling && this.pause()

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])
      $nextIndicator && $nextIndicator.addClass('active')
    }

    var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"
    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one('bsTransitionEnd', function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () {
            that.$element.trigger(slidEvent)
          }, 0)
        })
        .emulateTransitionEnd(Carousel.TRANSITION_DURATION)
    } else {
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger(slidEvent)
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  var old = $.fn.carousel

  $.fn.carousel             = Plugin
  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  var clickHandler = function (e) {
    var href
    var $this   = $(this)
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
    if (!$target.hasClass('carousel')) return
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    Plugin.call($target, options)

    if (slideIndex) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  }

  $(document)
    .on('click.bs.carousel.data-api', '[data-slide]', clickHandler)
    .on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler)

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      Plugin.call($carousel, $carousel.data())
    })
  })

}(jQuery);
;
/* ========================================================================
 * Bootstrap: collapse.js v3.3.5
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.$trigger      = $('[data-toggle="collapse"][href="#' + element.id + '"],' +
                           '[data-toggle="collapse"][data-target="#' + element.id + '"]')
    this.transitioning = null

    if (this.options.parent) {
      this.$parent = this.getParent()
    } else {
      this.addAriaAndCollapsedClass(this.$element, this.$trigger)
    }

    if (this.options.toggle) this.toggle()
  }

  Collapse.VERSION  = '3.3.5'

  Collapse.TRANSITION_DURATION = 350

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var activesData
    var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing')

    if (actives && actives.length) {
      activesData = actives.data('bs.collapse')
      if (activesData && activesData.transitioning) return
    }

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    if (actives && actives.length) {
      Plugin.call(actives, 'hide')
      activesData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')[dimension](0)
      .attr('aria-expanded', true)

    this.$trigger
      .removeClass('collapsed')
      .attr('aria-expanded', true)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('collapse in')[dimension]('')
      this.transitioning = 0
      this.$element
        .trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse in')
      .attr('aria-expanded', false)

    this.$trigger
      .addClass('collapsed')
      .attr('aria-expanded', false)

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .removeClass('collapsing')
        .addClass('collapse')
        .trigger('hidden.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }

  Collapse.prototype.getParent = function () {
    return $(this.options.parent)
      .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
      .each($.proxy(function (i, element) {
        var $element = $(element)
        this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
      }, this))
      .end()
  }

  Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
    var isOpen = $element.hasClass('in')

    $element.attr('aria-expanded', isOpen)
    $trigger
      .toggleClass('collapsed', !isOpen)
      .attr('aria-expanded', isOpen)
  }

  function getTargetFromTrigger($trigger) {
    var href
    var target = $trigger.attr('data-target')
      || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7

    return $(target)
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.collapse

  $.fn.collapse             = Plugin
  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var $this   = $(this)

    if (!$this.attr('data-target')) e.preventDefault()

    var $target = getTargetFromTrigger($this)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()

    Plugin.call($target, option)
  })

}(jQuery);
;
/* ========================================================================
 * Bootstrap: dropdown.js v3.3.5
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle="dropdown"]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.VERSION = '3.3.5'

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }

  function clearMenus(e) {
    if (e && e.which === 3) return
    $(backdrop).remove()
    $(toggle).each(function () {
      var $this         = $(this)
      var $parent       = getParent($this)
      var relatedTarget = { relatedTarget: this }

      if (!$parent.hasClass('open')) return

      if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this.attr('aria-expanded', 'false')
      $parent.removeClass('open').trigger('hidden.bs.dropdown', relatedTarget)
    })
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $(document.createElement('div'))
          .addClass('dropdown-backdrop')
          .insertAfter($(this))
          .on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this
        .trigger('focus')
        .attr('aria-expanded', 'true')

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown', relatedTarget)
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive && e.which != 27 || isActive && e.which == 27) {
      if (e.which == 27) $parent.find(toggle).trigger('focus')
      return $this.trigger('click')
    }

    var desc = ' li:not(.disabled):visible a'
    var $items = $parent.find('.dropdown-menu' + desc)

    if (!$items.length) return

    var index = $items.index(e.target)

    if (e.which == 38 && index > 0)                 index--         // up
    if (e.which == 40 && index < $items.length - 1) index++         // down
    if (!~index)                                    index = 0

    $items.eq(index).trigger('focus')
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.dropdown

  $.fn.dropdown             = Plugin
  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown)

}(jQuery);
;
/* ========================================================================
 * Bootstrap: modal.js v3.3.5
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options             = options
    this.$body               = $(document.body)
    this.$element            = $(element)
    this.$dialog             = this.$element.find('.modal-dialog')
    this.$backdrop           = null
    this.isShown             = null
    this.originalBodyPad     = null
    this.scrollbarWidth      = 0
    this.ignoreBackdropClick = false

    if (this.options.remote) {
      this.$element
        .find('.modal-content')
        .load(this.options.remote, $.proxy(function () {
          this.$element.trigger('loaded.bs.modal')
        }, this))
    }
  }

  Modal.VERSION  = '3.3.5'

  Modal.TRANSITION_DURATION = 300
  Modal.BACKDROP_TRANSITION_DURATION = 150

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.checkScrollbar()
    this.setScrollbar()
    this.$body.addClass('modal-open')

    this.escape()
    this.resize()

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.$dialog.on('mousedown.dismiss.bs.modal', function () {
      that.$element.one('mouseup.dismiss.bs.modal', function (e) {
        if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true
      })
    })

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(that.$body) // don't move modals dom position
      }

      that.$element
        .show()
        .scrollTop(0)

      that.adjustDialog()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element.addClass('in')

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$dialog // wait for modal to slide in
          .one('bsTransitionEnd', function () {
            that.$element.trigger('focus').trigger(e)
          })
          .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
        that.$element.trigger('focus').trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()
    this.resize()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .off('click.dismiss.bs.modal')
      .off('mouseup.dismiss.bs.modal')

    this.$dialog.off('mousedown.dismiss.bs.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one('bsTransitionEnd', $.proxy(this.hideModal, this))
        .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.trigger('focus')
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keydown.dismiss.bs.modal')
    }
  }

  Modal.prototype.resize = function () {
    if (this.isShown) {
      $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this))
    } else {
      $(window).off('resize.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.$body.removeClass('modal-open')
      that.resetAdjustments()
      that.resetScrollbar()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $(document.createElement('div'))
        .addClass('modal-backdrop ' + animate)
        .appendTo(this.$body)

      this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
        if (this.ignoreBackdropClick) {
          this.ignoreBackdropClick = false
          return
        }
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus()
          : this.hide()
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one('bsTransitionEnd', callback)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      var callbackRemove = function () {
        that.removeBackdrop()
        callback && callback()
      }
      $.support.transition && this.$element.hasClass('fade') ?
        this.$backdrop
          .one('bsTransitionEnd', callbackRemove)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callbackRemove()

    } else if (callback) {
      callback()
    }
  }

  // these following methods are used to handle overflowing modals

  Modal.prototype.handleUpdate = function () {
    this.adjustDialog()
  }

  Modal.prototype.adjustDialog = function () {
    var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight

    this.$element.css({
      paddingLeft:  !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
      paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
    })
  }

  Modal.prototype.resetAdjustments = function () {
    this.$element.css({
      paddingLeft: '',
      paddingRight: ''
    })
  }

  Modal.prototype.checkScrollbar = function () {
    var fullWindowWidth = window.innerWidth
    if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
      var documentElementRect = document.documentElement.getBoundingClientRect()
      fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
    }
    this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth
    this.scrollbarWidth = this.measureScrollbar()
  }

  Modal.prototype.setScrollbar = function () {
    var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
    this.originalBodyPad = document.body.style.paddingRight || ''
    if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
  }

  Modal.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', this.originalBodyPad)
  }

  Modal.prototype.measureScrollbar = function () { // thx walsh
    var scrollDiv = document.createElement('div')
    scrollDiv.className = 'modal-scrollbar-measure'
    this.$body.append(scrollDiv)
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    this.$body[0].removeChild(scrollDiv)
    return scrollbarWidth
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  function Plugin(option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  var old = $.fn.modal

  $.fn.modal             = Plugin
  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
    var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    if ($this.is('a')) e.preventDefault()

    $target.one('show.bs.modal', function (showEvent) {
      if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
      $target.one('hidden.bs.modal', function () {
        $this.is(':visible') && $this.trigger('focus')
      })
    })
    Plugin.call($target, option, this)
  })

}(jQuery);
;
/* ========================================================================
 * Bootstrap: tooltip.js v3.3.5
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       = null
    this.options    = null
    this.enabled    = null
    this.timeout    = null
    this.hoverState = null
    this.$element   = null
    this.inState    = null

    this.init('tooltip', element, options)
  }

  Tooltip.VERSION  = '3.3.5'

  Tooltip.TRANSITION_DURATION = 150

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    }
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled   = true
    this.type      = type
    this.$element  = $(element)
    this.options   = this.getOptions(options)
    this.$viewport = this.options.viewport && $($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : (this.options.viewport.selector || this.options.viewport))
    this.inState   = { click: false, hover: false, focus: false }

    if (this.$element[0] instanceof document.constructor && !this.options.selector) {
      throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!')
    }

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusin' ? 'focus' : 'hover'] = true
    }

    if (self.tip().hasClass('in') || self.hoverState == 'in') {
      self.hoverState = 'in'
      return
    }

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.isInStateTrue = function () {
    for (var key in this.inState) {
      if (this.inState[key]) return true
    }

    return false
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusout' ? 'focus' : 'hover'] = false
    }

    if (self.isInStateTrue()) return

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0])
      if (e.isDefaultPrevented() || !inDom) return
      var that = this

      var $tip = this.tip()

      var tipId = this.getUID(this.type)

      this.setContent()
      $tip.attr('id', tipId)
      this.$element.attr('aria-describedby', tipId)

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)
        .data('bs.' + this.type, this)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)
      this.$element.trigger('inserted.bs.' + this.type)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var orgPlacement = placement
        var viewportDim = this.getPosition(this.$viewport)

        placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top'    :
                    placement == 'top'    && pos.top    - actualHeight < viewportDim.top    ? 'bottom' :
                    placement == 'right'  && pos.right  + actualWidth  > viewportDim.width  ? 'left'   :
                    placement == 'left'   && pos.left   - actualWidth  < viewportDim.left   ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)

      var complete = function () {
        var prevHoverState = that.hoverState
        that.$element.trigger('shown.bs.' + that.type)
        that.hoverState = null

        if (prevHoverState == 'out') that.leave(that)
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        $tip
          .one('bsTransitionEnd', complete)
          .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
        complete()
    }
  }

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  += marginTop
    offset.left += marginLeft

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function (props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        })
      }
    }, offset), 0)

    $tip.addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

    if (delta.left) offset.left += delta.left
    else offset.top += delta.top

    var isVertical          = /top|bottom/.test(placement)
    var arrowDelta          = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
    var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'

    $tip.offset(offset)
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
  }

  Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
    this.arrow()
      .css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
      .css(isVertical ? 'top' : 'left', '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function (callback) {
    var that = this
    var $tip = $(this.$tip)
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
      that.$element
        .removeAttr('aria-describedby')
        .trigger('hidden.bs.' + that.type)
      callback && callback()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && $tip.hasClass('fade') ?
      $tip
        .one('bsTransitionEnd', complete)
        .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
      complete()

    this.hoverState = null

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof $e.attr('data-original-title') != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function ($element) {
    $element   = $element || this.$element

    var el     = $element[0]
    var isBody = el.tagName == 'BODY'

    var elRect    = el.getBoundingClientRect()
    if (elRect.width == null) {
      // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
      elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
    }
    var elOffset  = isBody ? { top: 0, left: 0 } : $element.offset()
    var scroll    = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() }
    var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null

    return $.extend({}, elRect, scroll, outerDims, elOffset)
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width }

  }

  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = { top: 0, left: 0 }
    if (!this.$viewport) return delta

    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
    var viewportDimensions = this.getPosition(this.$viewport)

    if (/right|left/.test(placement)) {
      var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
      if (topEdgeOffset < viewportDimensions.top) { // top overflow
        delta.top = viewportDimensions.top - topEdgeOffset
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
      }
    } else {
      var leftEdgeOffset  = pos.left - viewportPadding
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth
      if (leftEdgeOffset < viewportDimensions.left) { // left overflow
        delta.left = viewportDimensions.left - leftEdgeOffset
      } else if (rightEdgeOffset > viewportDimensions.right) { // right overflow
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
      }
    }

    return delta
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.getUID = function (prefix) {
    do prefix += ~~(Math.random() * 1000000)
    while (document.getElementById(prefix))
    return prefix
  }

  Tooltip.prototype.tip = function () {
    if (!this.$tip) {
      this.$tip = $(this.options.template)
      if (this.$tip.length != 1) {
        throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!')
      }
    }
    return this.$tip
  }

  Tooltip.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = this
    if (e) {
      self = $(e.currentTarget).data('bs.' + this.type)
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions())
        $(e.currentTarget).data('bs.' + this.type, self)
      }
    }

    if (e) {
      self.inState.click = !self.inState.click
      if (self.isInStateTrue()) self.enter(self)
      else self.leave(self)
    } else {
      self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
    }
  }

  Tooltip.prototype.destroy = function () {
    var that = this
    clearTimeout(this.timeout)
    this.hide(function () {
      that.$element.off('.' + that.type).removeData('bs.' + that.type)
      if (that.$tip) {
        that.$tip.detach()
      }
      that.$tip = null
      that.$arrow = null
      that.$viewport = null
    })
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tooltip

  $.fn.tooltip             = Plugin
  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);
;
/* ========================================================================
 * Bootstrap: popover.js v3.3.5
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.VERSION  = '3.3.5'

  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content').children().detach().end()[ // we use append for html objects to maintain js events
      this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
    ](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.popover

  $.fn.popover             = Plugin
  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);
;
/* ========================================================================
 * Bootstrap: scrollspy.js v3.3.5
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    this.$body          = $(document.body)
    this.$scrollElement = $(element).is(document.body) ? $(window) : $(element)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target || '') + ' .nav li > a'
    this.offsets        = []
    this.targets        = []
    this.activeTarget   = null
    this.scrollHeight   = 0

    this.$scrollElement.on('scroll.bs.scrollspy', $.proxy(this.process, this))
    this.refresh()
    this.process()
  }

  ScrollSpy.VERSION  = '3.3.5'

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.getScrollHeight = function () {
    return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
  }

  ScrollSpy.prototype.refresh = function () {
    var that          = this
    var offsetMethod  = 'offset'
    var offsetBase    = 0

    this.offsets      = []
    this.targets      = []
    this.scrollHeight = this.getScrollHeight()

    if (!$.isWindow(this.$scrollElement[0])) {
      offsetMethod = 'position'
      offsetBase   = this.$scrollElement.scrollTop()
    }

    this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#./.test(href) && $(href)

        return ($href
          && $href.length
          && $href.is(':visible')
          && [[$href[offsetMethod]().top + offsetBase, href]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        that.offsets.push(this[0])
        that.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.getScrollHeight()
    var maxScroll    = this.options.offset + scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (this.scrollHeight != scrollHeight) {
      this.refresh()
    }

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
    }

    if (activeTarget && scrollTop < offsets[0]) {
      this.activeTarget = null
      return this.clear()
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (offsets[i + 1] === undefined || scrollTop < offsets[i + 1])
        && this.activate(targets[i])
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    this.clear()

    var selector = this.selector +
      '[data-target="' + target + '"],' +
      this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length) {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate.bs.scrollspy')
  }

  ScrollSpy.prototype.clear = function () {
    $(this.selector)
      .parentsUntil(this.options.target, '.active')
      .removeClass('active')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.scrollspy

  $.fn.scrollspy             = Plugin
  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load.bs.scrollspy.data-api', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      Plugin.call($spy, $spy.data())
    })
  })

}(jQuery);
;
/* ========================================================================
 * Bootstrap: tab.js v3.3.5
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    // jscs:disable requireDollarBeforejQueryAssignment
    this.element = $(element)
    // jscs:enable requireDollarBeforejQueryAssignment
  }

  Tab.VERSION = '3.3.5'

  Tab.TRANSITION_DURATION = 150

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var $previous = $ul.find('.active:last a')
    var hideEvent = $.Event('hide.bs.tab', {
      relatedTarget: $this[0]
    })
    var showEvent = $.Event('show.bs.tab', {
      relatedTarget: $previous[0]
    })

    $previous.trigger(hideEvent)
    $this.trigger(showEvent)

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.closest('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: $this[0]
      })
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: $previous[0]
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length)

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
          .removeClass('active')
        .end()
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', false)

      element
        .addClass('active')
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', true)

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu').length) {
        element
          .closest('li.dropdown')
            .addClass('active')
          .end()
          .find('[data-toggle="tab"]')
            .attr('aria-expanded', true)
      }

      callback && callback()
    }

    $active.length && transition ?
      $active
        .one('bsTransitionEnd', next)
        .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tab

  $.fn.tab             = Plugin
  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  var clickHandler = function (e) {
    e.preventDefault()
    Plugin.call($(this), 'show')
  }

  $(document)
    .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
    .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)

}(jQuery);
;
/* ========================================================================
 * Bootstrap: transition.js v3.3.5
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false
    var $el = this
    $(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()

    if (!$.support.transition) return

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  })

}(jQuery);
;
(function($){
  "use strict";

  /**
   * Provides a primary app namespace for the site along with some utility methods
   */
  window.app = {

    // Namespace for plugin components
    components: {},

    // Global configuration vars
    config: {
      debug: true
    },

    // Methods for basic cookie manipulation
    cookie: {
      set: function(name,value,days) {
        if (days) {
          var date = new Date();
          date.setTime(date.getTime()+(days*24*60*60*1000));
          var expires = "; expires="+date.toGMTString();
        }
        else var expires = "";
        document.cookie = name+"="+value+expires+"; path=/";
      },
      get: function(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
          var c = ca[i];
          while (c.charAt(0)==' ') c = c.substring(1,c.length);
          if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
      },
      remove: function(name) {
        app.cookie.set(name,"",-1);
      }
    },

    // Signal registry (see signal() and onSignal() methods below)
    firedSignals: {},

    // Mechanism for storing global boolean flags against the DOM root for use by JS or CSS
    flag: {
      // Checks to see if a given flag is set
      isActive: function(name) {
        var flags = $('html').attr('data-flags') || '';
        flags = (flags === '') ? [] : flags.split(' ');
        return (flags.indexOf(name) !== -1);
      },

      // Adds one or more flags (space-separated names) to the global attribute
      set: function(names) {
        var flags = $('html').attr('data-flags') || '';
        flags = (flags === '') ? [] : flags.split(' ');
        names.split(' ').forEach(function(name){
          if (flags.indexOf(name) === -1) {
            flags.push(name);
          }
        });
        $('html').attr('data-flags', flags.join(' '));
      },

      // Removes the specified flag(s) from the global attribute, if present
      clear: function(names) {
        var flags = $('html').attr('data-flags') || '';
        flags = (flags === '') ? [] : flags.split(' ');
        var removeList = names.split(' ');
        flags = flags.filter(function(name){
          return (removeList.indexOf(name) === -1);
        });
        $('html').attr('data-flags', flags.join(' '));
      },

      // Removes all flags from the global attribute
      clearAll: function() {
        $('html').attr('data-flags', '');
      }
    },

    // URL query parameter lookup (refactored in from existing OP code)
    getParameterByName: function(name, url) {
      if (!url) url = window.location.href;
      name = name.replace(/[\[\]]/g, "\\$&");
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, " "));
    },

    // Log abstraction - only dumps to console if debug is set
    log: function (msg) {
      if (app.config.debug) {
        console.log(msg);
      }
    },

    // Global event bus (syntactic sugar around jQuery.on)
    on: function(){
      $(document).on.apply($(document), arguments);
    },

    // Fires the provided callback once the specified label has been registered. Useful for ensuring proper sequential
    // flows are followed during setup of various disconnected and asynchronous components.
    onSignal: function(label, callback) {
      if (app.firedSignals[label]) {
        // Signal has already fired, invoke callback immediately
        callback();
      } else {
        // Otherwise, set a one-time event handler
        $(document).one(label, callback);
      }
    },

    // Registers the provided label, causing any associated signal listeners to fire thereafter.
    signal: function(label) {
      app.firedSignals[label] = true;
      app.log(label);
      $(document).trigger(label);
    },

    // Global event bus (syntactic sugar for jQuery.trigger)
    trigger: function() {
      $(document).trigger.apply($(document), arguments);
    }
  };

  /**
   * VideoComments
   * Manages functionality for the Comments pane associated with a video asset display (standalone or GLP modes)
   */
  app.components.VideoComments = (function(){
    var plugin = {
      name: 'VideoComments'
    };

    try {

      plugin.init = function(context, settings) {
        plugin.el = $('#videoComments');

        if ($('.node-learning-track').length > 0) {
          // When we're on a learning track, comment list is not fixed-height so we'll
          // jump to the top of the list to ensure the "add new" form is seen
          plugin.el.on('click', '.addComment', function(){
            var oT = plugin.el.offset().top;
            $(document).scrollTop(oT - 150);
          });
        }

        // Wire up special behavior if the comments/transcript tabs are in the sidebar
        if ($('.region-sidebar-second .videoScroller').length > 0) {

          // Configure tab content settings on initial load
          $('.region-sidebar-second .videoScroller > .title').each(function(){
            if($(this).attr('data-target') == 'videoTranscript' && $(this).hasClass('active')){
              plugin.el.hide();
              $('a.addComment').hide();
            }
            if($(this).attr('data-target') == 'videoComments' && $(this).hasClass('active')){
              $('#videoTranscript').hide();
            }
          });

          // Setup tab click handlers
          $('.region-sidebar-second .videoScroller').on('click', '.title', function(e) {
            var target = $(this).attr('data-target');
            var currentComment = plugin.el.find('.current');
            $('.asset-animation .videoScroller .holder, .asset-video .videoScroller .holder').hide();
            plugin.el.show();
            $('.videoScroller .title').removeClass('active');
            $(this).addClass('active');

            if (target == 'videoComments') {
              $('#videoTranscript').hide();
              $('.addCommentForm').hide();
              $('a.addComment').show();
              if (currentComment.length > 0) {
                plugin.el.animate(
                  { scrollTop: plugin.el.scrollTop() + currentComment.position().top },
                  '1000',
                  'swing'
                );
              }
            } else {
              $('#videoTranscript').show();
              $('a.addComment').hide();
              plugin.el.hide();
            }
          });

        }

        if (window.location.hash && plugin.el.find(window.location.hash).length > 0) {
          plugin.setActive(window.location.hash);
        }


        $('.videoScroller .addComment, #block-op-groups-groups-questions .addComment, .addComment', context).on('click', function(e) {
          e.preventDefault();
          $(this).hide(); // hide the button
          plugin.el.find('.addCommentForm').slideDown();
        });

        plugin.el.on('click', '.alert .close', plugin.onAlertClose);
        plugin.el.on('click', '.closeComments', plugin.onCommentFormClose);
        plugin.el.on('click', '.comment a.time', plugin.onTimeStampClick);
        app.on('VideoController::positionUpdated', plugin.onVideoPositionUpdate);

        // If there are comments with a timestamp of 0 seconds, set them as current on initial page load
        plugin.onVideoPositionUpdate(null, 0);

        app.signal(plugin.name+':INIT_COMPLETE');
      };

      plugin.onAlertClose = function(e){
        plugin.el.find('.comment').show();
        plugin.el.find('.addCommentForm').slideUp();
      };

      plugin.onCommentFormClose = function(e) {
        e.preventDefault();
        plugin.el.find('.comment').show();
        plugin.el.find('.addCommentForm').slideUp();
        $('.addComment').show();
        plugin.el.find('.addCommentForm textarea').val('');
      };

      // When a comment timestamp link is clicked, broadcast the timestamp value for consumption by the video controller.
      plugin.onTimeStampClick = function(e) {
        e.preventDefault(0);
        var aTag = $(this);
        plugin.el.find('.comment').removeClass('current');
        var timestamp = Math.round(aTag.parent('.comment').addClass('current').data('timestamp'));
        app.trigger('VideoController::seekTo', [timestamp]);
      };

      plugin.onVideoPositionUpdate = function(e, timestamp) {
        var target = plugin.el.find('[data-timestamp="'+ timestamp +'"]');
        if (target.length > 0) {
          plugin.setActive(target);
        }
      };

      plugin.setActive = function(ref) {
        var target = (typeof ref === 'string') ? plugin.el.find(ref) : ref;
        plugin.el.find('.comment').removeClass('current');
        target.addClass('current');
        if (!$('body').hasClass('node-type-learning-track'))  {
          plugin.scrollTo(target);
        }
      };

      plugin.scrollTo = function(ref) {
        var target = (typeof ref === 'string') ? plugin.el.find(ref) : ref;
        var scrollDistance = plugin.el.offset().top - 70;
        $("html, body").animate({ scrollTop: scrollDistance }, "slow", function() {
          plugin.el.animate({scrollTop: plugin.el.scrollTop() + target.position().top}, '1000', 'swing');
        });
      };

      Drupal.behaviors.op_video_comments = {
        attach: plugin.init
      };

    } catch (ex) {
      app.log("Error initializing plugin '"+ plugin.name + "': " + ex);
      plugin.INIT_ERROR = ex;
    }
    return plugin;

  })();

  /**
   * VideoController
   * Provides unified API for interacting with the video player in use (whether JW or YouTube, etc.)
   */
  app.components.VideoController = (function(){

    var plugin = {
      name: 'VideoController'
    };

    try {

      // Binds the Video Controller to the outer wrapper element
      plugin.init = function(context, settings) {
        plugin.el = $('.videoWrapper');
        plugin.el.on('change', '#chapters', plugin.onChapterSelectorChanged);
        app.signal(plugin.name+':INIT_COMPLETE');
      };

      // Fires when video playback starts, regardless of player type
      plugin.globalOnPlay = function(){
        // Increment the asset view counter
        var nid = Drupal.settings.open_pediatrics.currentNid;
        if (nid) {
          $.ajax({
            type: "POST",
            cache: false,
            url: '/count/asset/'+nid
          });
        }
      };

      // Handles change event for the chapter selection drop down list
      plugin.onChapterSelectorChanged = function (e, options) {
        // If in a learning track context, make the select list
        // do an AJAX call to refresh the page with the video
        // player at the correct chapter.
        if ($(this).hasClass('learning-track')) {
          var base = $(this).attr('id');
          options = options || {};

          if (!options.clickRecorded) {
            var element_settings = {
              url: '/learning-track/nojs/' + $(this).data('track') + '/' + $(this).data('nid') + $(this).val(),
              event: 'change',
              progress: {
                type: 'throbber'
              }
            };
            Drupal.ajax[base] = new Drupal.ajax(base, this, element_settings);
            $(e.currentTarget).trigger('change', {clickRecorded: true});
            //This code was moved from the app.onSignal('P3SDK_INIT_COMPLETE' ...
            //function inside this file because for whatever reason it was not getting
            //called when the P3SDK_INIT_COMPLETE signal was triggered after the
            //ajax call to switch chapters. This reinitializes some of the video API
            //plugins. Specifically this code was moved here to fix the timestamp on multichapter-video
            //comments in the context of GLP's.
            if (plugin.readyPoller) {
              clearInterval(plugin.readyPoller);
            }
            //We have to use an interval of 3000ms here becasue the method .setCurrentPlayer
            //Needs to be called after a bunch of other functions here. I never figured out exactly
            //which those were, but in teh future we can relocate this code to be triggered by whatever
            //it should be running directly after.
            plugin.readyPoller = setInterval(plugin.setCurrentPlayer, 3000);
          }
        } else {
          var url = $(this).val(); // get selected value
          if (url) { // require a URL
            window.location = url; // redirect
          }
          return false;
        }
      };


      // Called when the backend video player object is ready
      plugin.onPlayerReady = function(e){

        switch (p3sdk.get(0).player_type) {

          case 'youtube': {
            plugin.current.youtube_player.addEventListener('onReady', plugin.onPlayerReady);
            plugin.current.youtube_player.addEventListener('onStateChange', plugin.onYTPlayerStateChanged);
            break;
          }

          case 'jw7': {
            $('.download-video').attr('href', plugin.current.playerInstance.getPlaylistItem()['file']);
            if (jwplayer().getRenderingMode() == "html5") {
              var videoTag = $('#video');
              var speeds = new Array('2', '1.5', '1', '0.5');
              speeds.forEach(function (data) {
                //Still using the font_weight variable in case we want to change
                //the font weight for the selected speed at some point.
                var font_weight = 'normal';
                var color = '#666';
                if (data == 1) {
                  var color = '#DDD';
                }
                $('.jw-controlbar-right-group').prepend('<a class="playback-button playback' + data.replace(/\./g,'') + 'x" style="cursor: pointer; font-size: 12px; display: inline-block; padding: 5px; color: ' + color + '; font-weight: ' + font_weight + ' ">' + data + 'x</a>');
                $('.playback' + data.replace(/\./g,'') + 'x').on('click', function () {
                  $('.playback-button').css({'color': '#666'});
                  $(this).css({'color': '#FFF'});
                  jwplayer().setPlaybackRate(parseFloat(data));
                });
              });
            }
            break;
          }

        }

        app.signal(plugin.name +':PLAYER_READY');

        // Autoplay if we hit the page with a chapter in the query
        if (app.getParameterByName('chapter') !== null) {
          plugin.current.play();
        }
      };


      // Called when the backend video player has properly loaded its API
      plugin.onPlayerAPIReady = function(){

        // Configure API-specific settings and event listeners
        switch (p3sdk.get(0).player_type) {

          case 'youtube': {
            plugin.current.youtube_player.addEventListener('onReady', plugin.onPlayerReady);
            plugin.current.youtube_player.addEventListener('onStateChange', plugin.onPlayerStateChanged);
            break;
          }

          case 'jw7': {
              // Seek the player instance to the correct time, change completedInitialSeek to true ensuring this code only runs once.
              if(!Drupal.settings.bc_video_player.completedInitialSeek && Drupal.settings.bc_video_player.initialSeekTime != 0){
                plugin.current.playerInstance.seek(Drupal.settings.bc_video_player.initialSeekTime);
                Drupal.settings.bc_video_player.completedInitialSeek = true;
              }
              plugin.globalOnPlay();
            plugin.current.playerInstance.on('time', plugin.pbTick);
            plugin.onPlayerReady();
            break;

          }

        }
        app.signal(plugin.name +':PLAYER_API_READY');

      };

      // Handles state transition events for certain player APIs
      plugin.onPlayerStateChanged = function(event) {

        clearInterval(plugin.pbTickInterval);
        switch (p3sdk.get(0).player_type) {

          case 'youtube': {

            if (event.data === 1) {
              plugin.globalOnPlay();
              plugin.pbTickInterval = setInterval(function(){
                plugin.pbTick();
              }, 1000);
            }

            // If the video has ended and there's another chapter, redirect.
            if (event.data === 0 && Drupal.settings.bc_video_player.hasOwnProperty('next_chapter')) {
              plugin.switchChapter(Drupal.settings.bc_video_player.next_chapter + 1);
            }
            break;
          }

        }

      };

      // Responds to any globally triggered events requesting a playback position change (such as clicking on
      // a comment timestamp in the AssetComments widget)
      plugin.onSeekRequest = function(e, timestamp) {
        plugin.seekTo(timestamp);
        $(document).scrollTop(plugin.el.offset().top - 50);
      };

      // Fired once every second during playback. We broadcast the current playback position
      // so other widgets like the comment scroller can stay in sync.
      plugin.pbTick = function() {
        var currentTime = Math.round(plugin.current.position() / 1000);
        if (currentTime != plugin.prevTime || plugin.prevTime == 0) {
          $('.field-name-field-video-time input').val(currentTime); // Update the hidden current timestamp field if present
          plugin.prevTime = currentTime;
          app.trigger('VideoController::positionUpdated', [currentTime]);
        }
      };

      plugin.seekTo = function(timestamp){
        // Convert seconds to milliseconds
        timestamp = timestamp * 1000;
        plugin.current.seek(timestamp);
      };

      // Binds the controller to the active video player API object (YouTube or JWPlayer, etc.)
      // via the P3SDK library once the API has loaded.
      plugin.setCurrentPlayer = function() {
        if (p3sdk && p3sdk.get(0).player_ready) {
          clearInterval(plugin.readyPoller);
          plugin.current = p3sdk.get(0).player;
          plugin.onPlayerAPIReady();
        }
      };

      // For assets with multiple attached videos ("chapters"), switches to a different chapter number.
      // Chapters are indexed from 0 internally and from 1 when they are in a human-visible context -- here
      // the chapter is visible part of the URL query string so it will be internal chapter number + 1
      plugin.switchChapter = function(chapter) {
        if ($('#chapters').length > 0){
          // We're on a GLP, set the hidden field value to trigger an Ajax load of the chapter content
          $('#chapters').val('?chapter=' + (chapter)).change();
        } else {
          // Normal standalone mode; change the URL directly.
          location.href = "?chapter="+chapter;
        }
      };

      app.on('VideoController::seekTo', plugin.onSeekRequest);
      app.onSignal('P3SDK_NOT_FOUND', function(){
        app.log(plugin.name + " Error: P3SDK_NOT_FOUND");
      });
      app.onSignal('P3SDK_INIT_COMPLETE', function(){
        if (plugin.readyPoller) {
          clearInterval(plugin.readyPoller);
        }
        plugin.readyPoller = setInterval(plugin.setCurrentPlayer, 100);
      });

      Drupal.behaviors.op_video_player = {
        attach: plugin.init
      };

    } catch (ex) {
      app.log("Error initializing plugin '"+ plugin.name + "': " + ex);
      plugin.INIT_ERROR = ex;
    }
    return plugin;

  })();

  Drupal.behaviors.footer = {
    attach: function (context, settings) {
      $("a[href='#top']").on('click', function() {
        $("html, body").animate({ scrollTop: 0 }, "slow");
        return false;
      });
    }
  };

  Drupal.behaviors.certs = {
    attach: function (context, settings) {
      $(".page-myop-learning-completed .print").on('click', function(e) {
        e.preventDefault();
        $('.certificate').addClass('no-print');
        $(this).prev('.certificate').removeClass('no-print');
        window.print();
      });
    }
  };

  Drupal.behaviors.learning_track = {
    attach: function (context, settings) {
      $("#modalContent .pdm-dismiss-link").on('click', function(e) {
        $('body').removeClass('modal-open');
        $('#modalContent .close').trigger('click');
      });
      if($('.step-current').length > 0 && $('.step-selected').length < 1) {
        $('.step-current').parent('li').addClass('step-selected');
        var pos = $('.step-current').position();
        if(pos !== null && typeof pos === 'object' ) {
          $('#learning-track-itinerary-list > ul').scrollTop(pos.top - 200);
        }
      }
      $('.step a').on('click', function() {
        $('.step-selected').removeClass('step-selected');
        $('.step-current').removeClass('step-current');
        $(this).parent().addClass('step-current').parent().addClass('step-selected');
      });
      if($('.glp-grippie').length == 0){
        $('#learning-track-itinerary-list ul').append('<div class="glp-grippie"><img src="/sites/all/themes/mit_jwel_theme/images/grip-horizontal.png" alt="="></div>');
        $('#learning-track-itinerary-list ul').gripHandler({
          cursor: 'n-resize',
          gripClass: 'glp-grippie'
        });
      }
      // Reset the backdrop height/width to get accurate document size.
      $('#modalBackdrop').css('height', '').css('width', '');

      // Position code lifted from:
      // http://www.quirksmode.org/viewport/compatibility.html
      if (self.pageYOffset) { // all except Explorer
        var wt = self.pageYOffset;
      } else if (document.documentElement && document.documentElement.scrollTop) { // Explorer 6 Strict
        var wt = document.documentElement.scrollTop;
      } else if (document.body) { // all other Explorers
        var wt = document.body.scrollTop;
      }
      setTimeout(function(){
        // Get our heights
        var docHeight = $(document).height();
        var docWidth = $(document).width();
        var winHeight = $(window).height();
        var winWidth = $(window).width();
        if( docHeight < winHeight ) docHeight = winHeight;

        // Get where we should move content to
        var modalContent = $('#modalContent');
        var mdcTop = wt + ( winHeight / 2 ) - ( modalContent.outerHeight() / 2);
        var mdcLeft = ( winWidth / 2 ) - ( modalContent.outerWidth() / 2);

        // Apply the changes
        $('#modalBackdrop').css('height', docHeight + 'px').css('width', docWidth + 'px').show();
        modalContent.css('top', mdcTop + 'px').css('left', mdcLeft + 'px').show();
      },
      300);
    }
  };

  Drupal.behaviors.people = {
    attach: function (context, settings) {
      $('.online-status span').each(function() {
        if ($(this).hasClass('online')) {
          $(this).parents('.field-content').find('.video-chat').addClass('video-chat-icon');
        }
      });
    }
  };

  Drupal.behaviors.members = {
    attach: function (context, settings) {
      $('.view-id-all_members.view-display-id-page .views-row, .view-id-groups.view-display-id-block_grid .views-row, .view-id-my_colleagues.view-display-id-page_1 .views-row').hover(function() {
        $(this).find('.views-field-nothing').show();
      }, function() {
        $(this).find('.views-field-nothing').hide();
      });
    }
  };

  Drupal.behaviors.search = {
    attach: function (context, settings) {
      var keyword = $('.ds-search-extra').find('strong').text();

      $('.search-result').each(function() {
        $(this).highlight(keyword, { element: 'span', className: 'keyword'});
      })
    }
  };

  Drupal.behaviors.resources = {
    attach: function (context, settings) {
      // prevent ajax from calling any of these functions
      if (context == document) {
        $('.views-widget .collapsed .panel-body').slideUp();
        $('.views-widget .collapsible .panel-heading').append('<img src="/sites/all/themes/mit_jwel_theme/images/arrowDown.png" class="arrow" />');
        $('.views-widget .collapsible .panel-heading').on('click', function() {
          $(this).parent().find('.panel-body').slideToggle();
          $(this).parent().toggleClass('collapsed');
          $(this).parent().toggleClass('expanded');
        });

        $(document).on('change','.form-item-sort-bef-combine select',function(){
          $(this).parents('form').trigger('submit');
        });

        $('.views-widget .collapsible .panel-body').prepend('<div class="active empty"></div>');

        $(".views-widget .collapsible input[type='checkbox']").change(function() {
          $(this).parents('.form-item').toggleClass('checked');
          if ($(this).parents('.form-item').hasClass('checked')) {
            $(this).parents('.panel-body').find('.active').removeClass('empty');
            $(this).parents('.panel-body').find('.active').prepend('<div id="tag-'+$(this).attr('id')+'" data-target="'+$(this).attr('id')+'">'+$(this).parent().find('label').text()+' <a href="#" class="remove">X</a></div>');
          }
          else {
            $(this).parents('.panel-body').find('.active').find('div#tag-'+$(this).attr('id')).remove();
          }

          var screenTop = $(document).scrollTop();
          $('html, body').scrollTop(screenTop);

          return false;
        });

        $(".views-widget .collapsible input[type='checkbox']").each(function() {
          if ($(this).is(':checked')) {
            $(this).parents('.panel-body').find('.active').removeClass('empty');
            $(this).parent().addClass('checked');
            $(this).parents('.panel-body').find('.active').prepend('<div id="tag-'+$(this).attr('id')+'" data-target="'+$(this).attr('id')+'">'+$(this).parent().find('label').text()+' <a href="#" class="remove">X</a></div>');
          }
        });

        $(document).on('click', '.remove', function(e) {
          e.preventDefault();

          var target = $('#'+$(this).parent().attr('data-target'));
          var active = $(this).parents('.active');
          target.prop('checked', false);
          target.parents('.form-item').removeClass('checked');
          $(this).parent().remove();

          if (active.html() == '') {
            active.addClass('empty');
          }
        });
      }
    }
  };

  /**
   * Miscellaneous UI functionality for asset nodes and attachments
   */
  Drupal.behaviors.op_asset = {
    attach: function (context, settings) {

      $('.download-asset').on('click', function(e) {
        e.preventDefault();
        var nid = Drupal.settings.open_pediatrics.currentNid;
        var href = $(this).attr('href');

        $.ajax({
          type: "POST",
          cache: false,
          url: '/count/asset/'+nid
        }).always(function() {
          window.location = href;
        });
      });

      $('.tabNav > div').on('click', function() {
        var target = $(this).attr('data-target');
        $(this).parents('.tabHolder').find('.tabs > div').hide();
        $(this).parents('.tabHolder').find('.tabs > div#'+target).show();

        $(this).parent().find('div').removeClass('active');
        $(this).addClass('active');
      });

      $('.download .toggle').on('click', function(e) {
        e.preventDefault();
        $(this).next('ul').slideToggle();
      });

      //Mobile Menu

      //stick in the fixed 100% height behind the navbar but don't wrap it
      $('#slide-nav.navbar-inverse').after($('<div class="inverse" id="navbar-height-col"></div>'));

      $('#slide-nav.navbar-default').after($('<div id="navbar-height-col"></div>'));

      // Enter your ids or classes
      var toggler = '.navbar-toggle';
      var pagewrapper = '#page-content';
      var navigationwrapper = '.navbar-header';
      var menuwidth = '100%'; // the menu inside the slide menu itself
      var slidewidth = '80%';
      var menuneg = '-100%';
      var slideneg = '-80%';


      $("#slide-nav").on("click", toggler, function (e) {

        var selected = $(this).hasClass('slide-active');

        $('#slidemenu').stop().animate({
          left: selected ? menuneg : '0px'
        });

        $('#navbar-height-col').stop().animate({
          left: selected ? slideneg : '0px'
        });

        $(pagewrapper).stop().animate({
          left: selected ? '0px' : slidewidth
        });

        $(navigationwrapper).stop().animate({
          left: selected ? '0px' : slidewidth
        });


        $(this).toggleClass('slide-active', !selected);
        $('#slidemenu').toggleClass('slide-active');


        $('#page-content, .navbar, body, .navbar-header').toggleClass('slide-active');


      });


      var selected = '#slidemenu, #page-content, body, .navbar, .navbar-header';


      $(window).on("resize", function () {

        if ($(window).width() > 991 && $('.navbar-toggle').is(':hidden')) {
          $(selected).removeClass('slide-active');
        }


      });

      $('#slidemenu .dropdown-toggle').on('click', function(){
        if(jQuery(this).parent().is('.open')){
          location.href = jQuery(this).attr('href');
        }
      });

      $('.view-display-id-block_1 .view .show-content').on('click', function(e) {
        e.preventDefault();
        $(this).parent().parent().find('.view-content').slideToggle();
      });

    }
  };

  /**
   * Custom behavior for tabledrag in non-admin areas of the site.
   */
  Drupal.behaviors.op_tabledrag = {
    attach: function (context, settings) {
      // Hide the tabledrag "show row weights" link, but still allow it to be
      // accessed by screen reader users and users who tab through the page
      // using a keyboard.
      $(context).find('.tabledrag-toggle-weight').addClass('element-invisible').addClass('element-focusable');
    }
  };

  Drupal.behaviors.loginToboggan = {
    attach: function (context, settings) {
      $('.field-name-field-full-name').css('display','none');
      $('#edit-field-first-name-und-0-value, #edit-field-last-name-und-0-value').change(function(){
        var firstname = $('#edit-field-first-name-und-0-value').val();
        var lastname = $('#edit-field-last-name-und-0-value').val();
        $('#edit-field-full-name-und-0-value').val(firstname + ' ' + lastname);
      });
      var blackout_countries = ['Korea (North)', 'Cuba', 'Sudan', 'Syria', 'Iran'];
      $('#edit-field-office-country-und').after('<p class="error" style="background-color: #f2dede; padding: 10px; border: 1px solid #e2cece; margin-top: 5px; display: none;">We apologize but due to US Government restrictions, access to this site is not allowed from your country.</p>');
      $('#edit-field-office-country-und').change(function () {
        if ($.inArray($(this).find('option:selected').val(),blackout_countries) > -1) {
          $('#edit-submit--2').attr('disabled', 'disabled');
          $('.form-item-field-office-country-und .error').css('display','block');
        } else {
          $('.form-item-field-office-country-und .error').css('display','none');
          $('#edit-submit--2').removeAttr('disabled');
        }
      });
      setTimeout(function(){
        if($('.alert-danger').text().indexOf('Your password has not met the following requirement') > -1 || $('.alert-danger').text().indexOf('The specified passwords do not match.') > -1) {
          $('#register-link').trigger('click');
        }
      }, 500);
      $('.page-user-edit .form-item-pass-pass1').css('height','60px');
      $('.page-user-edit #edit-locale').css('display','none');
      $('.page-user-edit #edit-message-subscribe-email').css('display', 'none');
      $('.page-user-edit #edit-mimemail').css('display', 'none');
      $('.page-user-message-subscribe .tabs--secondary').css('display', 'none');
      $('.page-user-edit #edit-field-user-category').css('display', 'none');
      $('.page-user-edit #edit-field-occupation').css('display', 'none');
    }
  };

  $.fn.show_new_comment = function(cid, marker) {
    //remove the current class so that the currently highlighted comment is no longer highlighted
    $('#videoComments .comment').removeClass('current').show();

    var cForm = $('.comment-form');
    var nc = $('#videoComments .current');
    if (nc.length > 0) {
      $('#videoComments').animate({
        scrollTop: $('#videoComments').scrollTop() + nc.position().top
      }, '1000', 'swing');
    }
    $('.read_com_box').addClass('active');
    $('.write_com_box').removeClass('active');
    //hide the form for adding comments since it's been filled out and submitted already
    $('.addCommentForm').hide();
    if (cForm.length > 0) {
      cForm.get(0).reset(); // clear the form content for next use
    }
    //show the add comment button underneath the list of comments
    $('.addComment').show();
    //change to the comments tab (and deactivate other active tabs)
    $("div[data-target='videoComments']").parent().find('div').removeClass('active');
    $("div[data-target='videoComments']").addClass('active');
    // if user enters more than one comment before video advances past a pre-existing comment, make user's
    // prior comment "old"
    $('#videoComments .newComment').each(function() {
      $(this).find('.alert').remove();
      $(this).removeClass('current').removeClass('newComment');
    });
    $('#videoComments .current').addClass('newComment');
    // to properly position, go to top of videoComments, then scroll to newComment
    $('#videoComments').scrollTop(0);
    $('#videoComments').scrollTop($('.newComment').position().top);
  };

  $.fn.initP3 = function(container) {
    if (typeof p3sdk == 'undefined') {
      app.signal('P3SDK_NOT_FOUND');
      return;
    }
    p3$(".p3sdk-container", container).each(function() {
      p3sdk.init(this);
    }),
    "undefined" != typeof p3sdk_ready && p3sdk_ready(p3sdk)
  };

  $(document).on('click','.pagination .next a',function(e) {
    e.preventDefault();
    window.location.href = $(this).attr('href');
  });

  // Set equal heights on the team page.
  // Done on window.load instead of attach so heights are set after
  // images are done loading.
  $(window).load(function() {
    var tallestBox = 0;
    $('#quicktabs-container-view__op_team__page .quicktabs-views-group').each(function() {
      if($(this).height() > tallestBox) {
        tallestBox = $(this).height();
      }
    }).promise().done(function() {
      $('#quicktabs-container-view__op_team__page .quicktabs-views-group').height(tallestBox);
    });

  });



    $(document).ready(function() {

    if ($('body.page-cart').length) {
      //Hide the update cart button on the cart page
      if ($('[id=edit-submit][value="Update cart"]').length) {
        $('[id=edit-submit][value="Update cart"]').hide();
      }

      //Change the text of the second product attribute button.
      $('td.views-field-product-attributes-1 a').text('Edit');
      $('td.views-field-product-attributes-1 a').addClass('cart-edit-button');

    }

    //Stylize the Group Member checkbox on the group add user form, and add a
    //a done button to the page.
    if($('body.page-group-node-admin-people-add-user').length){
      $('input#edit-roles-6').prop('checked', true);
      $('input#edit-roles-6').attr('disabled', 'disabled');
    }

    //Turn off any autocomplete feature a browser may offer in a date/time field.
    //Intended for use on the videoconference creation form, but not restricted.
    $('input.date-clear').attr('autocomplete','off');

    //All the code below is controlling the behavior of the group discussion forums.
    if ($('body.node-type-forum').length) {

      $('div.indented').hide();
      //Only show the appropriate buttons
      $('div.indented').prev('div').find('button').css('visibility', 'visible');
      //Only show 3 replies at a time.
      //$('div.indented').children('div.forum-post').slice(0,3).show();
      //Show a reveal more button when there are more than three posts.


      $('div.indented').filter(function () {
        return ($(this).children('div.forum-post').length > 3)
      }).append('<div class="control show-more"><i>' + Drupal.t('Show More') + '</i></div> <div class="control show-less"><i>' + Drupal.t('Show Less') + '</i></div>');

      $(window).load(function () {
        //Since the indented divs are already going to be open when there is something new in them, then we have to figure out if we should show the show less button.
        $('div.indented.focus-on-tree').filter(function () {
          return ($(this).children('div.forum-post').length > 3)
        }).children('.show-less').show();
      });


      $('div.indented div.show-more').click(function () {
        var cur_shown = $(this).siblings('div.forum-post:visible').size();
        var items = $(this).siblings('div.forum-post').size();
        var show_less = $(this).siblings('div.show-less');
        var to_be_shown = cur_shown + 5;
        show_less.show();
        if (to_be_shown < items) {
          $(this).siblings('.forum-post:lt(' + to_be_shown + ')').slideDown();
        }
        else {
          $(this).siblings('.forum-post:lt(' + items + ')').slideDown();
          $(this).hide();
        }
      })

      $('div.indented div.show-less').click(function () {
        $(this).siblings('div.forum-post').not(':lt(3)').slideUp();
        $(this).hide();
        $(this).siblings('div.show-more').show();
      })

      //Deal with making comments visible imediately after they are submitted.
      $('span.focus-on').parentsUntil('div#forum-comments').css('display', 'block').addClass('focus-on-tree');
      $('div.focus-on-tree').siblings('div.forum-post').show();
      $('div.focus-on-tree').prev('div').find('span.glyphicon-chevron-right').css('visibility', 'visible').removeClass('glyphicon-chevron-right').addClass('glyphicon-chevron-down');
      $('div.focus-on-tree').next('div.show-more').hide();
      $('button#forum-collapse-button').click(function () {
        var indented = $(this).parent().parent().next('div');
        indented.children('.forum-post:lt(3)').show();
        indented.slideToggle();
        $(this).find('span.glyphicon').toggleClass('glyphicon-chevron-down');
        $(this).find('span.glyphicon').toggleClass('glyphicon-chevron-right');
      })
      $('div #forum-comments h2.comment-form').text('Add reply            ');
      $('h2.comment-form').html($('h2.comment-form').text().replace(/\s/g, '&nbsp;'));
    }
  })
})(jQuery);

function p3sdk_ready(sdk){
  app.signal('P3SDK_INIT_COMPLETE');
}
;
/**
 * gripHandler jQuery plugin
 * The jQuery plugin enables user to resize an element using a grip
 *
 * jQuery 1.7+
 *
 * @author     Pieter Hordijk <info@pieterhordijk.com>
 * @copyright  Copyright (c) 2012 Pieter Hordijk
 * @license    http://www.opensource.org/licenses/mit-license.html  MIT License
 * @version    0.10.1
 * @website    https://github.com/PeeHaa/gripHandler
 */
(function($) {
    $.fn.gripHandler = function(options) {
        var defaults = {
            cursor: 'auto',
            gripClass: 'grip-handle'
        };
        var opts = $.extend({}, defaults, options);

        return this.each(function() {
            var $this = $(this)
            $this.data('initheight', $this.height());
            var $gripHandler = $('.' + opts.gripClass, $this);
            var totalHeight = $this[0].scrollHeight + $gripHandler.height();
            var isResizing = false;
            var currentPosY;

            $gripHandler.mousedown(function(e) {
                isResizing = true;
                currentPosY = e.pageY;

                return false;
            }).css('cursor', opts.cursor);

            $gripHandler.dblclick(function() {
              if ($this.height() < totalHeight) {
                $this.height(totalHeight);
              } else {
                $this.height($this.data('initheight'));
              }
            });

            $(document).mousedown(function() {
                if (isResizing) return false;
            });

            $(document).mousemove(function(e) {
                if (!isResizing) return;

                var newHeight = $this.height() + (e.pageY - currentPosY);
                currentPosY = e.pageY;

                if (newHeight > $gripHandler.height() && newHeight < totalHeight) {
                    $this.height(newHeight);
                }
            });

            $(document).mouseup(function() {
                isResizing = false;
            });
        });
    };
})(jQuery);;
(function($){
	$(document).ready(function() {
		//Function to show watson branding only if logged in. 
	    	if ($('body.not-logged-in').length) {
	      		$('li.watson').hide();
	      		$('a.watson').closest('div').hide();
	      		$("h3:contains('Watson')").hide();
	    	}
	});
})(jQuery);;
