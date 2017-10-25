


function ajaxF() {}

ajaxF.prototype.switch = function (url) {

    $('#page').load(url);

};

ajaxF.prototype.events = function () {

    var that = this;
    $('body').on('click', '.pageBtn', function(e) {
        var page = $(this).data('page');
        if (page) {
            that.switch('./tmpl/'+page+'.html');
        }

    });

};
