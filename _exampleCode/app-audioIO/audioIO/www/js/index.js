
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();

        this.onDeviceReady();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {


      //localStorage.setItem("lastname", "dhjksfghjlasdgfjkaghsdjkfgajk");

      var init = localStorage.getItem("init");
      var _start;

      if (init == 'true') {
        // main start
        _start = 'home';
      } else {
        // prelog
        _start = 'index';
      }

      var myPager = new cPager({
        container: 'page',
        start: _start,
        handler: 'pageBtn',
		    tmplPath: 'tmpl',
        tasks: _tasks,
        preCache: ['home','play']
      });


    }
};
