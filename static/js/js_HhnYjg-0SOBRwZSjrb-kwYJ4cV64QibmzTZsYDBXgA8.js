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
      debug: false
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

    // Check if a string has white space.
    hasWhiteSpace: function(string) {
      return String(string).indexOf(' ') >= 0;
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

    // Remove white space from a string.
    removeWhiteSpace: function(string) {
      return string.replace(/\s/g,'');
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

  $(document).ready(function() {
    $('a[rel="external"]').click( function(event) {
      event.stopPropagation();
      window.open( $(this).attr('href') );
      return false;
     });  
  });

})(jQuery);;
(function($) {

/**
 * jQuery debugging helper.
 *
 * Invented for Dreditor.
 *
 * @usage
 *   $.debug(var [, name]);
 *   $variable.debug( [name] );
 */
jQuery.extend({
  debug: function () {
    // Setup debug storage in global window. We want to look into it.
    window.debug = window.debug || [];

    args = jQuery.makeArray(arguments);
    // Determine data source; this is an object for $variable.debug().
    // Also determine the identifier to store data with.
    if (typeof this == 'object') {
      var name = (args.length ? args[0] : window.debug.length);
      var data = this;
    }
    else {
      var name = (args.length > 1 ? args.pop() : window.debug.length);
      var data = args[0];
    }
    // Store data.
    window.debug[name] = data;
    // Dump data into Firebug console.
    if (typeof console != 'undefined') {
      console.log(name, data);
    }
    return this;
  }
});
// @todo Is this the right way?
jQuery.fn.debug = jQuery.debug;

})(jQuery);
;
/**
 * @file
 */


(function ($) {
  $(document).ready(function () {
    $('.btn.enrollCME').html($('#bc-learning-track-itinerary-form .form-submit').text());

    $('body').on('click', '.next', function (e) {
      e.preventDefault();
      $('#bc-learning-track-itinerary-form .form-submit').trigger('click');
    });

    //Show the add to cart form when the purchase button is clicked
    $('body').on('click', 'div.purchaseCME', function () {
      $('div.field-name-field-product-ref').slideDown();
      $('div.commerce-product-field').show();
    })

    if (document.location.href.indexOf('purchaseCME=1') > -1) {
      $('div.purchaseCME').click();
    }

    //If line item is specified in the URL then show the form automatically, but only if the
    //purchase CME button is actually on the page. This protects against the form opening if
    //the user isnt supposed to see the form.
    if ($('div.purchaseCME').length) {
      var line_item_id = getSearchParams('line_item_id');
      if (line_item_id != undefined) {
        $('div.field-name-field-product-ref').slideDown();
        $('div.commerce-product-field').show();
      }
    }

    $('body').on('click', 'div.purchaseCMEcancel', function () {
      $('div.field-name-field-product-ref').slideUp();
      $('div.commerce-product-field').hide();
    })
  });

  Drupal.behaviors.learningTrack = {
    attach: function (context, settings) {
      if ($('.asset-simulator', context).length > 0) {
        $('form#ltiAutoLaunchForm').submit();
      }

      // If there was a request to load a particular learning track step via
      // Ajax on page load, do that here by clicking the appropriate step link.
      if (Drupal.settings.bc_learning_track_autoclick_url) {
        // Apply .once() to the HTML body (rather than to the link) so that the
        // link does not accidentally get clicked again when later Ajax
        // requests on the page (for example, via the "Next" button) re-insert
        // it into the document.
        $('body').once('bc-learning-track-autoclick', function () {
          var $link = $('a[href="' + Drupal.settings.bc_learning_track_autoclick_url + '"]').first();
          if ($link.length) {
            $link.click();
            var timer = setInterval(function() {
              // Show the main page content once the step node has appeared on
              // the page.
              if ($('#node-' + Drupal.settings.bc_learning_track_autoclick_nid).length) {
                $('.js-main-content-hidden').show();
                // Once the main content has been shown, repeat the code from
                // Drupal.behaviors.learning_track (in the theme) to force the
                // itinerary to scroll to the correct location. This won't have
                // worked correctly when it ran earlier in the page load,
                // because the main content being hidden makes the position
                // calculation incorrect.
                var pos = $('.step-current').position();
                if (pos !== null && typeof pos === 'object') {
                  $('#learning-track-itinerary-list > ul').scrollTop(pos.top - 200);
                }
                clearInterval(timer);
              }
            }, 100);
          }
        });
      }
    }
  }

  function getSearchParams(k){
    var p={};
    location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(s,k,v){p[k]=v})
    return k?p[k]:p;
  }

})(jQuery);
;
(function($) {
    Drupal.behaviors.op_homepage = {
        attach: function (context, settings) {
            $("a.homepage-block-link").hover(function(){
                $(this).toggleClass('hovered');
            })

            $(window).on('load', function() {
                var largeHeight = $('.panels-flexible-region-front-1_large_image img').height();
                var smallHeight = $('.homepage-image-block-small img').height();
                console.log(smallHeight);
                console.log(largeHeight);
                $( ".block-homepage-image-small-text" ).css( "max-height", smallHeight);
                $( ".block-homepage-image-large-text" ).css( "max-height", largeHeight);
                $("panels-flexible-region-front-small_image_blocks_-inside").css('height', largeHeight);
            });


            function resizer() {
                var largeHeight = $('.panels-flexible-region-front-1_large_image img').height();
                var smallHeight = $('.homepage-image-block-small img').height();
                $( ".block-homepage-image-small-text" ).css( "max-height", smallHeight );
                $( ".block-homepage-image-large-text" ).css( "max-height", largeHeight );
            }
            $(window).on('resize', function (event) {
                //itemHeight = 350 //any different value
                resizer();
            });
        }
    };
})(jQuery);;
(function ($) {

/**
 * Adds Organic Groups GET variables to jQuery Ajax request URLs.
 */
Drupal.behaviors.ogContext = {
  attach: function (context, settings) {
    if (Drupal.settings.ogContext) {
      // The only reliable way to modify an Ajax request to add GET variables
      // seems to be to override the jQuery.ajax() function entirely. See
      // https://stackoverflow.com/questions/2332305/modifying-a-jquery-ajax-request-intercepted-via-ajaxsend
      var jQueryAjax = $.ajax;
      $.ajax = function (settings_or_url, settings) {
        // jQuery allows this function to be called as either $.ajax(settings)
        // or $.ajax(url, settings), so handle both cases here.
        if (typeof settings_or_url === 'string') {
          if (typeof settings === 'undefined') {
            settings = {};
          }
          settings.url = settings_or_url;
        }
        else {
          settings = settings_or_url;
        }

        // Modify the Ajax request URL to add the GET variable, but only if the
        // request is being made to a URL on this site.
        if (typeof settings.url !== 'undefined' && Drupal.urlIsLocal(settings.url)) {
          settings.url += settings.url.indexOf('?') >= 0 ? '&' : '?';
          settings.url += 'og_ajax_context__gid=' + Drupal.settings.ogContext.gid + '&og_ajax_context__group_type=' + Drupal.settings.ogContext.groupType;
        }

        return jQueryAjax(settings);
      };
    }
  }
};

})(jQuery);
;
