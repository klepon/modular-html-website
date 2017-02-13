function initSlickCarousel() {
  function eachCarousel(el) {
    // desktop first
    el.slick({
      dots: true,
      autoplay: true,
      infinite: true,
      speed: el.data('slide-speed') ? el.data('slide-speed') : 300,
      slidesToShow: el.data('show') ? el.data('show') : 1,
      slidesToScroll: el.data('scroll') ? el.data('scroll') : 1,
      autoplaySpeed: el.data('speed') ? el.data('speed') : 2000,
      prevArrow: '<div class="prev"><svg viewBox="0 0 100 100" class="icon chevron-left"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#chevron-left"></use></svg></div>',
      nextArrow: '<div class="next"><svg viewBox="0 0 100 100" class="icon chevron-right"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#chevron-right"></use></svg></div>',
      appendDots: el.parent(),
      responsive: [
        {
          breakpoint: 1024, // start below this
          settings: {
            slidesToShow: el.data('show') < 2 ? el.data('show') : 2,
            slidesToScroll: el.data('scroll') < 2 ? el.data('scroll') : 2,
          }
        },
        {
          breakpoint: 768, // start below this
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          }
        }
      ]
    });
  }

  let carousel = $('.slick-carousel');

  if( carousel.length === 0 ) {
    return;
  }

  carousel.each(function(){
    eachCarousel($(this));
  });
}

function pausePlay() {
  let el = $('.slick-carousel .js-popup');

  if(el.length === 0) {
    return;
  }

  el.click(function(e){
    $(e.target).closest('.slick-carousel').addClass('paused').slick('slickPause');
  })
}

$(function(){
  initSlickCarousel();
  pausePlay();
});
