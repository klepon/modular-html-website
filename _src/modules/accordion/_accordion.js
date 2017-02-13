function accordion() {
  let el = $('.js-accordion-heading');

  if(el.length === 0) {
    return;
  }

  el.next().slideUp(1);

  el.click(function() {
    let el = $(this);
    if(el.hasClass('open')) {
      el.removeClass('open').next().slideUp(300);
    } else {
      el.addClass('open').next().slideDown(300);
    }
  });
}

$(() => {
  accordion();
});
