function showHidePopup() {
  let jsClass = '.js-popup',
    jsPopup = $(jsClass),
    content = $('.popup .content'),
    iframe = $('<iframe />'),
    image = $('<img />'),
    nav,
    el;

  if(jsPopup.length === 0) {
    return;
  }

  // handle cose popup
  $('.js-close-popup').click(function(){
    $('body').removeClass('show-popup opac-show');
    content.html("").parent().removeClass('video-iframe image iframe group');

    // play carousel on close if carousel exist
    let carousel = $('.slick-carousel.paused');
    if(carousel.length > 0) {
      carousel.removeClass('paused').slick('slickPlay');
    }
  });

  // handle trigger on click
  jsPopup.click(function(e){
    e.preventDefault();

    $('body').addClass('show-popup opac-show ');
    el = $(this);

    switch (el.data('popup')) {
      case 'iframe':
      case 'video':
        iframe.attr('src', el.attr('href'));
        content.html(iframe).parent().addClass('video-iframe '+ (el.data('popup') === 'iframe'  ? 'iframe' : ''));

        break;
      case 'inline':
        $(el.attr('href')).children().clone().appendTo(content);
        content.parent().addClass('inline');

        break;
      case 'image':
        // if image group
        if( el.data('rel') !== undefined ) {
          let imgs = $(jsClass +'[data-rel="'+ el.data('rel') +'"]');
            // prev = '<div><a href="#" class="prev">prev</a> ',
            // next = ' <a href="#" class="next">next</a></div>',
            // page = imgs.index(el) + 1;

          if( imgs.length === 1 ) {
            return;
          }

          nav = $('#popup-nav-tpl').clone().children();
          nav.find('.current').text(imgs.index(el) + 1);
          nav.find('.total').text(imgs.length);

          image.attr('src', el.attr('href'));
          content.html(image).append(nav).parent().addClass('image group');

          // add data to nav button
          nav.find('a').data('rel', el.data('rel'));
          nav.find('.prev').data('eq', imgs.index(el) - 1);
          nav.find('.next').data('eq', imgs.index(el) + 1);

          // remove nav if not available
          if( imgs.index(el) === 0 ) {
            nav.find('.prev').addClass('disabled');
          }

          if( imgs.index(el) + 1 === imgs.length ) {
            nav.find('.next').addClass('disabled');
          }
        } else {
          image.attr('src', el.attr('href'));
          content.html(image).parent().addClass('image');
        }

        break;
    }
  });

  // handle click photo group nav
  content.on('click', 'a', function(e){
    e.preventDefault();

    let el = $(this);

    if(el.closest('.group').length === 0) {
      return;
    }

    if(el.data('eq') < 0) {
      return;
    }

    $(jsClass +'[data-rel="'+ el.data('rel') +'"]').eq(el.data('eq')).trigger('click');
  });
}

$(function(){
  showHidePopup();
});
