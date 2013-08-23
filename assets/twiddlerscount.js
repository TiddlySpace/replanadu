(function () {
	"use strict";

	var allImage = '/bags/replanadu_public/tiddlers/replanadu-white.png';
	var followImage = '/bags/replanadu_public/tiddlers/replanadu-gold.png';

	function TwiddlersCount() {
		this.baseUrl = '';
		this.title = undefined;
		this.currentUser = tiddlyweb.status.username;
		this.targetURI = window.location.href.match(
			tiddlyweb.status.server_host.host)
				? 'replanadu' : 'replanadu.html';
		this._init();
	}

	TwiddlersCount.prototype.search = function() {
		this._getFollowers();
	};

	TwiddlersCount.prototype._init = function() {
		this.title = $('#title').text();
	};

	TwiddlersCount.prototype._getFollowers = function() {
		var context = this;
		var success = function(data, status, xhr) {
			var followers = $.trim(data).split('\n');
			followers = $.map(followers, function(item) {
				return item.replace(/^@/, '');
			});
			context._search(followers);
		};
		var url = '/search.txt?q=bag:' + this.currentUser
			+ '_public%20tag:follow'
			+ '%20_limit:999';
		this._doGET(url, success, this._ajaxError);
	};

	TwiddlersCount.prototype.addButton = function(value) {
		var img = $('<img>');
		var button = $('<a>');
		img.attr({
			src: allImage,
			alt: 'twinned tiddlers'
		});
		button.attr('id', 'twiddlers');
		button.attr('target', '_blank');
		button.attr('data-twiddlerall', value);
		button.attr('href', '/' + this.targetURI + '#'
				+ encodeURIComponent(this.title));
		button.addClass('twiddlers');
		button.addClass('twiddlerall');
		// using CSS becuase we are a remote include widget
		button.css({
			position: 'absolute',
			border: 0,
			background: 'transparent',
			top: '1px',
			right: '80px',
			opacity: 0.5
		});
		// XXX: set opacity on hover

		button.append(img);
		$('#container').append(button);
	};

	TwiddlersCount.prototype.updateButton = function(value) {
		var button = $('#twiddlers');
		var img = button.find('img');
		button.attr('data-tiddlerfollow', value);
		button.addClass('twiddlerfollow');
		img.attr('src', followImage);
	};

	TwiddlersCount.prototype._followSearch = function(followers) {
		var context = this;
		var followSuccess = function(data, status, xhr) {
			context.updateButton($.trim(data).split('\n').length);
		};
		var followUrl = '/search.txt?q=title:"' + encodeURIComponent(this.title) +
			'"%20' + 'modifier:' + followers.join('%20OR%20modifier:');
		this._doGET(followUrl, followSuccess, this._ajaxError);
	};

	TwiddlersCount.prototype._search = function(followers) {
		var context = this;
		var allSuccess = function(data, status, xhr) {
			context.addButton($.trim(data).split('\n').length);
			context._followSearch(followers);
		};
		var allUrl = '/search.txt?q=title:"' + encodeURIComponent(this.title) +
			'"';
		this._doGET(allUrl, allSuccess, this._ajaxError);
	};

	TwiddlersCount.prototype._doGET = function(url, success, error) {
		$.ajax({
			url: url,
			type: 'GET',
			success: success,
			error: error,
			headers: { 'X-ControlView': 'false' },
			contentType: 'text/plain',
			dataType: 'text'
		});
	};

	TwiddlersCount.prototype._ajaxError = function(xhr, err, exc) {
		console.log('Error', err, exc);
	};

	$(document).ready(function () {
		new TwiddlersCount().search();
	});

}());
