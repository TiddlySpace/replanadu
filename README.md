replanadu
=========

A hack to navigate tiddlyspace replies

#Contributing

## Running the Application

1. Check out this repository.
2. Install [tsapp](http://tsapp.tiddlyspace.com/) via [pip](http://www.pip-installer.org/en/latest/): `pip install -U tsapp`.
3. Run `tsapp serve` and navigate to `http://localhost:8080/GettingStarted.html`

All code apart from the [Sass](http://sass-lang.com/) files lives in `assets`.

## Space Inclusion

Include `replanadu` in your space.

Create/edit the HtmlJavascript tiddler and add the following:

    /bags/common/tiddlers/jquery.js
    /bags/common/tiddlers/_reply-loader.js
    /bags/common/tiddlers/backstage.js
    /status.js
    /bags/replanadu_public/tiddlers/twiddlerscount.js

Navigating to any tiddler e.g. `/GettingStarted` should load the replanadu icon.
Clicking on it will load the related tiddlers view.

## Generating CSS

To generate the required CSS you will need [Ruby](http://ruby-lang.org/) and the [Compass](http://compass-style.org/) gem:

    gem install compass

Then run:

    compass compile

This will produce/overwrite `replanadu.css` in the `assets` folder.  At present, both Sass and CSS files need to be committed.