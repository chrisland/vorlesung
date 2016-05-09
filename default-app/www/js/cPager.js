

/**
* Easy JS one-Page system framework with template files
*
* @class cPager
* @version 0.2.2
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

	this._opt = {
		handler: 'pageBtn',
		tmplPath: 'tmpl',
		offButton: 'pageBtnOffline',
		container: 'page',
		start: false,
		startTask: false,
		startContent: false,
		preCache: []
	};

	if (param) {
		for (var i in param) {
			if(param.hasOwnProperty(i)){
				this._opt[i] = param[i];
			}
		}
	}

	// LOAD EXTERNAL JS TASK FILES
	if (this._opt.controller && this._opt.controller.length > 0) {
		for (var i = 0; i < this._opt.controller.length; i++) {
			this._h.loadScript(this._opt.controller[i]);
		}
	}

	// LOAD AJAX TPL PAGES
	this.ajaxCache = {};
	if (this._opt.preCache.length > 0) {
		this._h.cache(this, this._opt.preCache);
	}

	// INIT
	this._page = document.getElementById(this._opt.container);
	if (!this._page) {
		throw new Error("missing main container #"+this._opt.container);
		return false;
	}

	// START
	if ( this._lastopen ) {
		this.switch(this._lastopen);
	} else {
		if (this._opt.start) {
			this.switch(this._opt.start,this._opt.startTask, this._opt.startContent);
		}
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

	//console.log('this.switch.task - '+pageId+' - '+pageTask+' - '+pageContent);


	//console.log(this.get());
	//console.log('switch', pageId, pageTask, pageContent);
	var event = null;
	if (param && param.event) {
		event = param.event;
	}
	this.switch.task = this._h.changeContent( event, pageTask, pageContent, pageId, this);

	//console.log(this.switch.task);

	if (this.switch.task) {
		this._h.switchDom(this, pageId, pageTask, pageContent, param);
	}

	//console.log('----------------------------------');
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

	//console.log('events');

	var that = this;
	var clickHandler = function (e) {

		if (this.classList.contains(that._opt.offButton)) {
			return false;
		}

		var pageId = this.getAttribute('data-page'),
			pageTask = this.getAttribute('data-task'),
			pageContent = this.getAttribute('data-content'),
			pageContainer = this.getAttribute('data-container') || false,
			pageAnimate = this.getAttribute('data-animate') || false,
			pageDuration = this.getAttribute('data-duration') || false,
			pageDirection = this.getAttribute('data-direction') || false,
			pageForce = this.getAttribute('data-force') || false;

		//console.log('clickHandler', pageId, pageTask, pageContent);

		if ( pageId || pageTask ) {
			if (that._open == pageId && !pageForce) {
				return false;
			}
			//console.log('- do click');
      		var param = {
				event: e,
				animate: pageAnimate,
				duration: pageDuration,
				direction: pageDirection
			};
			if (pageContainer) {
				param.container = pageContainer;
			}
			// console.log(pageId);
			// console.log(pageTask);
			// console.log(pageContent);
			// console.log(param);

			that.switch(pageId, pageTask, pageContent, param);
		}
	};

	var pageBtns = document.getElementsByClassName(this._opt.handler);
	for(var i = 0; i < pageBtns.length; i++) {
		pageBtns[i].style.curser = 'pointer';  // IOS BUG
		//pageBtns[i].addEventListener('click',clickHandler);
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
	}
	return true;
};







cPager.prototype.addHistory = function (pageId, pageTask, pageContent) {

	if (pageId) {
		var obj = {
			id: pageId,
			task: pageTask,
			content: pageContent
		};
		this._history.push(obj);
		return true;
	}
	return false;
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
* @version 0.1.6
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

	changeContent : function (e, task, content, pageId, that) {

		//console.log('changeContent', e, task, content, pageId);
		//console.log(content);

		if (task == 'back') {
			var anz = 2;
			var history = that.getHistory();
			var last = history[history.length -anz];
			if (!last) { return false; }
			if (last.id) {
				that.switch(last.id,last.task,last.content);
				that.removeHistory(anz);
			}
			return true;

		} else if (that._opt.tasks && task) {
			var t = task.split('.');
			//console.log(task);
			//console.log(t);
			if (t.length > 0) {
				if ( t[0] && t[1] && that._opt.tasks[t[0]] && that._opt.tasks[t[0]][t[1]] ) {
					//console.log('deep');
					var func = that._opt.tasks[t[0]][t[1]];
					var scope = that._opt.tasks[t[0]];
				} else if ( t[0] && that._opt.tasks[t[0]] ) {
					var func = that._opt.tasks[t[0]];
					var scope = that._opt.tasks;
				}
				//console.log(that._opt.tasks);
				//console.log(func);
				if (func && typeof func === 'function') {
					return func(pageId,content,e,that._page,scope);
				}
			}
		}
		return true;
	},
	switchSuccess: function (that, pageId, pageTask, pageContent, dom) {

		if (typeof that.switch.task === "function") {
			that.switch.afterAnimate = that.switch.task(dom || that._page)
		}
		that.events();
		that.addHistory(pageId, pageTask, pageContent);
	},
	animateSuccess: function (that) {

		if (typeof that.switch.afterAnimate === "function") {
			that.switch.afterAnimate();
		}

	},
	ajaxSuccess: function (response, pageId, pageTask, pageContent, that, param) {

		var temp_page = that._page;

	    if (param && param.container) {
	       temp_page = document.getElementById(param.container);

	    	if (!temp_page) {
	    		throw new Error("missing container #"+this._opt.container);
	    		return false;
	    	}
	    }

		if (param && param.animate) {

			var box = document.createElement('div');
			box.id = that._opt.container;
			box.innerHTML = response;
			box.style.position = 'absolute';
			document.body.insertBefore(box, temp_page.nextSibling);

			temp_page.id = that._opt.container+'Temp';
			temp_page.style.width = box.clientWidth+'px';
			temp_page.style.height = box.clientHeight+'px';
			temp_page.style.position = 'absolute';

			var delta = that._h.easingFunctions[param.animate],
				dir = false,
				move = false;

			if (!delta) {
				delta = that._h.easingFunctions.linear;
			}

			if (param.direction == 'right') {
				box.style.left = (temp_page.offsetWidth * (-1) )+'px';
				box.style.top = temp_page.offsetTop+'px';
				move = [temp_page.offsetWidth * (-1), parseInt(temp_page.offsetLeft), parseInt(temp_page.offsetLeft), temp_page.offsetWidth];

			} else if (param.direction == 'top') {
				box.style.left = temp_page.offsetLeft+'px';
				box.style.top = temp_page.offsetHeight+'px';
				move = [parseInt(box.style.top), parseInt(temp_page.offsetTop), parseInt(temp_page.offsetTop), temp_page.offsetHeight * (-1)];
				dir = true;

			} else if (param.direction == 'bottom') {
				box.style.left = temp_page.offsetLeft+'px';
				box.style.top = '-'+temp_page.offsetHeight+'px';
				move = [parseInt(box.style.top), parseInt(temp_page.offsetTop), parseInt(temp_page.offsetTop), temp_page.offsetHeight];
				dir = true;

			} else {
				box.style.left = temp_page.offsetWidth+'px';
				box.style.top = temp_page.offsetTop+'px';
				move = [parseInt(box.style.left), parseInt(temp_page.offsetLeft), parseInt(temp_page.offsetLeft), temp_page.offsetWidth * (-1)];
			}

			if (!move) {
				return false;
			}

			move[4] = move[1] - move[0];
			move[5] = move[3] - move[2];

			  that._h.animate({
			    delay: 10,
			    duration: param.duration || 600,
			    delta: delta,
			    step: function(delta) {
						if (dir) {
							box.style.top = (( move[4] * delta ) + move[0]) + 'px';
							temp_page.style.top = (( move[5] * delta ) + move[2]) + 'px';
						} else {
							box.style.left = (( move[4] * delta ) + move[0]) + 'px';
							temp_page.style.left = (( move[5] * delta ) + move[2]) + 'px';
						}
			    },
					end: function () {
						temp_page.remove();
						that._page = box;
						that._h.animateSuccess(that);
					}
			  });

    	} else { // no animation
			temp_page.innerHTML = response;
		}

		that._lastopen = that._open;
		that._open = pageId;
		this.switchSuccess(that, pageId, pageTask, pageContent, box || that._page);
	},
	ajax: function (that, path, pageId, pageTask, pageContent, param ) {

		var thatAjax = this;
		if ( that.ajaxCache[path] ) {
			thatAjax.ajaxSuccess(that.ajaxCache[path], pageId, pageTask, pageContent, that, param);
		} else {
			this.sendRequest(path,function (req) {
				that.ajaxCache[path] = req.responseText;
				thatAjax.ajaxSuccess(req.responseText, pageId, pageTask, pageContent, that, param);
			});
		}
	},
	cache: function (that, arr) {

		for (var i=0;i<arr.length;i++) {
			var path = './'+that._opt.tmplPath+'/'+arr[i]+'.tpl';
			//console.log(path);
			this.sendRequest(path,function (req, url) {
				//console.log(req.responseText);
				that.ajaxCache[url] = req.responseText;
				//console.log(url, that.ajaxCache);
			});
		}
	},
	switchDom : function (that, pageId, pageTask, pageContent, param) {

		if (pageId) {
			this.ajax( that, './'+that._opt.tmplPath+'/'+pageId+'.tpl', pageId, pageTask, pageContent, param);
		}
		return false;
	},
	sendRequest: function (url,callback,postData) {

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
	        if (req.status != 200 && req.status != 304) {
			//          alert('HTTP error ' + req.status);
	            return;
	        }
	        callback(req, url);
	    }
	    if (req.readyState == 4) return;
	    req.send(postData);
	},
	loadScript: function(url, callback) {
	    // Adding the script tag to the head as suggested before
	    var head = document.getElementsByTagName('head')[0];
	    var script = document.createElement('script');
	    script.type = 'text/javascript';
	    script.src = url+'.js';

	    // Then bind the event to the callback function.
	    // There are several events for cross browser compatibility.
	    script.onreadystatechange = callback;
	    script.onload = callback;

	    // Fire the loading
	    head.appendChild(script);
	},
	animate: function(opts) {

		if ( !opts.delay || !opts.duration || !opts.delta || !opts.step ) {
			return false;
		}
	  var start = new Date;
	  var id = setInterval(function() {
	    var timePassed = new Date - start;
	    var progress = timePassed / opts.duration;

	    if (progress > 1) progress = 1;

	    var delta = opts.delta(progress);
	    opts.step(delta);

	    if (progress == 1) {
	      clearInterval(id);
				if (opts.end) {
					opts.end();
				}
	    }
	  }, opts.delay || 10);

	},
	easingFunctions: {
	  // no easing, no acceleration
	  linear: function (t) { return t },
	  // accelerating from zero velocity
	  easeInQuad: function (t) { return t*t },
	  // decelerating to zero velocity
	  easeOutQuad: function (t) { return t*(2-t) },
	  // acceleration until halfway, then deceleration
	  easeInOutQuad: function (t) { return t<0.5 ? 2*t*t : -1+(4-2*t)*t },
	  // accelerating from zero velocity
	  easeInCubic: function (t) { return t*t*t },
	  // decelerating to zero velocity
	  easeOutCubic: function (t) { return (--t)*t*t+1 },
	  // acceleration until halfway, then deceleration
	  easeInOutCubic: function (t) { return t<0.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
	  // accelerating from zero velocity
	  easeInQuart: function (t) { return t*t*t*t },
	  // decelerating to zero velocity
	  easeOutQuart: function (t) { return 1-(--t)*t*t*t },
	  // acceleration until halfway, then deceleration
	  easeInOutQuart: function (t) { return t<0.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
	  // accelerating from zero velocity
	  easeInQuint: function (t) { return t*t*t*t*t },
	  // decelerating to zero velocity
	  easeOutQuint: function (t) { return 1+(--t)*t*t*t*t },
	  // acceleration until halfway, then deceleration
	  easeInOutQuint: function (t) { return t<0.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }
	}


};
