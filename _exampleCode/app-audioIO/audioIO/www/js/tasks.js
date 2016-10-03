

var _recordAndPlay = new recordAndPlay();

var audioSuccess = function () {
    console.log("playAudio():Audio Success");
};

var audioError = function (err) {
    console.log("playAudio():Audio Error: " + JSON.stringify(err) );
};



var _tasks = {
    rapPlay: function (pageId, pageContent, event, dom) {
      _recordAndPlay.play(audioSuccess, audioError);
    },
    rapRecord: function (pageId, pageContent, event, dom) {
      _recordAndPlay.record(audioSuccess, audioError);
    },
    play: function (pageId, pageContent, event, dom) {

      var my_media = new Media(getPhoneGapPath() + pageContent, audioSuccess, audioError);

      my_media.play();

    },
    initDone: function (pageId, pageContent, event, dom) {

      localStorage.setItem("init", "true");
      return true;

    }
};


function getPhoneGapPath() {
   var path = window.location.pathname;
   path = path.substr( path, path.length - 10 );
   return path;
};
