function tabs() {
  let tabs = $('.tabs');

  if( tabs.length === 0 ) {
    return;
  }

  tabs.each(function(){
    let tab = $(this),
      el = tab.find('.js-tab'),
      targets = tab.find('.js-tabs-content'),
      first = $(el[0]);

    $(first.attr('href')).addClass('open');
    first.addClass('active');

    el.click(function(e){
      e.preventDefault();

      let a = $(this);

      targets.removeClass('open');
      el.removeClass('active');

      $(a.attr('href')).addClass('open');
      a.addClass('active');
    });
  });

}

$(() => {
  tabs();
});
