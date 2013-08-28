[![Build Status](https://travis-ci.org/TiddlySpace/replanadu.png)](https://travis-ci.org/TiddlySpace/replanadu)

replanadu
=========

A hack to navigate tiddlyspace replies

#Contributing

## Running the Application

1. Check out this repository.
2. Install [tsapp](http://tsapp.tiddlyspace.com/) via [pip](http://www.pip-installer.org/en/latest/): `pip install -U tsapp`.
3. Run `make lib` to fetch dependencies.
4. Run `tsapp serve` and navigate to `http://localhost:8080/GettingStarted.html`

You should also install [Node.js](http://nodejs.org/) if you want to run tests and JS linting.

All code apart from the [Sass](http://sass-lang.com/) files lives in `assets`.

## Space Inclusion

Include `replanadu` in your space.

Create/edit the HtmlJavascript tiddler and add the following:

    /status.js
    /bags/replanadu_public/tiddlers/twiddlerscount.js

Navigating to any tiddler e.g. `/GettingStarted` should load the replanadu icon.
Clicking on it will load the related tiddlers view.

## Generating CSS

To generate the required CSS you will need [Ruby](http://ruby-lang.org/) and the [Compass](http://compass-style.org/) gem:

    gem install compass

Then run:

    make compass

This will produce/overwrite `replanadu.css` in the `assets` folder.  At present, both Sass and CSS files need to be committed.

## Testing

### Command line

    make test

This downloads the test dependencies (if not already there) and runs the tests via [PhantomJS](http://phantomjs.org/)

### In Browser

If the test dependencies haven't yet been downloaded:

    make testlib

Run a local web server and load `test/SpecRunner.html` into a browser.

## Deployment

    make deploy

You will need to be a member of the replanadu space to deploy assets to it.
If you are, make sure you have run `tsapp auth` once, prior to deployment.
