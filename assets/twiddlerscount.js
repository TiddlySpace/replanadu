
function TwiddlersCount() {
	this.baseUrl = '';
	this.spaceName = 'replanadu';
	this._init();
}

TwiddlersCount.prototype.go = function() {
	var tag = '@' + this.spaceName;
	this._search(this.title, tag);
};

TwiddlersCount.prototype._init = function() {
	this.title = $('#title').text();;
	this._setSpaceName();
}

TwiddlersCount.prototype._setSpaceName = function() {
	var domains = document.location.hostname.split('.');
	if (domains.length > 1) {
		this.spaceName = domains[0];
	}
}

TwiddlersCount.prototype.addButton = function(count) {
	var button = $("<a>Twiddlers(" + count + ")</a>");
	button.attr('href', '/replanadu#' + encodeURIComponent(this.title));
	$('#container').append(button);
}

TwiddlersCount.prototype._search = function(title, tag) {
	var context = this;
	var success = function(data, status, xhr) {
		console.log(data);
		context.addButton(data.length);
	};
	$.getJSON('/search.json?q=title:"' + encodeURIComponent(title) + '" tag:' + tag, success, this._ajaxError);
};

TwiddlersCount.prototype._ajaxError = function(xhr, err, exc) {
	console.log('Error');
};

$(document).ready(function () {
	new TwiddlersCount().go();
});
