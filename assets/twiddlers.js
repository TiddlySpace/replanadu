
function Twiddlers() {
	this.title = undefined;
	this.spaceName = tiddlyweb.status.space.name;
	this._init();
}

Twiddlers.prototype.getTwiddlers = function() {
	var tag = '@' + this.spaceName;
	this._search(this.title, tag);	
};

Twiddlers.prototype._init = function() {
	this._setTitle();
}

Twiddlers.prototype._setTitle = function() {
	this.title = document.location.hash.substring(1);
};

Twiddlers.prototype._search = function(title, tag) {
	var context = this;
	var success = function(data, status, xhr) {
		console.log(data);
	};
	var url = '/search.json?q=title:"' + encodeURIComponent(title) + '" tag:' + tag;
	$.ajax({
	    url: url,
        type: 'GET', 
        success: success,
        error: this._ajaxError,
        headers: { 'X-ControlView': 'false' },
        contentType: 'application/json',
        dataType: 'json'	
	});
};

$(document).ready(function () {
	new Twiddlers().getTwiddlers();
});

