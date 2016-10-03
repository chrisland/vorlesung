"use strict";

var myTask = {



    link: function (e) {
        if (!content) {
            return false;
        }
        window.open(content, '_system');
        return false;
    },

    
    toogleChild: function (page, content, e, dom, scope) {

        if (!e.target.parentNode) {
            return false;
        }
        var node = e.target.parentNode.querySelector('p');
        if (node.classList.contains('toggle')) {
            node.classList.remove('toggle')
            e.target.classList.remove('icon-toggleOpen');
            jQuery(node).slideUp();
        } else {
            node.classList.add('toggle')
            e.target.classList.add('icon-toggleOpen');
            jQuery(node).slideDown();
        }

        return false;
    }


};
