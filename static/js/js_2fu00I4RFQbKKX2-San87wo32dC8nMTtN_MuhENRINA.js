(function($) {
  Drupal.behaviors.alicanto_newsletter = {
    attach: function (context, settings) {
      $('.mailchimp-signup-subscribe-form').submit(function(){
        var image = new Image(1, 1);
        image.src = "//www.googleadservices.com/pagead/conversion/" + settings.alicanto_newsletter.mailchimp.google_id + "/?label=" + settings.alicanto_newsletter.mailchimp.google_label + "&script=0";
      });
    }
  };
})(jQuery);;
(function ($) {

  Drupal.behaviors.PDM = {
    attach : function (context) {

      $("a.pdm-dismiss-link").once('pdm-link').click(function(ev){
        ev.preventDefault();
        var wrapper = $(this).parents(".pdm-message-wrapper")
        wrapper.slideUp(300);
        var pdm_link = $(this).attr('href');
        if (Drupal.settings.uid != 0) {
          // User is logged in, hide by ajax
          if (!pdm_link.match('/#/gi')) {
            $.ajax({
              url: pdm_link
            });
          }
        }
        else {
          // User is not logged in, hide via local browser storage
          if (localStorage) {
            localStorage.setItem(wrapper.attr('id'), 'hidden');
          }
        }
        return false;
      });

      $(".messages").each(function(){
        var pdm_id = $(this).attr('id');
          if (localStorage && localStorage.getItem(pdm_id) == 'hidden') {
            $(this).hide();
          }
      });
    }
  }

  Drupal.behaviors.PDM_cluetips_attach = {
    attach : function (context) {

      var cluetip = $('.cluetip');

      cluetip.find('.pdm-dismiss-link').click(function(){
        $(this).parents('.pdm-message-wrapper').next('.tip').hide();
      });

      positionCluetips();

      function positionCluetips() {

        cluetip.each(function(){

          if ($('body').find('#' + $(this).attr('data')).length > 0) {
            $('#' + $(this).attr('data')).before($(this));
            $(this).find('.pdm-message-wrapper').once().after('<div class="tip"></div>').css({
              'margin-top' : '-' + ($(this).find('.pdm-message-wrapper').outerHeight() / 3) + 'px',
              'margin-left' : '-' + ($(this).find('.pdm-message-wrapper').outerWidth() + 20) + 'px'
            })

          }
        });
      };
    }
  }

})(jQuery);
;
(function($) {

    /*
     * Auto-growing textareas; technique ripped from Facebook
     */
    //$.fn.autogrow = function(options) {
    $.fn.autoResize = function(options) {
        
        this.filter('textarea').each(function() {
            
            var $this       = $(this),
                minHeight   = $this.height(),
                lineHeight  = $this.css('lineHeight');
            
            var shadow = $('<div></div>').css({
                position:   'absolute',
                top:        -10000,
                left:       -10000,
                width:      $(this).width(),
                fontSize:   $this.css('fontSize'),
                fontFamily: $this.css('fontFamily'),
                lineHeight: $this.css('lineHeight'),
                resize:     'none'
            }).appendTo(document.body);
            
            var update = function() {
                
                var val = this.value.replace(/</g, '&lt;')
                                    .replace(/>/g, '&gt;')
                                    .replace(/&/g, '&amp;')
                                    .replace(/\n/g, '<br/>');
                
                shadow.html(val);
                $(this).css('height', Math.max(shadow.height() + 20, minHeight));
            }
            
            $(this).change(update).keyup(update).keydown(update);
            
            update.apply(this);
            
        });
        
        return this;
        
    }
    
})(jQuery);;
(function($) {

  /**
   * Heartbeat comments object
   */
  Drupal.heartbeat = Drupal.heartbeat || {};
  Drupal.heartbeat.comments = Drupal.heartbeat.comments || {};
  Drupal.heartbeat.comments.button = null;
  Drupal.heartbeat.comments.autoGrowArea = null;
  
  /**
   * Attach behaviours to the message streams
   */
  Drupal.behaviors.heartbeatComments = {
    attach: function (context, settings) {

      // Hook into submit button for comments.      
      Drupal.heartbeatCommentButton(context);

      // Allow the comment textarea's to grow with the comment length.
      $('.heartbeat-comments .autoGrow', context).once('textarea', function () {
        
        $(this).autoResize({
          // On resize:
          onResize : function() {
            $(this).css({opacity:0.8});
          },
          // After resize:
          animateCallback : function() {
            $(this).css({opacity:1});
          },
          // Quite slow animation:
          animateDuration : 300,
          // More extra space:
          extraSpace : 0
        });
        
      });
      
    }
  };
  
  /**
   * Toggle the comment box.
   */
  Drupal.heartbeat.comments.toggleComments = function (element, uaid) {
    $(element).closest('.heartbeat-activity').find('#heartbeat-comments-wrapper-' + uaid).toggle('fast');
  };
  
  /**
   * Ajax method to load comments for an activity message (and its node).
   */
  Drupal.heartbeat.comments.load = function (uaid, node_comment, nid) {
    var url = Drupal.settings.heartbeat_comment_load_url;
    $.post(url, 
      {uaid: uaid, node_comment: node_comment, nid: nid}, 
      Drupal.heartbeat.comments.loaded, 
      'json');
  };
  
  /**
   * After ajax-load comments function.
   */
  Drupal.heartbeat.comments.loaded = function(data) {
  
    if (data.data != undefined) {
      $('#heartbeat-comments-wrapper-' + data.uaid).html(data.data);
    }
    
  };
  
  /**
   * Class heartbeatCommentButton
   * 
   * Heartbeat comment buttons for the page.
   */
  Drupal.heartbeatCommentButton = function(context) {

    /**
     * Submit handler for a comment for a heartbeat message or its node.
     */
    function commentSubmit() {
      
      var element = this;

      // If the button is set to disabled, don't do anything or if 
      // the field is blank, don't do anything.
      Drupal.heartbeat.comments.field = $(element).parents('form').find('.heartbeat-message-comment');
      if ($(element).attr("disabled") || Drupal.heartbeat.comments.field.val() == ''){
        return false;
      }

      // Throw in the throbber
      Drupal.heartbeat.comments.button = $(element);
      Drupal.heartbeat.wait(Drupal.heartbeat.comments.button, '.heartbeat-comments-wrapper');
      Drupal.heartbeat.comments.button.attr("disabled", "disabled");
      
      var formElement = $(element).parents('form');
      
      // Disable form element, uncomment the line below
      formElement.find('.heartbeat-message-comment').attr('disabled', 'disabled');
      
      var url = Drupal.settings.heartbeat_comment_post_url;
      var nid = formElement.find('.heartbeat-message-nid').val();
      var node_comment = formElement.find('.heartbeat-message-node-comment').val();
      var arr_list = $('#heartbeat-comments-list-' + formElement.find('.heartbeat-message-uaid').val());

      var args = {
        message: formElement.find('.heartbeat-message-comment').val(), 
        uaid: formElement.find('.heartbeat-message-uaid').val(), 
        nid: (nid == undefined ? 0 : nid), 
        node_comment: (node_comment == undefined ? 0 : node_comment),
        path: location.href,
        first_comment: !(arr_list.length),
        heartbeat_comment_token: formElement.find('.heartbeat-message-token').val()
      };

      // Send POST request
      $.ajax({
        type: 'POST',
        url: url, //element.href,
        data: args,
        dataType: 'json',
        success: commentSubmitted,
        error: function (xmlhttp) {
          alert('An HTTP error '+ xmlhttp.status +' occurred.\n'+ url);
          Drupal.heartbeat.doneWaiting();
          Drupal.heartbeat.comments.button.removeAttr("disabled");
        }
      });
      
      return false;

    }
    
    /**
     * Function callback after comment has been submitted.
     */
    function commentSubmitted(data) {
    
      if (data.id != undefined) {
        
        var oldest_first = Drupal.settings.heartbeat_comments_order == 'oldest_on_top';
        var list_first = Drupal.settings.heartbeat_comments_position == 'up';
        var arr_list = $('#heartbeat-comments-list-' + data.id);
        
        // If no comments have been posted yet for this activity.
        if (!(arr_list.length)) {
          
          // The created ul or div wrapper is created in PHP.
          if (list_first) {
            var new_comment = $('#heartbeat-comments-wrapper-' + data.id + ' .heartbeat-comments').prepend(data.data);
          }
          else {
            var new_comment = $('#heartbeat-comments-wrapper-' + data.id + ' .heartbeat-comments').append(data.data);
          }
          
        }
        // Add the comment to the rest.
        else {
          
          if (oldest_first) {
            // Here there is a change the "heartbeat-comment-more" is present.
            if ($('#heartbeat-comments-list-' + data.id + ' .heartbeat-comment-more').length > 0) {
              var new_comment = $('#heartbeat-comments-list-' + data.id + ' .heartbeat-comment-more').before(data.data);
            }
            else {
              var new_comment = $('#heartbeat-comments-list-' + data.id).append(data.data);
            }
          }
          else {
            var new_comment = $('#heartbeat-comments-list-' + data.id).prepend(data.data);
            
          }
          
        }
        
        $('#heartbeat-comments-wrapper-' + data.id + ' .heartbeat-comments textarea').each(function(){
          $(this).val('');
        });
        
        // Update the count of the comments.
        var button = $(data.newButton);
        $('.heartbeat-attachment-button',  $('.heartbeat-activity-' + data.id)).after(button).remove();
        
        // Reattach the behaviors for the newly added content (or list).
        Drupal.attachBehaviors(new_comment);
        Drupal.attachBehaviors(button);
        
        Drupal.heartbeat.doneWaiting();
        Drupal.heartbeat.comments.button.removeAttr("disabled");
        
        $('#heartbeat-comments-list-' + data.id).parent().parent().find('.heartbeat-message-comment').removeAttr("disabled");
        
      }
    };

    $('input.heartbeat-comment-submit:not(.heartbeat-processed)', context)
      .addClass('heartbeat-processed')
      .click(commentSubmit);
    
  };
  
})(jQuery);;
!function(e){"use strict";var t=function(t,i){this.default_opts={trigger:"hover",direction:"ltr",style:"awemenu-default",type:"standard",hoverDelay:0,sticky:!1,stickyOffset:0,stickyWhenScrollUp:!1,enableAnimation:!0,defaultDesktopAnimation:"fadeup",onePageMode:!1,onePageSettings:{offset:0,scrollSpeed:500,changeHashURL:!1},changeWindowURL:!1,defaultDesktopAnimationDuration:300,responsiveWidth:780,mobileTrigger:"click",mobileType:"standard",mobileAnimationDuration:500,customMenuBar:'<span class="amm-bar"></span>',customCloseButton:!1,dropdownDecor:!1,showArrow:!0,showMobileArrow:!0,arrows:{up:"amm-up",down:"amm-down",left:"amm-left",right:"amm-right",mobileClose:"amm-clear"},initialize:function(e){},ready:function(e){},beforeActivate:function(e,t){},activate:function(e,t){},beforeDeactivate:function(e,t){},deactivate:function(e,t){},destroy:function(e){}},this.$el=t,i.arrows=e.extend({},this.default_opts.arrows,i.arrows),i.onePageSettings=e.extend({},this.default_opts.onePageSettings,i.onePageSettings),this.options=e.extend({},this.default_opts,i),this.isFirst=!0,i.initialize&&(this.options.initialize=i.initialize),this.menuID=t.attr("id"),this.menuID||(this.menuID="awemenu-no-"+e(".awemenu-nav").index(t),t.attr("id",this.menuID)),this.validateOptions(),this.initialize()};t.prototype={constructor:t,initialize:function(){this.isMobile=-1,this.ww=0,this.stickyActivated=!1,this.menuTop=this.$el.offset().top,this.classes=[],this.initializedTrigger=!1,this.anchors=new Array,this.itemsReady=0,this.stickyReplacerID="awemenu-scticky-replacer-"+this.getMenuIndex(),this.initMenu(),this.initTrigger()},initMenu:function(){var t=this,i=this.options;if(this.addMenuClasses("awemenu-"+this.getMenuIndex()),this.addMenuClasses(i.style),"rtl"===i.direction&&this.addMenuClasses("awemenu-rtl"),!e(".awemenu-bars",this.$el).length){var s=e('<div class="awemenu-bars" />').html(i.customMenuBar);e(".awemenu",this.$el).before(s)}this.calculateStickyOffset(),e("i.awemenu-arrow",this.$el).remove(),e(window).bind("resize",e.proxy(t.windowResizeHandler,t)).trigger("resize"),e(window).bind("scroll",e.proxy(t.scrollHandler,t)).trigger("scroll"),e(document).bind("click",e.proxy(t.documentClickHandler,t)),i.initialize(this)},documentClickHandler:function(e){this.$el.trigger("documentClick",e)},scrollHandler:function(e,t){t?this.$el.trigger("windowScroll",t):this.$el.trigger("windowScroll",e)},windowResizeHandler:function(e){this.onResize(e)},setOption:function(t){"object"==e.type(t)&&(this.destroy(),this.options=e.extend({},this.options,this.validateOptions(t)),this.initialize(),this.$el.data("awe-menu",this))},getObjectProperties:function(t){var i=[];return t&&"object"==e.type(t)&&e.each(t,function(e,t){i.push(e)}),i},validateOptions:function(t){var i=this,s=this.getObjectProperties(this.default_opts);return t&&"object"===e.type(t)||(t=this.options),e.each(t,function(n,a){if(-1===!e.inArray(n,s))delete t[n];else switch(n){case"trigger":-1===e.inArray(a,["click","hover","toggle"])&&(t[n]="hover");break;case"mobileTrigger":-1===e.inArray(a,["click","toggle"])&&(t[n]="click");break;case"type":case"mobileType":-1===e.inArray(a,["standard","top","left","bottom","right","outleft","outright","fullscreen"])&&(t[n]="standard");break;case"hoverDelay":case"defaultDesktopAnimationDuration":case"mobileAnimationDuration":case"responsiveWidth":a=parseInt(a),t[n]=a,isNaN(a)&&(t[n]=i.default_opts[n]);break;case"initialize":case"ready":case"beforeActivate":case"activate":case"beforeDeactivate":case"deactivate":case"destroy":"function"!==e.type(a)&&(t[n]=i.default_opts[n]);break;case"style":""==a&&(t[n]=i.default_opts[n])}}),t&&"object"===e.type(t)||(this.options=t),t},getOption:function(e){var t=JSON.parse(JSON.stringify(this.options));return e?t[e]:t},destroy:function(){var t=this,i=this.$el.data("init-items-interval");i&&clearInterval(i),this.itemsReady=0,this.isMobile=-1,this.stickyActivated=!1,this.$el.data("awe-menu",!1),e("#"+this.stickyReplacerID).remove(),this.$el.removeClass(this.classes.join(" ")),this.classes=[],e(".awemenu-item",this.$el).unbind("mouseenter").unbind("mouseleave"),e(".awemenu-item > a",this.$el).unbind("click"),e(".awemenu-item > a > .awemenu-arrow",this.$el).unbind("click"),e(".awemenu-submenu",this.$el).each(function(){var i=e(this),s=i.data("animation")?i.data("animation"):t.options.defaultDesktopAnimation;s&&i.parent().removeClass("awemenu-"+s),i.removeAttr("style")}),this.$el.removeClass("awemenu-stickyup awemenu-scrollup awemenu-sticky"),this.$el.unbind("windowResize").unbind("documentClick").unbind("windowScroll").unbind("aweMenuReady").undelegate(".awemenu-arrow","click"),e(window).unbind("resize",this.windowResizeHandler).unbind("scroll",this.scrollHandler),e(".awemenu-bars",this.$el).unbind("click").remove(),this.options.destroy(this)},detectDevice:function(){var t=this,i=window.innerWidth,s=this.options,n=!1;this.isTouchDevice=navigator.userAgent.match(/Androi|WebOS|iPod|iPad|iPhone|Blackberry|Windows Phone/i)?!0:!1,this.isTouchDevice&&"hover"==this.options.trigger&&(this.options.trigger="click"),i<s.responsiveWidth&&"fullscreen"!==this.options.type?this.isMobile&&-1!==this.isMobile||(n=!0,this.isMobile=!0,this.addMenuClasses(["awemenu-mobile","awemenu-mobile-"+s.mobileType]),this.removeMenuClasses(["awemenu-"+s.type])):(this.isMobile||-1===this.isMobile)&&(this.isMobile=!1,n=!0,this.removeMenuClasses(["awemenu-mobile","awemenu-mobile-"+s.mobileType]),this.addMenuClasses(["awemenu-"+s.type]),"fullscreen"===s.type&&(e("ul.awemenu",t.$el).appendTo(e(".awemenu-container",t.$el)),e(".awemenu-fullscreen-wrapper",t.$el).remove())),n&&(this.isMobile&&"fullscreen"===s.mobileType||!this.isMobile&&"fullscreen"===s.type?e(".awemenu-fullscreen-wrapper",t.$el).length||(e(".awemenu-container",t.$el).append('<div class="awemenu-fullscreen-wrapper"><div class="awemenu-fullscreen-table"><div class="awemenu-fullscreen-cell"></div></div></div>'),e("ul.awemenu",t.$el).appendTo(e(".awemenu-fullscreen-cell",t.$el))):(e("ul.awemenu",t.$el).appendTo(e(".awemenu-container",t.$el)),e(".awemenu-fullscreen-wrapper",t.$el).remove()))},resetMenu:function(){var t=this;e(".awemenu-item.awemenu-active",this.$el).each(function(){t.deactivateSubMenu(e(this))}),this.$el.hasClass("awemenu-active")&&(this.isMobile||e.inArray(this.options.type,["outleft","outright"])>-1)&&(t.onMenuBarClick(),e("body").removeClass("awemenu-"+this.menuIndex+"-mobile-active"))},onMenuBarClick:function(){var t=this,i=this.options;if(this.isMobile&&e.inArray(i.mobileType,["standard","top","bottom"])>-1){e("body").toggleClass("awemenu-"+this.menuIndex+"-mobile-active");var s=e("ul.awemenu",t.$el);t.$el.hasClass("awemenu-active")?s.slideUp(i.mobileAnimationDuration,function(){t.$el.removeClass("awemenu-active")}).css("z-index",""):s.slideDown(i.mobileAnimationDuration,function(){t.$el.addClass("awemenu-active")}).css("z-index",999999)}else t.$el.toggleClass("awemenu-active")},initTrigger:function(){var t=this;this.$el.bind("aweMenuReady",function(){t.initializedTrigger||("hover"!==t.options.trigger||this.isTouchDevice||t.initTriggerHover(e(this)),t.initTriggerClick(e(this)),t.initializedTrigger=!0,t.options.ready(t))})},initTriggerHover:function(){var t=this;e("li.awemenu-item",this.$el).bind("mouseenter",function(){var i=e(this),s=i.data("hide-submenu");!t.isMobile&&t.isReady&&(i.data("hover-out",!1),s&&(clearTimeout(s),i.data("hide-submenu",!1)),e("> a",i).length&&(t.options.hoverDelay>0?setTimeout(function(){i.data("hover-out")||t.activateSubMenu(i)},t.options.hoverDelay):t.activateSubMenu(i)))}).bind("mouseleave",function(){var i=e(this);t.isMobile||(i.data("hover-out",!0),t.deactivateSubMenu(i))})},initTriggerClick:function(){var t=this,i=this.options;e("li.awemenu-item > a",this.$el).click(function(s){var n=e(this).parent();if(!t.isReady)return void s.preventDefault();if(!t.isMobile&&!t.isTouchDevice&&"hover"!==i.trigger||t.isMobile||t.isTouchDevice)if(n.hasClass("awemenu-active")){if(t.deactivateSubMenu(n),!t.isMobile&&!t.isTouchDevice&&"toggle"==i.trigger||(t.isMobile||t.isTouchDevice)&&"toggle"==i.mobileTrigger)return void s.preventDefault();t.resetMenu()}else if(e("> .awemenu-submenu",n).length)return s.preventDefault(),void t.activateSubMenu(n);t.deactivateSubMenu(e("li.awemenu-active",this.$el));var a=e(this).attr("href"),o=a.indexOf("#"),r=o>-1?a.substring(o,a.length):"",l=o>-1?a.substring(0,o):a,u=document.URL.indexOf("#")>-1?document.URL.substring(0,document.URL.indexOf("#")):document.URL;if(r&&(l==u||0===a.indexOf("#"))){s.preventDefault();var h=e(r).length?e(r).offset().top:0;e(".awemenu-anchor-active",t.$el).removeClass("awemenu-anchor-active"),t.scrollTimer&&(clearTimeout(t.scrollTimer),t.scrollTimer=!1),t.scrollByClick=!0,e("html, body").stop().animate({scrollTop:h},t.options.onePageSettings.scrollSpeed),t.scrollTimer=setTimeout(function(){t.scrollByClick=!1,t.scrollTimer=!1},t.options.onePageSettings.scrollSpeed),t.changeWindowURL(u,r),n.addClass("awemenu-anchor-active"),t.inViewportItems=n}}),e("i.awemenu-arrow",this.$el).click(function(i){var s=e(this).parents("li.awemenu-item:first");t.isMobile&&s.hasClass("awemenu-active")&&(i.preventDefault(),i.stopPropagation(),t.deactivateSubMenu(s))})},initDocumentTouch:function(){var t=this,i=!1;e(document).bind("touchstart",function(){i=!0}),e(document).bind("touchmove",function(){i=!1}),e(document).bind("touchend",function(e){i&&t.onDocumentClick(e)})},initMenuItems:function(){var t=this;this.isReady=!1;var i=!this.isMobile&&e.inArray(this.options.type,["outleft","outright","fullscreen"])>-1,s=this.isMobile&&e.inArray(this.options.mobileType,["outleft","outright"])>-1;i||s?e(".awemenu-close",this.$el).length||(e("ul.awemenu",this.$el).prepend('<span class="awemenu-close"></span>'),this.options.customCloseButton&&e(".awemenu-close",this.$el).append(this.options.customCloseButton),e(".awemenu-close",this.$el).click(function(i){i.preventDefault(),t.$el.removeClass("awemenu-active"),e("li.awemenu-active",t.$el).each(function(){t.deactivateSubMenu(e(this))})})):e(".awemenu-close",this.$el).remove(),(!this.isMobile&&this.options.showArrow||this.isMobile&&this.options.showMobileArrow)&&!e(".awemenu-arrow",this.$el).length&&e(".awemenu-item > a",this.$el).append(e('<i class="awemenu-arrow"></i>').addClass(this.options.arrows.down)),this.options.dropdownDecor&&!e(".awemenu-decor",this.$el).length&&e("ul.awemenu > li.awemenu-item > ul.awemenu-submenu",this.$el).prepend(e(this.options.dropdownDecor).addClass("awemenu-decor")),this.stickyReplacer&&(this.stickyReplacer.remove(),this.stickyReplacer=null),e(".awemenu-item > a",this.$el).css("transition","none"),this.removeMenuClasses("awemenu-animation"),e(".awemenu-submenu",this.$el).removeAttr("style").css({display:"block",opacity:0,visibility:"hidden"}),e("ul.awemenu",this.$el).removeAttr("style"),e.inArray(this.options.type,["outleft","outright"])>-1&&(e("ul.awemenu",this.$el).css({transition:"none",opacity:0,visibility:"hidden"}),this.$el.addClass("awemenu-active")),e(".awemenu-item > a",this.$el).css("transition","none"),t.itemsReady=0,t.totalItems=e("ul.awemenu-submenu",t.$el).length,e("ul.awemenu > li.awemenu-item",t.$el).each(function(){t.initMenuItem(e(this))});var n=setInterval(function(){t.itemsReady>=t.totalItems&&(clearInterval(n),t.$el.data("init-items-interval",!1),t.isFirst?(t.onResize(),t.isFirst=!1):(t.isReady=!0,e(".awemenu-submenu",t.$el).css({display:"none",opacity:"",visibility:""}),e.inArray(t.options.type,["outleft","outright"])>-1&&(t.$el.removeClass("awemenu-active"),e("ul.awemenu",t.$el).css({transition:"",opacity:"",visibility:""})),e(".awemenu-item > a",this.$el).css("transition",""),t.isMobile&&(e.inArray(t.options.mobileType,["top","bottom"])>-1||t.stickyActivated)&&t.setMenuMaxHeight(),e(".awemenu-item > a",t.$el).css("transition",""),t.$showDefaultItem&&t.$showDefaultItem.addClass("awemenu-default-item"),!t.isMobile&&t.options.enableAnimation&&"fullscreen"!==t.options.type&&t.addMenuClasses("awemenu-animation"),e("li.awemenu-item.awemenu-active-trail",this.$el).parents(".awemenu-item").addClass("awemenu-active-trail"),t.height=t.$el.height(),t.isTouchDevice&&t.initDocumentTouch(),t.initializedTrigger||(t.$el.bind("windowScroll",function(e,i){t.onScroll(i)}),t.prevScroll=e(window).scrollTop(),t.$el.bind("documentClick",function(e,i){t.onDocumentClick(i)}),e(".awemenu-bars",t.$el).click(function(e){e.preventDefault(),t.isReady&&t.onMenuBarClick()}),t.options.onePageMode&&t.initOnePageMode()),t.$el.trigger("aweMenuReady")))},100);this.$el.data("init-items-interval",n)},initMenuItem:function(t){t.removeClass("awemenu-invert");var i=e("> a",t).attr("href"),s=window.location.href,n=t.data("show-current")&&i===s;if(this.options.onePageMode&&(0===i.indexOf("#")||window.location.hash&&0===i.indexOf(window.location.host+window.location.pathname))){var a=0===i.indexOf("#")?i:window.location.hash;this.anchors.push(Array(a,t))}this.$showDefaultItem||t.parents(".awemenu-item").length||!t.data("show-default")&&!n||(this.$showDefaultItem=t),t.data("right-item")&&!e.inArray(this.options.type,["left","right","outright","outleft"])>-1&&t.addClass("awemenu-item-right"),e("> .awemenu-submenu",t).length&&t.addClass("awemenu-has-children"),this.initItemArrow(t),this.initSubMenuItem(t),this.options.enableAnimation&&this.initSubmenuAnimation(t)},initItemArrow:function(t){if((!this.isMobile&&this.options.showArrow||this.isMobile&&this.options.showMobileArrow)&&e("> .awemenu-submenu",t).length){var i,s=this.options,n=t.parents(".awemenu-item").length?!1:!0,a=e.inArray(s.type,["right","outright"])>-1,o=s.arrows.right;if(i=e("> a > .awemenu-arrow",t).removeClass().show(),this.isMobile)o=s.arrows.down;else if(a)o=s.arrows.left;else if(n)switch(s.type){case"standard":case"top":o=s.arrows.down;break;case"right":o=s.arrows.left;break;case"bottom":o=s.arrows.up}i.addClass("awemenu-arrow").addClass(o)}else e(".awemenu-arrow",t).hide()},initSubmenuAnimation:function(t){if(!this.isMobile&&"fullscreen"!==this.options.type&&e("> .awemenu-submenu",t).length){var i=e("> .awemenu-submenu",t),s=i.attr("data-animation")?i.attr("data-animation"):this.options.defaultDesktopAnimation,n=i.attr("data-duration");s&&(t.addClass("awemenu-"+s),n||(n=this.options.defaultDesktopAnimationDuration),isNaN(parseInt(n))||(n=parseInt(n)+"ms",i.css("transition-duration",n)))}},initSubMenuItem:function(t){var i=this,s=e("> .awemenu-submenu",t);if(s.length){if(this.isMobile)this.initMobileSubMenu(t);else switch(this.options.type){case"standard":case"top":case"bottom":this.initNormalSubMenu(t);break;case"left":case"outleft":case"right":case"outright":this.initEdgeSubMenu(t);break;case"fullscreen":this.initMobileSubMenu(t)}s.hasClass("awemenu-megamenu")||e("> li.awemenu-item",s).each(function(){i.initMenuItem(e(this))})}this.itemsReady++},initNormalSubMenu:function(t){var i=e(".awemenu-container",this.$el),s=e("> .awemenu-submenu",t),n=i.offset(),a=i.outerWidth(),o=t.offset(),r=this.getSubMenuWidth(s,!1),l=1==s.parents(".awemenu-item").length?!0:!1;if(l){if(r>=a)r=a,s.offset({left:n.left});else{var u=o.left,h=s.attr("data-align"),c=n.left,m=c+a,d=t.outerWidth();switch(h){case"left":u+r>m&&(u=m-r);break;case"center":u=u+d/2-r/2,c>u?u=c:u+r>m&&(u=m-r);break;case"right":u=u+d-r,0>u&&(u=0);break;default:"rtl"===this.options.direction?(u=u+d-r,c>u&&(u=c)):u+r>m&&(u=m-r)}s.offset({left:u})}this.options.dropdownDecor&&e(".awemenu-decor",s).offset({left:u+d/2-e(".awemenu-decor",s).outerWidth()/2}),s.css("width",r)}else{var w,p=this.options,f=e("> a > .awemenu-arrow",t),v=s.attr("data-orientation"),d=t.outerWidth(),u=o.left;switch(f.removeClass(p.arrows.up+" "+p.arrows.down+" "+p.arrows.left+" "+p.arrows.right+" "+p.arrows.mobileClose),this._processSubMenuVerticalAlign(t,i,!1),v){case"left":w=p.arrows.left,"ltr"===p.direction&&(t.addClass("awemenu-invert"),s.css("width",r));break;case"right":w=p.arrows.right,"rtl"===p.direction&&(t.addClass("awemenu-invert"),s.css("width",r));break;default:w=this._processDropDownSubMenu(t)}f.addClass(w)}},initEdgeSubMenu:function(t){var i=this.options,s=e(".awemenu-container",this.$el),n=e("> a > .awemenu-arrow",t);n.removeClass(i.arrows.up+" "+i.arrows.down+" "+i.arrows.left+" "+i.arrows.right+" "+i.arrows.mobileClose),this._processSubMenuVerticalAlign(t,s,!1);var a=this._processDropDownSubMenu(t);n.addClass(a)},_processDropDownSubMenu:function(t){var i,s=e(window).outerWidth(),n=this.options,a=e(".awemenu-container",this.$el),o=a.offset(),r=a.outerWidth(),l=t.offset(),u=void 0!==t.parent().data("real-width")?t.parent().data("real-width"):t.parent().outerWidth(),h=e("> .awemenu-submenu",t),c=h.hasClass("awemenu-megamenu"),m=t.parents(".awemenu-item:first").hasClass("awemenu-invert"),d=e.inArray(n.type,["left","outleft"])>-1,w=e.inArray(n.type,["right","outright"])>-1,p=this.getSubMenuWidth(h,d||w),f="rtl"===n.direction&&!m&&!d||d&&m||"ltr"===n.direction&&m||w&&!m,v=c&&!d?o.left+r:s,b=c&&!w?o.left:0,g=v-(l.left+u),y=l.left-b,M=!1;return f?(i=n.arrows.left,l.left-p<b&&(g>y?(M=!0,i=n.arrows.right,p>g&&(p=g)):p=y)):(i=n.arrows.right,l.left+u+p>v&&(y>g?(M=!0,i=n.arrows.left,p>y&&(p=y)):p=g)),h.data("real-width",p),h.css("width",p),(M&&!m||m&&!M)&&t.addClass("awemenu-invert"),i},_processSubMenuVerticalAlign:function(t,i,s){function n(){if("bottom"===l.type){var e=t.height()/2-a.height()/2;o.top+t.height()/2+a.height()/2>r&&(e=o.top+t.height()-r),a.offset({bottom:e})}}var a=e("> .awemenu-submenu",t),o=t.offset(),r=i.offset().top,l=this.options,u=a.attr("data-align")?a.attr("data-align"):!1,h=0,c=s||"bottom"==l.type?0:r+i.height();switch(u){case"top":"bottom"===l.type&&n();break;case"middle":"bottom"===l.type?n():(h=o.top+t.height()/2-a.height()/2,c>h&&(h=c-o.top),a.offset({top:h}));break;case"bottom":"bottom"!==l.type&&(h=o.top+t.height()-a.height(),c>h&&(h=c-o.top),a.offset({top:h}))}},initMobileSubMenu:function(t){var i=e("> a > .awemenu-arrow",t),s=e("> .awemenu-submenu",t),n=this.options;i.removeClass(n.arrows.up+" "+n.arrows.down+" "+n.arrows.left+" "+n.arrows.right+" "+n.arrows.mobileClose),s.length&&i.addClass(n.arrows.down)},onDocumentClick:function(t){var i=this.$el.hasClass("awemenu-active")||e(".awemenu-active",this.$el).length,s=!this.isMobile&&!e(t.target).closest("#"+this.menuID+" ul.awemenu").length&&!e(t.target).closest("#"+this.menuID+" .awemenu-bars").length,n=this.isMobile&&!e(t.target).closest("#"+this.menuID).length;i&&(s||n)&&this.resetMenu()},onResize:function(t){var i=this,s=window.innerWidth;this.detectDevice(),(s!=this.ww||i.isFirst)&&(this.ww=s,this.resizeTimeout&&clearTimeout(this.resizeTimeout),this.resizeTimeout=setTimeout(function(){i.resetMenu(),i.initMenuItems(),i.calculateStickyOffset(),e(window).trigger("scroll",t),i.resizeTimeout=0},200))},onScroll:function(t){var i=this,s=this.options,n=e(window).scrollTop(),a=s.stickyWhenScrollUp?"awemenu-stickyup":"awemenu-sticky",o=s.sticky||s.onePageMode,r=o&&e.inArray(s.type,["outleft","outright","standard"])>-1&&!this.isMobile,l=o&&e.inArray(s.mobileType,["outleft","outright","standard"])>-1&&this.isMobile;this.stickyClass=a,n-this.stickyOffset>0&&(r||l)?(this.stickyActivated&&"resize"!==t.type||(this.stickyReplacer||"absolute"===this.$el.css("position")||(this.stickyReplacer=e('<div class="awemenu-scticky-replacer"></div>').height(this.$el.outerHeight()).attr("id",this.stickyReplacerID),this.$el.before(this.stickyReplacer)),this.$el.css({top:0,"z-index":999999}),this.addMenuClasses(a),this.stickyActivated=!0,this.isMobile&&-1===e.inArray(this.options.mobileType,["outleft","outright"])&&this.setMenuMaxHeight()),s.stickyWhenScrollUp&&(n<this.prevScroll?this.$el.addClass("awemenu-scrollup"):this.$el.removeClass("awemenu-scrollup"))):n-this.stickyOffset<=0&&(this.stickyActivated||"resize"===t.isTrigger)&&(e("#"+this.stickyReplacerID).remove(),this.stickyReplacer=null,e(".awemenu-container",i.$el).width(""),this.removeMenuClasses(a),this.$el.css("top",""),this.stickyActivated=!1,this.setMenuMaxHeight(!0)),this.prevScroll=n},activateSubMenu:function(t){var i=this,s=t.data("hide-timeout"),n=e("> .awemenu-submenu",t);if(s&&clearTimeout(s),this.options.beforeActivate(t,this),this.$showDefaultItem&&this.$showDefaultItem.removeClass("awemenu-default-item"),e(".awemenu-item.awemenu-active",i.$el).data("parent-active",!1),t.parents(".awemenu-item").data("parent-active",!0),n.length&&this.options.enableAnimation&&!this.isMobile&&"fullscreen"!==this.options.type){n.css({"z-index":"",display:""});var a=setTimeout(function(){t.addClass("awemenu-active"),t.data("show-timeout",!1)},30);t.data("show-timeout",a)}else t.addClass("awemenu-active");if(this.isMobile||"fullscreen"===this.options.type){var o=this.options.arrows;n.css("display","none"),n.slideDown(this.options.mobileAnimationDuration),e("> a > .awemenu-arrow",t).removeClass(o.down).addClass(o.mobileClose)}e(".awemenu-item.awemenu-active",i.$el).each(function(){e(this).data("parent-active")||e(this).is(t)||(i.options.enableAnimation&&(clearTimeout(e(this).data("show-timeout")),t.data("show-timeout",!1)),i.deactivateSubMenu(e(this)))}),this.options.activate(t,this),this.$el.trigger("aweMenuItemActivated",[t,this])},deactivateSubMenu:function(t){var i=parseInt(e("> .awemenu-submenu",t).attr("data-duration")),s=isNaN(i)?this.options.defaultDesktopAnimationDuration:i,n=e("> .awemenu-submenu",t);if(this.options.beforeDeactivate(t,this),this.isMobile||"fullscreen"===this.options.type){var a=this.options.arrows;n.length&&(n.slideUp(this.options.mobileAnimationDuration,function(){t.removeClass("awemenu-active")}),e("> a > .awemenu-arrow",t).removeClass(a.mobileClose).addClass(a.down))}else{var o,r=this;n.length?(t.removeClass("awemenu-active"),o=setTimeout(function(){("click"===r.options.trigger||t.data("hover-out"))&&(n.css({"z-index":-1,display:"none"}),t.data("hide-timeout",!1))},s),t.data("hide-timeout",o)):t.removeClass("awemenu-active")}this.options.deactivate(t,this),this.$el.trigger("aweMenuItemDeactivated",[t,this])},addMenuClasses:function(t){function i(t){-1===e.inArray(t,s.classes)&&s.classes.push(t)}var s=this;"string"===e.type(t)?i(t):"array"===e.type(t)&&e.each(t,function(){i(this)}),this.$el.addClass(this.classes.join(" "))},removeMenuClasses:function(t){function i(t){var i=e.inArray(t,s.classes);i>-1&&s.classes.splice(i,1),s.$el.removeClass(t)}var s=this;switch(e.type(t)){case"array":e.each(t,function(){i(this)});break;case"string":i(t)}},setMenuMaxHeight:function(t){var i=this.$el.height(),s=e(window).height();t?e("ul.awemenu",this.$el).css("max-height",""):e("ul.awemenu",this.$el).css("max-height",s-i)},getMenuIndex:function(){return this.menuIndex||(this.menuIndex=e(".awemenu-nav").index(this.$el)+1),this.menuIndex},getSubMenuWidth:function(t,i){var s=t.data("width"),n=t.outerWidth(),a=i?e("ul.awemenu",this.$el):e(".awemenu-container",this.$el),o=a.outerWidth();switch(i&&(o=e.inArray(this.options.type,["left","outleft"])>-1?e(window).outerWidth()-(a.offset().left+a.outerWidth()):a.offset().left),e.type(s)){case"string":s=isNaN(parseInt(s))?n:s.indexOf("%")>-1?parseInt(s)<100?Math.round(parseInt(s)*o/100):o:parseInt(s);break;case"number":break;default:s=i&&t.hasClass("awemenu-megamenu")?o:n}return s},initOnePageMode:function(){var t=this,i=0;e.each(this.anchors,function(s){var n=function(i){var n=e(window).scrollTop()+t.height+t.options.onePageSettings.offset,a=t.anchors[s][0];if(e(a).length&&!t.scrollByClick){var o=e(a).offset().top,r=o+e(a).outerHeight();if(n>=o&&r>=n){switch(i){case"up":t.anchors[s][1].addClass("awemenu-anchor-active"),t.anchors[s+1]&&t.anchors[s+1][1].removeClass("awemenu-anchor-active");break;case"down":t.anchors[s][1].addClass("awemenu-anchor-active"),t.anchors[s-1]&&t.anchors[s-1][1].removeClass("awemenu-anchor-active");break;default:t.anchors[s][1].addClass("awemenu-anchor-active")}e.each(t.anchors,function(e){t.anchors[e][0]!==a&&t.anchors[e][1].removeClass("awemenu-anchor-active")})}}};n(),e(window).scroll(function(s){var a=e(this).scrollTop()+t.height+t.options.onePageSettings.offset,o="down";i>a&&(o="up"),i=a,n(o)})})},changeWindowURL:function(e,t){this.options.onePageSettings.changeHashURL&&(void 0!==typeof history.replaceState?history.replaceState(null,null,t):window.location.hash=e+t)},calculateStickyOffset:function(){this.removeMenuClasses(this.stickyClass);var t=parseInt(this.options.stickyOffset);if(isNaN(t)){t=0;for(var i=this.options.stickyOffset.split("|"),s=0;s<i.length;s++)if(e(i[s]).length){t=e(i[s]).offset().top+e(i[s]).height();break}}else t+=this.$el.offset().top;this.stickyOffset=t}},e.fn.aweMenu=function(i){var s=Array.prototype.slice.call(arguments,1),n=this;return this.each(function(){var a=e(this),o=a.data("awe-menu");switch(e.type(i)){case"string":var r=["option","destroy"];if(!o)throw Error("Error: cannot call methods on awrMenu prior to initialization;");if(!(e.inArray(i,r)>-1))throw Error('Error: method "'+i+'" does not exist on aweMenu');switch(i){case"option":var l={};"object"==e.type(s[0])?(l=s[0],o.setOption(l)):"string"==e.type(s[0])?void 0!==s[1]?(l[s[0]]=s[1],o.setOption(l)):n=o.getOption(s[0]):void 0===s[0]&&(n=o.getOption());break;case"destroy":o.destroy()}break;case"object":o?o.setOption(i):(o=new t(a,i),a.data("awe-menu",o));break;default:o||(o=new t(a,{}),a.data("awe-menu",o))}}),n}}(jQuery);;
