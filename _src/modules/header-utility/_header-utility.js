function selectLanguage() {
  let  uri = '?lang=',
    select = $('#select-site-language');

  select.change(function(){
    window.location.href = uri + select.val();
  });
}

function doSearch() {
  let uri = '?s=',
    input = $('#site-search');

  $('.header-utility-search button').click(function(e){
    window.location.href = uri + input.val();
  });

  input.on('keyup', function (e) {
    if (e.which == 13) {
      window.location.href = uri + input.val();
    }
  });
}

function showSearch() {
  let body = $('body');

  $('.js-search-form').click(function(e) {
    e.preventDefault();

    $("html, body").animate({ scrollTop: 0 }, "fast");
    body.addClass('show-search-form opac-show');
    $('#site-search').focus();

  });

  $('.js-close-search, .overlay-button').click(function(e) {
    body.removeClass('show-search-form opac-show');
  });
}

function toggleMenu() {
  let ul = $('header .slider-menu ul'),
  menuToggle = $('.js-menu');

  // toggle show hide slider menu
  menuToggle.click(function(e){
    e.preventDefault();

    $("html, body").animate({ scrollTop: 0 }, "fast");
    $('body').toggleClass('show-menu opac-show');
  });

  // hide slider menu on click outside slider
  $('.nav-container').click(function(e){
    if($('body').hasClass('show-menu') && $(e.target).hasClass('nav-container')) {
      $('body').toggleClass('show-menu opac-show');
    }
  });

  // slider menu accordion
  if(ul.length === 0) {
    return;
  }

  ul.each(function(){
    let el = $(this).closest('li'),
      icon = '<svg viewBox="0 0 100 100" class="icon js-chevron-down"><use xlink:href="#chevron-down"></use></svg>';

    if(el.length > 0) {
      el.addClass('has-child');
      el.append(icon);
    }
  });

  $('.js-chevron-down').click(function(){
    $(this).closest('li').toggleClass('open');
  });

  $('.has-child a').click(function(e){
    let el = $(this);

    if(el.attr('href') === "#") {
      e.preventDefault();
      el.closest('li').toggleClass('open');
    }
  });
}

$(function(){
  selectLanguage();
  doSearch();
  showSearch();
  toggleMenu();
});
