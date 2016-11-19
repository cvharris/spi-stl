// Main javascript entry point
// Should handle bootstrapping/starting application

'use strict';

import $ from 'jquery';
import 'waypoints';

$(() => {
  $(document).ready(function() {
    var doc = this;
    doc.sidebarVisible = false;

    var body = $('body');

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
  })
});
