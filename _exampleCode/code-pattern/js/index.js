





var speichernBtn = document.getElementById('speichern');
var eingabeInp = document.getElementById('eingabe');
var liste = document.getElementById('liste');

speichernBtn.onclick = function (e) {

    var val = eingabeInp.value;

    var item = document.createElement('li');
    var text = document.createElement('span');
    text.innerHTML = val;
    var del = document.createElement('button');
    del.onclick = function (e) {
        if ( confirm('wirklich löschen') ) {
            alert('entferne mich bitte!');
        }
    };

    item.appendChild(text).appendChild(del);
    liste.appendChild(item);

};
