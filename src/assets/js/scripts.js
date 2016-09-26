'use strict';

(function($){
  $(document).ready(function() {
    var doc = this;
    doc.sidebarVisible = false;

    var body = $('body');
    var topSection = $('#about');

    var sectionTopOffset = topSection.offset().top;

    $(window).resize();
    // function resizeBackground() {
    //     topSection.height($(window).height() - 60);
    // }
    // resizeBackground();

    var firstWaypoint = new Waypoint({
      element: document.getElementById('about'),
      handler: function(direction) {
        if (direction == 'down') {
          body.removeClass('no-header');
        } else if (direction == 'up') {
          body.addClass('no-header');
        }
      }
    });

    $('#menu-reveal').click(function() {
        doc.sidebarVisible = !doc.sidebarVisible;
        if (doc.sidebarVisible) {
          body.addClass('menuOpen');
        } else {
          body.removeClass('menuOpen');
        }
    });

    $('.section-link').click(function() {
      body.removeClass('menuOpen');
      doc.sidebarVisible = false;
    });

    function isScrollEnough() {
      if (window.pageYOffset >= sectionTopOffset) {
        return true
      } else {
        return false
      }
    }

    if (isScrollEnough()) {
      body.removeClass('no-header');
    } else {
      body.addClass('no-header');
    }
  })
})(jQuery);