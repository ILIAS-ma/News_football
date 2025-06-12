$(document).ready(function() {
  // Gestion du menu responsive
  $('.navbar-collapse ul li a:not(.dropdown-toggle)').click(function() {
    $('.navbar-toggle:visible').click();
  });

  // Gestion du scroll
  $(window).scroll(function() {
    if ($(this).scrollTop() > 50) {
      $('.navbar-default').css({
        'background': '#fff',
        'border-color': '#e5e7eb',
        'box-shadow': '0 2px 12px rgba(0, 0, 0, 0.04)'
      });
      $('.navbar-brand').css('color', '#111');
      $('.navbar-nav>li>a').css('color', '#111');
      $('.navbar-nav>li>a').hover(
        function() {
          $(this).css({
            'background': 'rgba(59, 130, 246, 0.1)',
            'color': 'var(--accent-color)'
          });
        },
        function() {
          $(this).css({
            'background': 'transparent',
            'color': '#111'
          });
        }
      );
    } else {
      $('.navbar-default').css({
        'background': '#fff',
        'border-color': '#e5e7eb',
        'box-shadow': '0 2px 12px rgba(0, 0, 0, 0.04)'
      });
      $('.navbar-brand').css('color', '#111');
      $('.navbar-nav>li>a').css('color', '#111');
      $('.navbar-nav>li>a').hover(
        function() {
          $(this).css({
            'background': 'rgba(59, 130, 246, 0.1)',
            'color': 'var(--accent-color)'
          });
        },
        function() {
          $(this).css({
            'background': 'transparent',
            'color': '#111'
          });
        }
      );
    }
  });

  // Gestion du bouton de déconnexion
  $('#logoutButton').click(function(e) {
    e.preventDefault();
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      localStorage.removeItem('token');
      window.location.href = 'login.html';
    }
  });

  // Gestion du menu burger
  $('.navbar-toggle').click(function() {
    $(this).toggleClass('active');
    $('.navbar-collapse').toggleClass('in');
  });

  // Animation du menu burger
  $('.navbar-toggle').hover(
    function() {
      $(this).css('background', 'rgba(0, 0, 0, 0.05)');
    },
    function() {
      $(this).css('background', 'transparent');
    }
  );
}); 