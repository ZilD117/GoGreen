"use strict";

jQuery(document).ready(function ($) {
  $('.accordion-title').click(function () {
    if ($(this).attr('aria-expanded') == 'false') {
      $(this).addClass('open').attr('aria-expanded', 'true');
      $(this).parent().next('.accordion-content').slideDown();
    } else {
      $(this).removeClass('open').attr('aria-expanded', 'false');
      $(this).parent().next('.accordion-content').slideUp();
    }
  });
});
"use strict";

jQuery(document).ready(function ($) {
  // Keep dropdown menu open when clicking inside of it.
  $('.dropdown-menu').on('click', function (e) {
    e.stopPropagation();
  });
});
"use strict";

jQuery(document).ready(function ($) {
  $(".carousel").on('slide.bs.carousel', function (evt) {
    $('.post-header__image-details-lg-wrapper .post-header__image-details').hide();
    var currentSlide = $(evt.relatedTarget).index();
    $('.post-header__image-details-lg-wrapper .post-header__image-details:nth-child(' + (currentSlide + 1) + ')').fadeIn();
  });
});
"use strict";

jQuery(document).ready(function ($) {
  // Remove filter when pill is clicked.
  $('.exposed-filter-pill').on('click', function (e) {
    e.preventDefault();
    $('input[value="' + $(this).attr('data-filter') + '"]').click();
    $(this).parents('.query-wrangler').find('input[value="Filter"]').click();
  }); // Clear filter form.

  $('input[value="Clear"]').click(function (e) {
    e.preventDefault();
    window.location = window.location.href.split("?")[0];
  });
  $('.query-checkbox').each(function () {
    var checkbox = $(this).children();
    var newID = checkbox.attr('value');
    $(this).children().attr('id', 'checkbox_' + newID);
    $(this).attr('for', 'checkbox_' + newID);
    checkbox.parent().before(checkbox);
  });
  $('.query-wrangler__form-mobile-toggle a').click(function (e) {
    e.preventDefault();
    $('.query-wrangler__form-mobile-wrapper').addClass('open');
    $('.query-wrangler__form-mobile-toggle').hide();
  });
  $('.query-wrangler__form-mobile-close a').click(function (e) {
    e.preventDefault();
    $('.query-wrangler__form-mobile-wrapper').removeClass('open');
    $('.query-wrangler__form-mobile-toggle').show();
  }); // Resrict dropdown height if no results are returned, consider refactoring if viewport adjustment is a concern

  if ($('.query-exposed').length > 0 && $('.query-empty').length > 0) {
    var wrapperOuterHeight = $('.query-news-wrapper').outerHeight(true);
    var wrapperInnerHeight = $('.query-news-wrapper').height();
    var formPadding = parseFloat($('.query-wrangler__form').css('padding-bottom')) - 8;
    var maxHeight = "".concat(wrapperOuterHeight - wrapperInnerHeight + formPadding, "px");
    $('.query-exposed .dropdown-menu').css('max-height', maxHeight);
  }
});
"use strict";

jQuery(document).ready(function ($) {
  $('.frm_checkbox label').each(function () {
    var checkbox = $(this).children();
    checkbox.parent().before(checkbox);
  });
  $('.frm_radio label').each(function () {
    var radio = $(this).children();
    radio.parent().before(radio);
  });
});
"use strict";

jQuery(document).ready(function ($) {
  if ($('#statistic').length) {
    var highLevelWaypoint = new Waypoint({
      element: document.getElementById('statistic'),
      handler: function handler(direction) {
        if (direction == 'down') {
          $('.high-level-page__statistics').addClass('scrolled-to');
        }
      },
      offset: '400'
    });
  }
});
"use strict";

jQuery(document).ready(function ($) {
  if ($('#difference').length) {
    var homepageWaypoint = new Waypoint({
      element: document.getElementById('difference'),
      handler: function handler(direction) {
        if (direction == 'down') {
          $('.homepage__statistic').addClass('scrolled-to');
        }
      },
      offset: '200'
    });
  }
});
"use strict";

jQuery(document).ready(function ($) {
  var lastScrollTop = 0;
  $(window).scroll(function (event) {
    var st = $(this).scrollTop();

    if (st > lastScrollTop && $(document).scrollTop() > 60) {
      $('header').addClass('scroll');
      $('.utility-navigation').fadeOut('fast');
    } else {
      $('header').removeClass('scroll');
      $('.utility-navigation').fadeIn('fast');
    }

    if ($(document).scrollTop() > 60) {
      $('header').addClass('home-blue');
    } else {
      $('header').removeClass('home-blue');
    }

    lastScrollTop = st;
  });
  /**
   * Calculate if flyout menus fall outside allowed area
   *
   * @param {Object} el - jQuery object of a <ul> menu list
   */

  function menuOverflowCalc(el) {
    var elLeft = el.offset().left;
    var elWidth = el.width();
    var allowedSpace = $('.header').width() - 10;
    var isFullyVisible = elLeft + elWidth <= allowedSpace;

    if (!isFullyVisible) {
      el.addClass('overflow');
    }
  } // Close nav when esc key is pressed


  $('#main-nav').on('keyup', function (e) {
    if (e.keyCode === 27) {
      $('li.has-submenu').children('button').attr('aria-expanded', 'false');
      $('li.has-submenu').removeClass('open');
      $('.desktop-nav .has-submenu ul').removeClass('overflow');
    }
  }); // Close nav when esc key is pressed

  $('#internal-nav').on('keyup', function (e) {
    if (e.keyCode === 27) {
      $('li.has-submenu').children('button').attr('aria-expanded', 'false');
      $('li.has-submenu').removeClass('open');
      $('.desktop-nav .has-submenu ul').removeClass('overflow');
    }
  }); // Open/close nav on toggle button click

  $('.desktop-nav li.has-submenu button').click(function () {
    if ($(this).parent().hasClass('open')) {
      $(this).attr('aria-expanded', 'false');
      $(this).parent().removeClass('open');
      $('.desktop-nav .has-submenu ul').removeClass('overflow');
    } else {
      $(this).attr('aria-expanded', 'true');
      $(this).parent().addClass('open');
      menuOverflowCalc($(this).siblings('ul'));
    }
  }); // Close nav off hover

  $('.desktop-nav li.has-submenu').on('mouseleave', function () {
    $(this).children('button').attr('aria-expanded', 'false');
    $(this).removeClass('open');
    $('.desktop-nav .has-submenu ul').removeClass('overflow');
  }); // Open nav on hover

  $('.desktop-nav li.has-submenu').on('mouseenter', function () {
    $(this).children('button').attr('aria-expanded', 'true');
    $(this).addClass('open');
    menuOverflowCalc($(this).children('ul'));
  }); // Close nav after last focusable item (<a> or <button>) has been tabbed past

  $('#main-nav').on('keydown', 'li:not(.level-1) > a, li:not(.level-1) > button', function (e) {
    if (e.keyCode === 9) {
      // If tabbing
      if (e.shiftKey === true) {
        // If shift key is down stop
        return true;
      } // Detect last relevant element that's visible


      var lastEl = $(this).parents('.has-submenu.level-1').find('a:visible, button:visible').last(); // console.log('This', $(this)[ 0 ]);
      // console.log('Last', lastEl[ 0 ]);

      if ($(this)[0] === lastEl[0]) {
        // Close entire dropdpwn if last element
        $(this).parents('.has-submenu.level-1').removeClass('open').find('.has-submenu').removeClass('open');
        $(this).parents('.has-submenu.level-1').find('button').attr('aria-expanded', 'false');
        $('.desktop-nav .has-submenu ul').removeClass('edge');
      } else if ($(this).parent().hasClass('level-3') && $(this).parent().is(':last-child')) {
        // Close only parent dropdown if not last element
        $(this).parents('.has-submenu.level-2').removeClass('open').children('button').attr('aria-expanded', 'false');
        $('.desktop-nav .has-submenu ul').removeClass('edge');
      }
    }
  }); // Close nav after 1st or 2nd level toggle button has been reversed tabbed away from

  $('#main-nav .has-submenu > button').on('keydown', function (e) {
    if (e.keyCode === 9) {
      // If tabbing
      if (!e.shiftKey === true) {
        // If shift key is not down stop
        return true;
      }

      $(this).parent('li').removeClass('open').find('.has-submenu').removeClass('open');
      $(this).parent('li').find('button').attr('aria-expanded', 'false');
      $('.desktop-nav .has-submenu ul').removeClass('edge');
    }
  });
});
"use strict";

jQuery(document).ready(function ($) {
  $('.mobile-menu-wrapper button.caret').click(function (e) {
    e.preventDefault();

    if ($(this).attr('aria-expanded') == 'false') {
      $(this).attr('aria-expanded', 'true').next().show();
      $(this).prev().addClass('menu-open');
    } else {
      $(this).attr('aria-expanded', 'false').next().hide();
      $(this).prev().removeClass('menu-open');
    }
  });
  $('#navbar-toggler').click(function (e) {
    if ($(this).attr('aria-expanded') == 'true') {
      $('#mobile-navigation').removeClass('show');
      $(this).attr('aria-expanded', false);
      $('html').removeClass('noscroll');
      $('body').removeClass('noscroll');
    } else {
      $('#mobile-navigation').addClass('show');
      $(this).attr('aria-expanded', true);
      $('html').addClass('noscroll');
      $('body').addClass('noscroll');
    }
  });
  $('.header__wrapper').on('keyup', function (e) {
    if (e.keyCode === 27 && $('#navbar-toggler').attr('aria-expanded') == 'true') {
      $('#mobile-navigation').removeClass('show');
      $('#navbar-toggler').attr('aria-expanded', false);
      $('html').removeClass('noscroll');
      $('body').removeClass('noscroll');
    }
  });
});
"use strict";

jQuery(document).ready(function ($) {
  function bgSwap() {
    // define panel and media queries
    var panel = $('[data-imgbg]'),
        hiDPI = 'screen and (min-resolution: 2dppx), screen and (-webkit-min-device-pixel-ratio: 2), screen and (min--moz-device-pixel-ratio: 2), screen and (min-resolution: 250dpi)',
        mobile = '(max-width: 539px)',
        mobileHiDPI = 'screen and ' + mobile + ' and (min-resolution: 2dppx), screen and ' + mobile + ' and (-webkit-min-device-pixel-ratio: 2), screen and ' + mobile + ' and (min--moz-device-pixel-ratio: 2), screen and ' + mobile + ' and (min-resolution: 250dpi)',
        narrow = '(min-width: 540px) and (max-width: 719px)',
        narrowHiDPI = 'screen and ' + narrow + ' and (min-resolution: 2dppx), screen and ' + narrow + ' and (-webkit-min-device-pixel-ratio: 2), screen and ' + narrow + ' and (min--moz-device-pixel-ratio: 2), screen and ' + narrow + ' and (min-resolution: 250dpi)',
        wide = '(min-width: 720px) and (max-width: 959px)',
        wideHiDPI = 'screen and ' + wide + ' and (min-resolution: 2dppx), screen and ' + wide + ' and (-webkit-min-device-pixel-ratio: 2), screen and ' + wide + ' and (min--moz-device-pixel-ratio: 2), screen and ' + wide + ' and (min-resolution: 250dpi)',
        xWide = '(min-width: 960px) and (max-width: 1279px)',
        xWideHiDPI = 'screen and ' + xWide + ' and (min-resolution: 2dppx), screen and ' + xWide + ' and (-webkit-min-device-pixel-ratio: 2), screen and ' + xWide + ' and (min--moz-device-pixel-ratio: 2), screen and ' + xWide + ' and (min-resolution: 250dpi)',
        xxWide = '(min-width: 1280px)',
        xxWideHiDPI = 'screen and ' + xxWide + ' and (min-resolution: 2dppx), screen and ' + xxWide + ' and (-webkit-min-device-pixel-ratio: 2), screen and ' + xxWide + ' and (min--moz-device-pixel-ratio: 2), screen and ' + xxWide + ' and (min-resolution: 250dpi)'; // loop through available panels

    panel.each(function () {
      // grab images
      var thisMobileImg = $(this).data('imgbg-mobile'),
          thisMobileImg2x = $(this).data('imgbg-mobile2x'),
          thisNarrowImg = $(this).data('imgbg-narrow'),
          thisNarrowImg2x = $(this).data('imgbg-narrow2x'),
          thisWideImg = $(this).data('imgbg-wide'),
          thisWideImg2x = $(this).data('imgbg-wide2x'),
          thisXWideImg = $(this).data('imgbg-xwide'),
          thisXWideImg2x = $(this).data('imgbg-xwide2x'),
          thisXXWideImg = $(this).data('imgbg-xxwide'),
          thisXXWideImg2x = $(this).data('imgbg-xxwide2x'),
          thisPanel = $(this);

      function replaceImg(img) {
        thisPanel.css('background-image', 'url("' + img + '")');
      } // run enquire against media queries


      enquire.register('screen and ' + mobile, {
        match: function match() {
          replaceImg(thisMobileImg);
        }
      }).register(hiDPI, {
        match: function match() {
          replaceImg(thisMobileImg2x);
        }
      }).register('screen and ' + narrow, {
        match: function match() {
          replaceImg(thisNarrowImg);
        }
      }).register(narrowHiDPI, {
        match: function match() {
          replaceImg(thisNarrowImg2x);
        }
      }).register('screen and ' + wide, {
        match: function match() {
          replaceImg(thisWideImg);
        }
      }).register(wideHiDPI, {
        match: function match() {
          replaceImg(thisWideImg2x);
        }
      }).register('screen and ' + xWide, {
        match: function match() {
          replaceImg(thisXWideImg);
        }
      }).register(xWideHiDPI, {
        match: function match() {
          replaceImg(thisXWideImg2x);
        }
      }).register('screen and ' + xxWide, {
        match: function match() {
          replaceImg(thisXXWideImg);
        }
      }).register(xxWideHiDPI, {
        match: function match() {
          replaceImg(thisXXWideImg2x);
        }
      });
    });
  }

  bgSwap();
});
"use strict";

jQuery(document).ready(function ($) {
  if (window.location.hash && $(window.location.hash).length) {
    // Open accordion
    if ($(window.location.hash).attr('class') === 'wp-block-opus-core-block-rewrite-oa') {
      var accordionTitle = $(window.location.hash).find($('.accordion-title'));

      if (accordionTitle.attr('aria-expanded') === 'false') {
        accordionTitle.click();
      }
    } // Get header height


    var header = document.querySelector('.header');
    var headerHeight = header.clientHeight; // Animate scroll

    $('html, body').animate({
      scrollTop: $(window.location.hash).offset().top - headerHeight
    }, 600);
  }

  $('a[href^="#"]').not('[href="#content"]').not('[href="#"]').not('[href="#0"]').not('[href="#header-carousel"]').click(function (e) {
    e.preventDefault();
    var target = $(this).attr('href');

    if ($(target).length) {
      // Open accordion
      if ($(target).attr('class') === 'wp-block-opus-core-block-rewrite-oa') {
        var _accordionTitle = $(target).find($('.accordion-title'));

        if (_accordionTitle.attr('aria-expanded') === 'false') {
          _accordionTitle.click();
        }
      } // Get header height


      var _header = document.querySelector('.header');

      var _headerHeight = _header.clientHeight; // Animate scroll

      $('html, body').animate({
        scrollTop: $(target).offset().top - _headerHeight
      }, 600);
    }
  });
});
"use strict";

jQuery.fn.blindRightToggle = function (duration, easing, complete) {
  return this.animate({
    marginRight: 0
  }, jQuery.speed(duration, easing, complete));
};

jQuery(document).ready(function ($) {
  // toggle search form
  $("#search-form-toggle").click(function () {
    $(this).attr("aria-expanded", "true");
    $(this).toggle();
    $(".utility-navigation .searchform").toggleClass('active');
    $(".utility-navigation input[type='text']").blindRightToggle();
    setTimeout(function () {
      $(".utility-navigation input[type='text']").focus();
    }, 400);
  });
  $("#search-form-toggle-mobile").click(function () {
    $(this).attr("aria-expanded", "true");
    $(this).toggle();
    $(".navbar-nav.mobile-menu .searchform").toggleClass('active');
    $(".navbar-nav.mobile-menu input[type='text']").blindRightToggle();
    setTimeout(function () {
      $(".utility-navigation input[type='text']").focus();
    }, 400);
  });
});
"use strict";

/**
 * File skip-link-focus-fix.js.
 *
 * Helps with accessibility for keyboard only users.
 *
 * Learn more: https://git.io/vWdr2
 */
(function () {
  var isIe = /(trident|msie)/i.test(navigator.userAgent);

  if (isIe && document.getElementById && window.addEventListener) {
    window.addEventListener('hashchange', function () {
      var id = location.hash.substring(1),
          element;

      if (!/^[A-z0-9_-]+$/.test(id)) {
        return;
      }

      element = document.getElementById(id);

      if (element) {
        if (!/^(?:a|select|input|button|textarea)$/i.test(element.tagName)) {
          element.tabIndex = -1;
        }

        element.focus();
      }
    }, false);
  }
})();
"use strict";

jQuery(document).ready(function ($) {
  $('.wp-block-table table').each(function () {
    if ($(this).find('thead').length) {
      $(this).basictable();
    } else {
      $(this).basictable({
        header: false
      });
    }
  });
});