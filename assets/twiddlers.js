
function Twiddlers() {
	this.title = undefined;
	this.currentUser = tiddlyweb.status.username;
	this._init();
	this.titleTemplate = this._getTemplate('#tiddler-title-template');
	this.tiddlerTemplate = this._getTemplate('#tiddler-template');
	this.listTemplate = this._getTemplate('#related-list-template');
	this.followers = [];
}

Twiddlers.prototype._init = function() {
	this._setTitle();
    this.getTwiddlers();
};

Twiddlers.prototype._getTemplate = function(id) {
	return Handlebars.compile($(id).html());		
};

Twiddlers.prototype.getTwiddlers = function() {
	this._allSearch(this.title);	
	this._getLocalTiddler(this.title);
};

Twiddlers.prototype._setTitle = function() {
	this.title = document.location.hash.substring(1);
};

Twiddlers.prototype._displayRelated = function(tiddlers) {
	$('#relatedlist').empty();
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

Twiddlers.prototype.loadTiddler = function(uri, elem) {
	var success = function(data) {
		$(elem).html(data.render);
	};
    var match = 'tiddlyspace.com/';
    uri = uri.substring(uri.indexOf(match) + match.length) + '?render=1';
    this._doGET(uri, success, this._ajaxError);
};

Twiddlers.prototype._getTiddler = function(title, success) {
	this._doGET('/' + encodeURIComponent(title) + '?render=1', success, this._ajaxError);
};

// XXX: somewhat dupe from TwiddlersCount!
Twiddlers.prototype._getFollowers = function() {
	if (this.followers.length == 0) {
		var context = this;
		var success = function(data, status, xhr) {
			var followers = $.trim(data).split('\n');
			context.followers = $.map(followers, function(item) {
				return item.replace(/^@/, '');
			});
			context._followSearch(context.followers);
		};
		var url = '/search.txt?q=bag:' + this.currentUser
			+ '_public%20tag:follow'
			+ '%20_limit:999';
		this._doGET(url, success, this._ajaxError);
	}
	this._followSearch(this.followers);
};


Twiddlers.prototype._search = function(url) {
	var context = this;
	var success = function(data, status, xhr) {
		context._displayRelated(data);
	};
	this._doGET(url, success, this._ajaxError);
};

Twiddlers.prototype._allSearch = function(title) {
	var url = '/search.json?q=title:"' + encodeURIComponent(title) + '"';
	this._search(url);
}

Twiddlers.prototype._followSearch = function(followers) {
	var url = '/search?q=title:"' + encodeURIComponent(this.title) +
		'"%20' + 'modifier:' + followers.join('%20OR%20modifier:');
	this._search(url);
}

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

var app = undefined;
$(document).ready(function () {
    app = new Twiddlers();
	Handlebars.registerHelper('get_space_name', function(context, options) {
	    return context.split('_')[0];
	});	
	Handlebars.registerHelper('get_site_icon_uri', function(context, options) {
	    return 'http://' + context + '.tiddlyspace.com/SiteIcon';
	});		
	$(document).on('click', '.tiddler-button', function() {
		var uri = $(this).data('uri');
		app.loadTiddler(uri, $(this).parent().children('article'));
	});
});
