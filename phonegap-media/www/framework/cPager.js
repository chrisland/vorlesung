/*
//! TODO:

  start delay... erst nicht und start page erst nach x sekunden
. reload with same page and task and content.

*/

/**
* Easy JS one-Page system framework with template files
*
* @class cPager
* @version 0.4.0
* @license MIT
*
* @author Christian Marienfeld post@chrisand.de
*
* ### Examples:
*
*	var myPager = new cPager({
*		container: 'page',
*		start: 'home',
*		tasks: {
*			'myTask': function (pageId, pageContent, event, dom) {
*
*				alert('myTask before');
*
*				return function () {
*					alert('myTask after');
*				};
*			}
*		}
*	});
*
*	myPager.switch('myPage');
*
*	myPager.switch('myPage','myTask','testContent');
*
*	myPager.switch('myFolder/myPage'); // will open ./tmpl/myFolder/myPage.tpl
*
*
* @return {Object} cPager Object
*
* @api public
*/



function cPager(param) {

	"use strict";

	this._page;
	this._open = 0;
	this._lastopen = 0;
	this._history = [];
	this._pageClass = '';
	this._bodyClass = '';
	this.animate = false;

	this._opt = {

    debug: false,

    container: 'page',

    handler: 'pageBtn',
    handlerOff: 'pageBtnOff',

    tmpl: [],
    tmplPath: 'tmpl',

    ctrl: [],
    ctrlPath: '',

    tasks: [],

    start: {
      page: false,
      task: false,
      content: false,
      param: {
        history: true
      }
    },

    animate: {
      timing: false,
      direction: 'left',
      duration: 2
    },

    onReady: false



	};

  var self = this;



  var deepExtend = function(out) {
    out = out || {};

    for (var i = 1; i < arguments.length; i++) {
      var obj = arguments[i];

      if (!obj)
        continue;

      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (typeof obj[key] === 'object')
            out[key] = deepExtend(out[key], obj[key]);
          else
            out[key] = obj[key];
        }
      }
    }

    return out;
  };

  this._opt = deepExtend({}, this._opt, param);

  var debug = this._opt.debug;
  var count = Object.keys(this._opt.ctrl).length+ +Object.keys(this._opt.tmpl).length || 0;

  function done() {
    count--;
    if ( count == 0 || count < 0 ) {
      // START
      if ( self._lastopen ) {
        self.switch(self._lastopen);
      } else {
        if (self._opt.start && self._opt.start.page) {
          self.switch(self._opt.start.page, self._opt.start.task, self._opt.start.content, self._opt.start.param);
        }
      }
      if (self._opt.onReady && typeof self._opt.onReady === 'function') {
        self._opt.onReady();
      }
      if (debug) {
        console.log('cPager - loaded');
      }
    }
  }

  // INIT
  this._page = document.getElementById(this._opt.container);
  if (!this._page) {
    throw new Error("missing main container #"+this._opt.container);
    return false;
  }
  this._pageClass = this._page.className || '';
  this._bodyClass = document.body.className || '';



  if (debug) {
    console.log('cPager - initialize');
  }

	// LOAD EXTERNAL JS TASK FILES
	if (this._opt.ctrl) {
		for (var i in this._opt.ctrl) {
			if (this._opt.ctrl.hasOwnProperty(i)) {
				this._h.loadScript(this._opt.ctrlPath+'/'+this._opt.ctrl[i]+'.js', function (name) {
					if (debug) {
					  console.log('cPager - load script: '+name);
					}
					done();
				});
			}
	  	}
	}

	// LOAD AJAX TPL PAGES
	this.ajaxCache = {};
	if (this._opt.tmpl) {
		for (var i in this._opt.tmpl) {
			if (this._opt.tmpl.hasOwnProperty(i)) {
				this._h.cache(this, this._opt.tmpl, function (name) {
			      if (debug) {
			        console.log('cPager - cache page: '+name);
			      }
			      done();
			    });
			}
	  	}
	}

  if (!count || count == 0) {
    done();
  }


	return this;
}



/**
* Manual Switch Page
*
* ### Examples:
*
*	var myPager = new cPager()
*
*	myPager.switch('home');
*
*
*
*	var myPager = new cPager({
*		tasks: {
*			'myTask': function (pageId, pageContent, event, dom) {
*
*				alert('myTask before edit Dom');
*
*				return function () {
*					alert('myTask after insert into Dom');
*				};
*			}
*		}
*	})
*	myPager.switch('home','myTask'); // fires myTask()
*
*	myPager.switch('home','myTask','testContent'); // fires myTask() with Content-Data
*
*
* @function switch
* @version 0.1.5
*
* @param {String} [pageId=undefined] The Name or Path from template-file
* @param {String} [pageTask=undefined] The Name of the function set with init options
* @param {String} [pageContent=undefined] Optional Parameter for data
*
* @return {Object} cPager object
*
* @api public
*/


cPager.prototype.switch = function (pageId, pageTask, pageContent, param) {

	var event = null;
	if (param && param.event) { event = param.event; }

	if (pageTask == 'back') {

		var anz = parseInt(pageContent)+1 || 2;
		var history = this.getHistory();
		var last = history[history.length -anz];
		if (!last) { return false; }
		if (!last.id) { return false }
		event = event || last.param.event;
		pageId = last.id;
		pageTask = last.task;
		pageContent = last.content;
		param = param || last.param;
		this.removeHistory(anz);

	}

  if (!param) {
    param = {};
  }

	this.switch.task = this._h.getTask( event, pageTask, pageContent, pageId, this, param);
	if (pageTask && !this.switch.task) { return false; }
	if (pageId) {
		this._h.loadPage( this, './'+this._opt.tmplPath+'/'+pageId+'.tpl', pageId, pageTask, pageContent, param);
	} else if (this.switch.task && typeof this.switch.task === 'function') {
		this.switch.task();
	}

	return this;

};



/**
* Set the click-events for all buttons inside the DOM
* (the click event will not fire if: the active site is still open )
* (the click event will not fire if: the button has offButton class )
*
* ### Examples:
*
*	var myPager = new cPager()
*
*	myPager.events();
*
*
* @function events
* @version 0.1.0
*

* @return {Boolean} true or false
*
* @api public
*/


cPager.prototype.events = function () {

	var that = this;
	var clickHandler = function (e) {

		if (that._opt.handlerOff && this.classList.contains(that._opt.handlerOff)) {	return false; }
		if (that.animate) { return false;	}

		var pageId = this.getAttribute('data-page'),
			pageTask = this.getAttribute('data-task'),
			pageContent = this.getAttribute('data-content'),
			pageContainer = this.getAttribute('data-container') || false,
			pageAnimate = this.getAttribute('data-animate') || that._opt.animate.timing,
			pageDuration = this.getAttribute('data-duration') || false,
			pageDirection = this.getAttribute('data-direction') || false,
			pageForce = this.getAttribute('data-force') || false,
			history = this.getAttribute('data-history') || true;

		if ( pageId || pageTask ) {
			if (that._open == pageId && !pageForce) { return false; }
      var param = {
				event: e,
				target: (e.currentTarget) ? e.currentTarget : e.srcElement,
				history: history,
				animate: pageAnimate,
				duration: pageDuration,
				direction: pageDirection,
				container: pageContainer || false
			};
			that.switch(pageId, pageTask, pageContent, param);
		}

	};

	var pageBtns = document.getElementsByClassName(this._opt.handler);
	for(var i = 0; i < pageBtns.length; i++) {
		pageBtns[i].style.curser = 'pointer';  // IOS BUG
		if (!pageBtns[i].onclick) {
			pageBtns[i].onclick = clickHandler;
		}
	}
	return true;

};








/**
* Return global History
*
* ### Examples:
*
*	var myPager = new cPager()
*
*	myPager.getHistory();
*
*
* @function getHistory
* @version 0.1.0
*
* @return {Array} History array
*
* @api public
*/


cPager.prototype.getHistory = function () {

	if (this._history) {
		return this._history;
	}
	return false;
};


/**
* Remove x Items from global History
*
* ### Examples:
*
*	var myPager = new cPager()
*
*	myPager.removeHistory(2); // remove the last
*
*
* @function removeHistory
* @version 0.1.0
*
* @return {Boolean} true
*
* @api public
*/


cPager.prototype.removeHistory = function (anz) {

	if (anz && !isNaN(anz) && this._history.length > 0) {
		this._history = this._history.slice(0, this._history.length -anz);
	} else {
    this._history = [];
  }
	return true;
};







cPager.prototype.addHistory = function (pageId, pageTask, pageContent, pageParam) {

		var obj = {
			id: pageId,
			task: pageTask,
			content: pageContent,
			param: pageParam
		};
		this._history.push(obj);
		return true;

};





/**
* Add task functions scopes
*
* ### Examples:
*
*	var myPager = new cPager()
*
*	myPager.addTask('scopeName', {
*		func1: function () {
*			console.log('---> func1');
* 		return true;
*		},
*		func2: function () {
*			console.log('---> func2');
* 		return function () {};
*		}
*	});
*
*
* @function addTask
*
* @param {String} [pageId=undefined] The Name or Path from template-file
*
* @return {Boolean} true
*
* @api public
*/


cPager.prototype.addTask = function (key, obj) {

	if (!key || typeof key !== 'string' || !obj || typeof obj !== 'object') {
		return false;
	}
	if (!this._opt.tasks[key] || typeof this._opt.tasks[key] !== 'object') {
		this._opt.tasks[key] = {};
	}
	for (var prop in obj) {
		if (obj.hasOwnProperty(prop)) {
			this._opt.tasks[key][prop] = obj[prop];
		}
  }
	return true;

};






cPager.prototype._h = {

	getTask : function (e, task, content, pageId, that, param) {

		if (that._opt.tasks && task) {
			var t = task.split('.');
			if (t.length > 0) {
				var func = false;
				var scope = false;
				if ( t[0] && t[1] && that._opt.tasks[t[0]] && that._opt.tasks[t[0]][t[1]] ) {
					func = that._opt.tasks[t[0]][t[1]];
					scope = that._opt.tasks[t[0]];
				} else if ( t[0] && that._opt.tasks[t[0]] ) {
					func = that._opt.tasks[t[0]];
					scope = that._opt.tasks;
				}
				if (func && typeof func == 'function') {

					return func({
            page: pageId,
            content: content,
            event: e,
            node: that._page,
            scope: scope,
			target: param.target
          });
				} else {
					console.error('cPager Error: missing task function', task);
					return false;
				}
			}
		}
		return false;

	},
	successPage: function (that, pageId, pageTask, pageContent, param, dom) {

		if (that.switch.task && typeof that.switch.task === "function") {
			that.switch.afterAnimate = that.switch.task(dom || that._page);
		}
		if (!param.animate) {
			that.events();
		}
		if ( param && String(param.history) != 'false') {
			that.addHistory(pageId, pageTask, pageContent, param);
		}

	},
	successAnimate: function (that, pageId, pageTask, pageContent, param, newPage) {

		that.animate = false;
		if (that.switch.task && that.switch.afterAnimate && typeof that.switch.afterAnimate === "function") {
			that.switch.afterAnimate();
		}
		that.events();

	},
	appendPage: function (response, pageId, pageTask, pageContent, that, param) {

		var oldPage = that._page;
    if (param && param.container) {
       oldPage = document.getElementById(param.container);
    	if (!oldPage) {
    		throw new Error("missing container #"+this._opt.container);
    		return false;
    	}
    }
		var newClass = pageId.replace(/\//ig, '-');
    document.body.className = that._bodyClass+' ' || '';
		document.body.className += ' cPager-body-'+newClass;

		if (param && param.animate) {
			this.animatePage(that, pageId, pageTask, pageContent, param, oldPage, newClass, response);
    } else {
			oldPage.innerHTML = response;
			oldPage.className = that._pageClass+' ' || '';
			oldPage.className += 'cPager-'+newClass;

			that._lastopen = that._open;
			that._open = pageId;
			this.successPage(that, pageId, pageTask, pageContent, param, oldPage);
		}

	},
	animatePage: function (that, pageId, pageTask, pageContent, param, oldPage, newClass, response) {

		that.animate = true;

		if (!param.duration) {
			param.duration = that._opt.animate.duration;
		}
		if (!param.direction) {
			param.direction = that._opt.animate.direction;
		}

		//oldPage.parentNode.style.overflow = 'hidden';
		oldPage.id = that._opt.container+'Temp';
		oldPage.style.width = oldPage.clientWidth+'px';
		oldPage.style.height = oldPage.clientHeight+'px';
		oldPage.style.position = 'fixed';
		oldPage.style.transform = 'translate3d(0,0,0)';
		oldPage.style.transition = 'transform '+param.duration+'s '+param.animate;

		var newPage = document.createElement('div');
		newPage.id = that._opt.container;
		newPage.className = that._pageClass+' ' || '';
		newPage.className += 'cPager-'+newClass;
		newPage.innerHTML = response;
		newPage.style.position = 'fixed';

		newPage.style.width = oldPage.clientWidth+'px';
		newPage.style.height = oldPage.clientHeight+'px';

		switch (param.direction) {
			case 'left':
			default:
				newPage.style.transform = 'translate3d('+oldPage.style.width+',0,0)';
				break;
			case 'right':
				newPage.style.transform = 'translate3d(-'+oldPage.style.width+',0,0)';
				break;
			case 'top':
				newPage.style.transform = 'translate3d(0,'+oldPage.style.height+',0)';
				break;
			case 'bottom':
				newPage.style.transform = 'translate3d(0,-'+oldPage.style.height+',0)';
				break;
		}

		newPage.style.transition = 'transform '+param.duration+'s '+param.animate;

		document.body.insertBefore(newPage, oldPage.nextSibling);

		setTimeout(function() {


			switch (param.direction) {
				case 'left':
				default:
					oldPage.style.transform = 'translate3d(-'+oldPage.style.width+',0,0)';
					break;
				case 'right':
					oldPage.style.transform = 'translate3d('+oldPage.style.width+',0,0)';
					break;
				case 'top':
					oldPage.style.transform = 'translate3d(0,-'+oldPage.style.height+',0)';
					break;
				case 'bottom':
					oldPage.style.transform = 'translate3d(0,'+oldPage.style.height+',0)';
					break;
			}
			newPage.style.transform = 'translate3d(0,0,0)';

			//console.log(that);
			that._lastopen = that._open;
			that._open = pageId;
			that._page = newPage;
			that._h.successPage(that, pageId, pageTask, pageContent, param, newPage);


		}, 100);


		setTimeout(function () {
			//console.log('--ende', oldPage, that._page, that);

			oldPage.remove();
			that._h.successAnimate(that, pageId, pageTask, pageContent, param, newPage);

			oldPage.style.transition = '';
			newPage.style.transition = '';

			document.body.className = that._bodyClass+' ' || '';
			document.body.className += 'cPager-body-'+newClass;

		}, (param.duration*1000)+100 );


	},
	loadPage: function (that, path, pageId, pageTask, pageContent, param ) {

		var thatAjax = this;
		if ( that.ajaxCache[path] ) {
			thatAjax.appendPage(that.ajaxCache[path], pageId, pageTask, pageContent, that, param);
		} else {
			this.sendRequest(path,function (req) {
				that.ajaxCache[path] = req;
				thatAjax.appendPage(req, pageId, pageTask, pageContent, that, param);
			});
		}

	},
	cache: function (that, arr, callback) {

		for (var i in arr) {
			if (arr.hasOwnProperty(i)) {
				var path = './'+that._opt.tmplPath+'/'+arr[i]+'.tpl';
				if (that._opt.debug) {
					path = path+'?t='+Math.random(1,100);
				}
				this.sendRequest(path,function (req, url) {
					that.ajaxCache[url] = req;
					if (callback && typeof callback === 'function') {
						callback(url);
					}
				});
			}
	  	}

	},
	sendRequest: function (url,callback,postData) {

		if (window.jQuery) {
			jQuery.ajax({url: url, dataType: 'html', cache: false })
			.done(function(data) { callback(data, url); })
			.fail(function(e) { console.log( "cPager - jQuery ajax error", e ); });

		} else {

			var XMLHttpFactories = [
			    function () {return new XMLHttpRequest();},
			    function () {return new ActiveXObject("Msxml2.XMLHTTP");},
			    function () {return new ActiveXObject("Msxml3.XMLHTTP");},
			    function () {return new ActiveXObject("Microsoft.XMLHTTP");}
			];

			function createXMLHTTPObject() {
			    var xmlhttp = false;
			    for (var i=0;i<XMLHttpFactories.length;i++) {
			        try {
			            xmlhttp = XMLHttpFactories[i]();
			        }
			        catch (e) {
			            continue;
			        }
			        break;
			    }
			    return xmlhttp;
			}

	    var req = createXMLHTTPObject();
	    if (!req) return;
	    var method = (postData) ? "POST" : "GET";
	    req.open(method,url,true);
	    req.setRequestHeader('User-Agent','XMLHTTP/1.0');
	    if (postData)
	        req.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	    req.onreadystatechange = function () {
	        if (req.readyState != 4) return;
	        if (req.status != 200 && req.status != 304) { return;  }
	        callback(req.responseText, url);
	    }

	    if (req.readyState == 4) return;
	    req.send(postData);
		}

	},
	loadScript: function(url, callback) {
		//console.log(cPager);
	    var head = document.getElementsByTagName('head')[0];
	    var script = document.createElement('script');
	    script.type = 'text/javascript';
	    script.src = url;
	    script.onreadystatechange = callback;
	    script.onload = function () {
        if (callback && typeof callback === 'function') {
          callback(url);
        }
      };
	    head.appendChild(script);

	}

};
