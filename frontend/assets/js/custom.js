(function ($) {
  "use strict";

const GAME_API_URL = 'http://a4b74d9d5fd2440d0ba586055b8d6823-1359624435.us-east-1.elb.amazonaws.com:3000/games';
const ORDER_API_URL = 'http://a4127b0a21e6742aaa88ae71d6055930-2044061843.us-east-1.elb.amazonaws.com:3001/orders';
const ANALYTICS_API_URL = 'http://a2914113bca424c9db2b24932e6daa19-746668688.us-east-1.elb.amazonaws.com:3002/track';



  // Page loading animation
  $(window).on('load', function() {
    $('#js-preloader').addClass('loaded');
  });

  $(window).scroll(function() {
    var scroll = $(window).scrollTop();
    var box = $('.header-text').height();
    var header = $('header').height();

    if (scroll >= box - header) {
      $("header").addClass("background-header");
    } else {
      $("header").removeClass("background-header");
    }
  });

  // Fetch and display games
  function loadGames() {
    fetch(GAME_API_URL)
      .then(response => response.json())
      .then(data => {
        console.log('Games:', data);
        const gameList = document.getElementById('game-list');
        if (gameList) {
          gameList.innerHTML = '';
          data.forEach(game => {
            const li = document.createElement('li');
            li.textContent = `${game.name} - ${game.category} - $${game.price}`;
            gameList.appendChild(li);
          });
        }
      })
      .catch(err => console.error('Error fetching games:', err));
  }

  // Place sample order
  function placeOrder() {
    const order = {
      customer_name: "John Doe",
      items: [{ game: "Cyberpunk 2077", quantity: 1 }],
      total_price: 59.99
    };
    fetch(ORDER_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    })
      .then(response => response.json())
      .then(data => alert('Order placed: ' + JSON.stringify(data)))
      .catch(err => console.error('Order error:', err));
  }

  // Track page analytics
  function trackEvent(eventType, page) {
    const analyticsData = {
      event_type: eventType,
      page: page,
      session_id: "SESSION123",
      timestamp: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };
    fetch(ANALYTICS_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(analyticsData)
    })
      .then(response => response.json())
      .then(data => console.log('Analytics event recorded:', data))
      .catch(err => console.error('Analytics error:', err));
  }

  document.addEventListener('DOMContentLoaded', function() {
    loadGames();
    trackEvent('page_view', window.location.pathname);

    const orderButton = document.getElementById('place-order-btn');
    if (orderButton) {
      orderButton.addEventListener('click', function(e) {
        e.preventDefault();
        placeOrder();
      });
    }

    // Scroll depth tracking
    let maxScrollDepth = 0;
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);

      if (scrollPercent > maxScrollDepth) {
        maxScrollDepth = scrollPercent;
        trackEvent('scroll_depth', window.location.pathname + `?depth=${maxScrollDepth}%`);
      }
    });
  });

  window.placeOrder = placeOrder;
  window.loadGames = loadGames;

})(window.jQuery);
