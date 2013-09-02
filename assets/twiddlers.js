function Twiddlers(tiddlyweb) {
    this.title = undefined;
    this.bag = undefined;
    this.tiddler = undefined;
    this.currentUser = tiddlyweb.status.username;
    this.serverHost = tiddlyweb.status.server_host;
    this.headerTemplate = this._getTemplate('#tiddler-header-template');
    this.tiddlerViewTemplate = this._getTemplate('#tiddler-view-template');
    this.tiddlerEditTemplate = this._getTemplate('#tiddler-edit-template');
    this.listTemplate = this._getTemplate('#related-list-template');
    this.followers = [];
}

Twiddlers.prototype.init = function () {
    this._setTitle();
    this._bindUIEvents();
    this._registerHandlebarsHelpers();
    this._allSearch(this.title).done(this._displayRelated);
    this.loadLocalTiddler();
};

Twiddlers.prototype._getTemplate = function (id) {
    return Handlebars.compile($(id).html());
};

Twiddlers.prototype.loadLocalTiddler = function () {
    var context = this;
    this._getLocalTiddler(this.title).done(function (data) {
        context._displayViewTiddler(data);
    });
};

Twiddlers.prototype._setTitle = function () {
    this.title = document.location.hash.substring(1);
};

Twiddlers.prototype._displayRelated = function (tiddlers) {
    var list = $('#relatedlist');
    list.empty();
    list.append(this.listTemplate({ tiddlers: this._filterOutOriginalTiddler(tiddlers, this.bag) }));
    list.find('.timeago').timeago();
};

Twiddlers.prototype._filterOutOriginalTiddler = function (tiddlers, originalBag) {
    //TODO: provide implementation for IE < 9?
    return tiddlers.filter(function (tiddler) {
        return tiddler.bag !== originalBag;
    });
};

Twiddlers.prototype._displayViewTiddler = function (tiddler) {
    $('header').html(this.headerTemplate({title: tiddler.title, user: this.currentUser }));
    $('#local').html(this.tiddlerViewTemplate({ html: tiddler.render }));
};

Twiddlers.prototype._displayEditTiddler = function (tiddler) {
    $('header').html(this.headerTemplate({title: tiddler.title, user: this.currentUser }));
    $('#local').html(this.tiddlerEditTemplate({ text: tiddler.text }));
};

Twiddlers.prototype._getLocalTiddler = function (title) {
    var deferred = new $.Deferred();
    var context = this;
    var success = function (data) {
        context.bag = data.bag;
        deferred.resolve(data);
        context.tiddler = data;
    };
    this._getTiddler(title, success);
    return deferred.promise();
};

Twiddlers.prototype.loadTiddler = function (uri, elem) {
    var success = function (data) {
        $(elem).hide().html(data.render).slideDown();
    };
    var match = 'tiddlyspace.com/';
    uri = uri.substring(uri.indexOf(match) + match.length) + '?render=1';
    this._doGET(uri, success, this._ajaxError);
};

Twiddlers.prototype._getTiddler = function (title, success) {
    this._doGET('/' + encodeURIComponent(title) + '?render=1', success, this._ajaxError);
};

Twiddlers.prototype.saveTiddler = function() {
    var context = this;
    var success = function (data) {
        context.loadLocalTiddler();
    };    
    var tiddler = this.tiddler;
    tiddler.text = $('#local textarea').val();
    this._saveTiddler(tiddler, success, this._ajaxError);
};

Twiddlers.prototype._saveTiddler = function(tiddler, success, error) {
    delete tiddler.render;
    this._doPUT('/bags/' + tiddler.bag + '/tiddlers/' + encodeURIComponent(tiddler.title), tiddler, success, error);
};

// XXX: somewhat dupe from TwiddlersCount!
// Only do this if the currentUser is not GUEST
Twiddlers.prototype._getFollowers = function () {
    if (this.followers.length === 0) {
        var context = this;
        var success = function (data, status, xhr) {
            var followers = $.trim(data).split('\n');
            context.followers = $.map(followers, function (item) {
                return item.replace(/^@/, '');
            });
            context._followSearch(context.followers).done(this._displayRelated);
        };
        var url = '/search.txt?q=bag:' + this.currentUser +
            '_public%20tag:follow' +
            '%20_limit:999';
        this._doGET(url, success, this._ajaxError);
    }
    this._followSearch(this.followers).done(this._displayRelated);
};


Twiddlers.prototype._search = function (url) {
    var context = this;
    var deferred = new $.Deferred();
    var success = function (data, status, xhr) {
        deferred.resolveWith(context, [data]);
    };
    this._doGET(url, success, this._ajaxError);
    return deferred.promise();
};

Twiddlers.prototype._allSearch = function (title) {
    var url = '/search.json?q=title:"' + encodeURIComponent(title) + '"';
    return this._search(url);
};

Twiddlers.prototype._followSearch = function (followers) {
    var url = '/search?q=title:"' + encodeURIComponent(this.title) +
        '"%20' + 'modifier:' + followers.join('%20OR%20modifier:');
    return this._search(url);
};

Twiddlers.prototype._doGET = function (url, success, error) {
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

Twiddlers.prototype._doPUT = function (url, data, success, error) {
    $.ajax({
        url: url,
        type: 'PUT',
        success: success,
        error: error,
        headers: { 'X-ControlView': 'false' },
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(data)
    });
};

Twiddlers.prototype._bindUIEvents = function () {
    $(document).on('click', '.tiddler-button', function () {
        var $button = $(this);
        var $article = $button.parent().find('.pair-content');
        var uri = $button.data('uri');
        if ($button.hasClass('open')) {
            $button.removeClass('open');
            $article.slideUp();
        } else {
            $button.addClass('open');
            if ($article.children().length === 0) {
                app.loadTiddler(uri, $button.parent().children('article'));
            } else {
                $article.slideDown();
            }
        }
    });
    $(document).on('click', '.edit-button', function () {
        app._displayEditTiddler(app.tiddler);
    });
    $(document).on('click', '.cancel-button', function () {
       app._displayViewTiddler(app.tiddler); 
    });
    $(document).on('click', '.save-button', function () {
        app.saveTiddler();
    });    
    $(document).on('click', '.close-button', function () {
        var $listItem = $(this).parent();
        $listItem.animate({ left: "+=110%" }, 600, "linear", function() {
            $listItem.remove();
        });
    });
};

Twiddlers.prototype._registerHandlebarsHelpers = function () {
    var _this = this;

    Handlebars.registerHelper('getSpaceName', function (context) {
        return context.split('_')[0];
    });

    Handlebars.registerHelper('getSpaceURI', function (context) {
        var spaceName = Handlebars.helpers.getSpaceName(context);
        return _this.serverHost.scheme + '://' + spaceName + '.' + _this.serverHost.host;
    });

    Handlebars.registerHelper('dateString', function (context) {
        return new Date(Date.UTC(
            parseInt(context.substr(0, 4), 10),
            parseInt(context.substr(4, 2), 10) - 1,
            parseInt(context.substr(6, 2), 10),
            parseInt(context.substr(8, 2), 10),
            parseInt(context.substr(10, 2), 10),
            parseInt(context.substr(12, 2) || "0", 10),
            parseInt(context.substr(14, 3) || "0", 10))).toISOString();
    });
};
