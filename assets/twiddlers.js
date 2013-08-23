
function Twiddlers() {
	this.title = undefined;
	this.spaceName = tiddlyweb.status.space.name;
	this._init();
	this.titleTemplate = this._getTemplate('#tiddler-title-template');
	this.tiddlerTemplate = this._getTemplate('#tiddler-template');
	this.listTemplate = this._getTemplate('#related-list-template');
}

Twiddlers.prototype._init = function() {
	this._setTitle();
}

Twiddlers.prototype._getTemplate = function(id) {
	return Handlebars.compile($(id).html());		
}

Twiddlers.prototype.getTwiddlers = function() {
	var tag = '@' + this.spaceName;
	this._search(this.title, tag);	
	this._getLocalTiddler(this.title);
};

Twiddlers.prototype._setTitle = function() {
	this.title = document.location.hash.substring(1);
};

Twiddlers.prototype._displayRelated = function(tiddlers) {
	$('#relatedlist').append(this.listTemplate({ tiddlers: tiddlers }));
};

Twiddlers.prototype._displayTiddler = function(tiddler) {
	$('header').html(this.titleTemplate(tiddler));
	$('#local').html(this.tiddlerTemplate({ title: tiddler.title, html: tiddler.render }))
};

Twiddlers.prototype._getLocalTiddler = function(title) {
	var context = this;
	var success = function(data) {
		context._displayTiddler(data);
	};
	this._getTiddler(title, success);
};

Twiddlers.prototype._loadTiddler = function(title) {
	var context = this;
	var success = function(data) {
		
	};
	this._getTiddler(title, success);
};

Twiddlers.prototype._getTiddler = function(title, success) {
	this._doGET('/' + encodeURIComponent(title) + '?render=1', success, this._ajaxError);
};

Twiddlers.prototype._search = function(title, tag) {
	var context = this;
	var success = function(data, status, xhr) {
		context._displayRelated(data);
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
	Handlebars.registerHelper('get_space_name', function(context, options) {
	    return context.split('_')[0];
	});	
	Handlebars.registerHelper('get_site_icon_uri', function(context, options) {
	    return 'http://' + context.split('_')[0] + '.tiddlyspace.com/SiteIcon';
	});		
});

