
function TwiddlersCount() {
	this.baseUrl = '';
	this.spaceName = 'replanadu';
	this._setSpaceName();
}

TwiddlersCount.prototype.go = function() {
	var title =  $('#title').text();
	var tag = '@' + this.spaceName;
	this._search(title, tag);
};

TwiddlersCount.prototype._setSpaceName = function() {
	var domains = document.location.hostname.split('.');
	if (domains.length > 1) {
		this.spaceName = domains[0];
	}
}

TwiddlersCount.prototype.addButton = function(count) {
	var button = $("<button>Twiddlers(" + count + ")</button>");
	$('#container').append(button);
}

TwiddlersCount.prototype._search = function(title, tag) {
	var context = this;
	var success = function(data, status, xhr) {
		console.log(data);
		context.addButton(data.length);
	};
	$.getJSON('/search.json?q=title:"' + title + '" tag:' + tag, success, this._ajaxError);
};

TwiddlersCount.prototype._ajaxError = function(xhr, err, exc) {
	console.log('Error');
};

$(document).ready(function () {
	new TwiddlersCount().go();
});
