
/*
phonegap-recordAndPlay
v0.0.1
*/

function recordAndPlay() {
  this._path = '';
  return this;
}

recordAndPlay.prototype.record = function (s,e) {

  var that = this;
  // capture callback
  var captureSuccess = function(mediaFiles) {
    var i, path, len;
    //console.log(mediaFiles);

    for (i = 0, len = mediaFiles.length; i < len; i += 1) {
        that._path = mediaFiles[i].fullPath;
    }
    if (that.path) {
      if (typeof s === 'function') {
        s();
      }
    }
  };

  // capture error callback
  var captureError = function(error) {
    //console.log('Error code: ' + error.code, null, 'Capture Error');
    if (typeof e === 'function') {
      e(error);
    }
  };

  // start audio capture
  navigator.device.capture.captureAudio(captureSuccess, captureError, {limit:2});

};

recordAndPlay.prototype.play = function (s,e) {

  if (!this._path) { alert('No record File found.'); return false; }
  var my_media = new Media(this._path,
      // success callback
      function () {
          //console.log("playAudio():Audio Success");
          if (typeof s === 'function') {
            s();
          }
      },
      // error callback
      function (err) {
          //console.log("playAudio():Audio Error: " + JSON.stringify(err) );
          if (typeof e === 'function') {
            e(err);
          }
      }
  );
  // Play audio
  my_media.play();

};
