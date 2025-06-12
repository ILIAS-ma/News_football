$(document).ready(function(){
    $(function () {
      // Closes the Responsive Menu on Menu Item Click
      $('.navbar-collapse ul li a:not(.dropdown-toggle)').click(function() {
        $('.navbar-toggle:visible').click();
      });
      
      $(window).scroll(function () {
        // set distance user needs to scroll before we fadeIn navbar
        if ($(this).scrollTop() > 50) {
          $('.navbar').css({
            'background': 'white',
            'border-color': 'rgba(0, 0, 0, 0.2)'
          });
          $('.navbar-brand').css('color', '#f05f40');
          $('.navbar-nav>li>a').css('color', '#222222');
          $('.navbar-nav>li>a').hover(function() {
            $(this).css('color', '#f05f40');
          }, function() {
            $(this).css('color', '#222222');
          });
        }
        else {
          $('.navbar').css({
            'background': 'transparent',
            'border-color': 'rgba(255, 255, 255, 0.4)'
          });
          $('.navbar-brand').css('color', 'rgba(255, 255, 255, 0.9)');
          $('.navbar-nav>li>a').css('color', 'rgba(255, 255, 255, 0.9)');
          $('.navbar-nav>li>a').hover(function() {
            $(this).css('color', 'white');
          }, function() {
            $(this).css('color', 'rgba(255, 255, 255, 0.9)');
          });
        }
      });
    });
  });