function showHidePopup() {
  let el = $('.js-popup'),
    content = $('.popup .content'),
    iframe = $('<iframe />');

  $('.js-close-popup').click(function(){
    $('body').toggleClass('show-popup opac-show');
    content.html("").parent().removeClass('video-iframe');

    // play carousel if exist
    let carousel = $('.slick-carousel.paused');
    if(carousel.length > 0) {
      carousel.removeClass('paused').slick('slickPlay');
    }
  });

  if(el.length === 0) {
    return;
  }

  el.click(function(e){
    e.preventDefault();

    // if content iframe
    let url = el.data('url');
    if(url !== undefined) {
      iframe.attr('src', url);
      content.html(iframe).parent().addClass('video-iframe');
      $('body').toggleClass('show-popup opac-show');
    }

  });
}

$(function(){
  showHidePopup();
});
