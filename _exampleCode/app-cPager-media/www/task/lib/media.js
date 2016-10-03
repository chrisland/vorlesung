
app.cPager.addTask('media', {

    playVideo: function (e) {

        if (!content) {
            return false;
        }

        if (!_app.sync) {
            _app.pager.switch('sync/home', false, false, {
              history: false,
              animate: 'ease-in-out',
              direction: 'right'
            });
            return false;
        }

        var self = scope.playVideo;
        e.target.style.display = 'none';

        self.elm = document.createElement('video');
        self.elm.controls = "true";
        self.elm.className = "w-100";
        var source = document.createElement('source');
        source.type = 'video/mp4';
        source.src = 'file://'+_app.sync+'/'+content+'.mp4';
        self.elm.appendChild(source);
        //document.body.appendChild(self.elm);

        e.target.parentNode.insertBefore(self.elm, e.target);

        self.elm.play();

    },
    playAudio: function (e) {

        if (!e.content) {
            return false;
        }
        var self = e.scope.playAudio;

        //console.log(e.content);

        if (self.elm) {
            self.elm.pause();
            jQuery(self.audioBtn).removeClass('playing');
            jQuery(self.elm).remove();
        }

        self.elm = document.createElement('audio');
        var source = document.createElement('source');
        source.src = e.content;
        self.elm.appendChild(source);
        document.body.appendChild(self.elm);
        self.audioBtn = e.target;

        self.elm.addEventListener('ended', function (evt) {
            //console.log(['ended-------',evt.target.src]);
            jQuery(self.audioBtn).removeClass('playing');
        });

        self.elm.addEventListener('pause', function (evt) {
            //console.log(['pause-------',evt.target.src]);
            jQuery(self.audioBtn).removeClass('playing');
        });

        self.elm.addEventListener('play', function (evt) {
            //console.log(['play-------',evt.target.src]);
            jQuery(e.target).addClass('playing');
        });

        self.elm.addEventListener('canplay', function (evt) {
            //console.log(['canplay-------',evt.target.src]);
            self.elm.play();
        });

        self.elm.addEventListener('abort', function (evt) {
            //console.log(['abort-------',evt.target.src]);
            jQuery(self.audioBtn).removeClass('playing');
            //console.log('error audio: abort');
        });
        self.elm.addEventListener('error', function (evt) {
            //console.log(['error-------',evt.target.src]);
            jQuery(self.audioBtn).removeClass('playing');
            //console.log('error audio: error');
        });

        self.elm.play();
    }


});
