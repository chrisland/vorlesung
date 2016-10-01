/**
* Easy JS Overlays with svg-animation
*
* @class cOverlay
* @version 0.0.1
* @license MIT
*
* @author Christian Marienfeld post@chrisand.de
*
* ### Examples:
*
*	var myOverlay = new cOverlay();
*
*	var myOverlay = new cOverlay({
*		size: 5,
* 	root: '../img'
*		file: 'spinner_default.svg'
*		}
*	});
*
*	myOverlay.show();
*
*	myOverlay.hide();
*
*	myOverlay.show(600); // will hide after 600ms
*
*
* @return {Object} cOverlay Object
*
* @api public
*/



function cOverlay(param) {

	this._timerOverlay;
	this._page = document.body;

	this._opt = {
		size: 3,
		file: 'spinner_default.svg',
		root: './img'
	};

	if (param) {
		for (var i in param) {
			if(param.hasOwnProperty(i)){
				this._opt[i] = param[i];
			}
		}
	}

	// INIT
	if (this._opt.container) {
		this._page = document.getElementById(this._opt.container);
	}

	if (!this._page) {
		throw new Error("missing main container #"+this._opt.container);
		this._page = document.body;
	}


	// APPEND

	var pieceWidth = this._page.offsetWidth / this._opt.size;

	var wrapPosition = {
		top: ( this._page.offsetHeight / 2 ) - ( pieceWidth / 2 ),
		left: ( this._page.offsetWidth / 2 ) - ( pieceWidth / 2 )
	};

	this._wrap = document.createElement('div');
	this._wrap.id = 'cOverlay-'+(Math.floor(Math.random()*11)+2)*(Math.floor(Math.random()*11)+2);
	this._wrap.className = 'cOverlay';
	this._wrap.style.backgroundImage = 'url('+this._opt.root+'/'+this._opt.file+')';
	this._wrap.style.backgroundSize = '100% 100%';
	this._wrap.style.backgroundPosition = 'center center';
	this._wrap.style.backgroundRepeat = 'no-repeat';
	this._wrap.style.display = 'none';

	this._wrap.style.position = 'absolute';

	this._wrap.style.top = wrapPosition.top+'px';
	this._wrap.style.left = wrapPosition.left+'px';
	this._wrap.style.width = pieceWidth+'px';
	this._wrap.style.height = pieceWidth+'px';

	this._page.appendChild(this._wrap);


	return this;
}



/**
* Show Overlay
*
* ### Examples:
*
*	var myOverlay = new cOverlay()
*
*	myOverlay.show();
*
*	myOverlay.show(600);
*
*
* @function show
* @version 0.0.1
*
* @param {Integer} [time=undefined] Optional Parameter for Timeout
* @param {Function} [callback=undefined] Optional Callback after show Overlay
*
* @return {Object} cOverlay object
*
* @api public
*/


cOverlay.prototype.show = function (time, callback) {

	this._wrap.style.display = 'block';

	var that = this;

	if (time && typeof time !== 'function') {
		clearTimeout(this._timerOverlay);
		this._timerOverlay = setTimeout(function (){
			that.hide();

			if (callback &&  typeof callback === 'function') {
				callback(that);
			}

		},time);
	} else if (typeof time === 'function') {
		time(that);
	}

	return this;

};



/**
* Hide Overlay
*
* ### Examples:
*
*	var myOverlay = new cOverlay()
*
*	myOverlay.show().hide();
*
*	myOverlay.hide();
*
*
* @function hide
* @version 0.0.1
*
*
* @return {Object} cOverlay object
*
* @api public
*/

cOverlay.prototype.hide = function () {

	this._wrap.style.display = 'none';
	clearInterval(this._timerOverlay);

	return this;
};


/**
* Destroy Overlay
*
* ### Examples:
*
*	var myOverlay = new cOverlay()
*
*	myOverlay.show().destroy();
*
*	myOverlay.destroy();
*
*
* @function destroy
* @version 0.0.1
*
*
*
* @api public
*/

cOverlay.prototype.destroy = function () {

	document.body.removeChild(this._wrap);
	clearInterval(this._timerOverlay);

	return false;
};
