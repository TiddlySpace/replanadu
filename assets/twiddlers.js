
function Twiddlers() {
	this.title = undefined;
	this.spaceName = tiddlyweb.status.space.name;
	this._init();
}

Twiddlers.prototype.getTwiddlers = function() {
	var tag = '@' + this.spaceName;
	this._search(this.title, tag);	
	this._getLocalTiddler(this.title);
};

Twiddlers.prototype._init = function() {
	this._setTitle();
}

Twiddlers.prototype._setTitle = function() {
	this.title = document.location.hash.substring(1);
};

Twiddlers.prototype._displayTiddler = function(tiddlerData, place) {
	place.html(tiddlerData.render);
	place.prepend('<h1>' + tiddlerData.title + '</h1>');
};

Twiddlers.prototype._getLocalTiddler = function(title) {
	var context = this,
		place = $('#local');
	var success = function(data) {
		context._displayTiddler(data, place);
	};
	this._doGET('/' + encodeURIComponent(title) + '?render=1', success, this._ajaxError);
};


Twiddlers.prototype._search = function(title, tag) {
	var context = this;
	var success = function(data, status, xhr) {
		console.log(data);
	};
	var url = '/search.json?q=title:"' + encodeURIComponent(title) + '" tag:' + tag;
	this._doGET(url, success, this._ajaxError);
};

Twiddlers.prototype._doGET = function(url, success, error) {
	$.ajax({
	    url: url,
        type: 'GET', 
        success: success,
        error: error,
        headers: { 'X-ControlView': 'false' },
        contentType: 'application/json',
        dataType: 'json'	
	});	
};

$(document).ready(function () {
	new Twiddlers().getTwiddlers();
});
