
function TwiddlersCount() {
	this.baseUrl = '';
	this.title = undefined;
	this.spaceName = 'replanadu';
	this.targetURI = 'replanadu.html';
	this._init();
}

TwiddlersCount.prototype.count = function() {
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
		this.targetURI = 'replanadu';
	}
}

TwiddlersCount.prototype.addButton = function(count) {
	var button = $("<a>Twiddlers(" + count + ")</a>");
	button.attr('target', '_blank');
	button.attr('href', '/' + this.targetURI + '#' + encodeURIComponent(this.title));
	$('#container').append(button);
}

TwiddlersCount.prototype._search = function(title, tag) {
	var context = this;
	var success = function(data, status, xhr) {
		context.addButton(data.length);
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

TwiddlersCount.prototype._ajaxError = function(xhr, err, exc) {
	console.log('Error');
};

$(document).ready(function () {
	new TwiddlersCount().count();
});
