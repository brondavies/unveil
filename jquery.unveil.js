/**
 * jQuery Unveil
 * A very lightweight jQuery plugin to lazy load images
 * http://luis-almeida.github.com/unveil
 *
 * Licensed under the MIT license.
 * Copyright 2013 Luís Almeida
 * https://github.com/luis-almeida
 */

!(function ($) {
  'use strict';

  $.fn.unveil = function (target, options) {
    options = options || {};
    var $target = $(target || window),
      buffer = options.buffer || 120,
      data_bkg = options.bkg || 'data-bkg',
      data_src = options.src || 'data-src',
      fade = options.fade || '.fade',
      fadeInClass = options.fadeIn || 'in',
      images = this,
      inview,
      placeholder = options.placeholder,
      src = 'src';
    if (placeholder) {
      $('img[src!=""]', images).each(function (i, e) {
        e.setAttribute(data_src, e.getAttribute(src));
        e.setAttribute(src, placeholder);
      });
      $('[' + data_bkg + '!=""]', images).each(function (i, e) {
        e.style.backgroundImage = "url('" + placeholder + "')";
      });
    }

    images.one('unveil', function () {
      var e = this;
      if (e.getAttribute(data_src)) {
        e.setAttribute(src,
        e.getAttribute(data_src));
        e.removeAttribute(data_src);
        fadeIn();
      }

      if (e.getAttribute(data_bkg)) {
        e.style.backgroundImage = "url('" + e.getAttribute(data_bkg) + "')";
        e.removeAttribute(data_bkg);
        fadeIn();
      }

      function fadeIn() {
        if ($(e).is(fade)) {
          $(e).addClass(fadeInClass);
        }
      }
    });

    var unveil = function () {
      inview = images.filter(function () {
        var topOfContainer = Math.max(0, $target.scrollTop()),
          bottomOfContainer = $target.height() + buffer,
          topOfImage = $(this).offset().top,
          height = $(this).height();
        return topOfImage + height >= topOfContainer &&
          topOfImage <= topOfContainer + bottomOfContainer;
      });

      images = images.not(inview.trigger('unveil'));
    };

    unveil();

    $target.on('scroll', unveil);
  };

})(window.jQuery || window.Zepto);
