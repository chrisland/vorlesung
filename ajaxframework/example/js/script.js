
// app first start function
var _init = function () {

  // Event Listener
  $('body').on('click','.pageBtn', function () {

    // get data-page attribute
    var page = $(this).data('page');

    // load and insert html file
    $('#page').load('tmpl/'+page+'.html');

  });

};

// if dom is ready:
$(document).ready(function () {
  _init();
});
