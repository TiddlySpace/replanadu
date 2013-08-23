
function TwiddlersCount() {
	this.baseUrl = '';
}

TwiddlersCount.prototype._search = function(title, tag) {
	var success = function(data, status, xhr) {
		console.log(data);
	};
	$.getJSON('/search.json?q=title:"' + title + '" tag:' + tag, success, this._ajaxError);
};

TwiddlersCount.prototype._ajaxError = function(xhr, err, exc) {
	console.log('Error');
};
