.PHONY: clean lib compass jshint lint testlib

ASSETS := $(wildcard assets/*)

download = curl --location -f --output $(1) --time-cond $(1) --remote-time $(2)

clean:
	rm -rf .sass-cache || true

lib:
	$(call download, "assets/handlebars-1.0.0.js", \
		"https://raw.github.com/wycats/handlebars.js/1.0.0/dist/handlebars.js")
	$(call download, "assets/modernizr-2.6.2.js", \
		"http://modernizr.com/downloads/modernizr-latest.js")

testlib:
	mkdir test/lib || true
	$(call download, "test/lib/jasmine-html.js", \
		"https://raw.github.com/pivotal/jasmine/v1.3.1/lib/jasmine-core/jasmine-html.js")
	$(call download, "test/lib/jasmine.js", \
		"https://raw.github.com/pivotal/jasmine/v1.3.1/lib/jasmine-core/jasmine.js")
	$(call download, "test/lib/jasmine.css", \
		"https://raw.github.com/pivotal/jasmine/v1.3.1/lib/jasmine-core/jasmine.css")
	$(call download, "test/lib/jasmine-jquery.js", \
		"https://raw.github.com/velesin/jasmine-jquery/master/lib/jasmine-jquery.js")
	$(call download, "test/lib/sinon-1.7.3.js", \
		"http://sinonjs.org/releases/sinon-1.7.3.js")
	$(call download, "test/lib/run-jasmine.js", \
		"https://raw.github.com/ariya/phantomjs/master/examples/run-jasmine.js")
	$(call download, "test/lib/blanket.min.js", \
		"https://raw.github.com/alex-seville/blanket/master/dist/qunit/blanket.min.js")
	$(call download, "test/lib/jasmine-blanket.js", \
		"https://raw.github.com/alex-seville/blanket/master/src/adapters/jasmine-blanket.js")

compass:
	compass compile

deploy: lib compass lint test push

push: 
	@for asset in $(ASSETS); do tsapp push_hard replanadu_public `echo $$asset | cut -d '/' -f 2` ; done
	tsapp push_hard replanadu_public replanadu.html

jshint:
	# may need sudo
	which jshint ; if [ $$? -ne 0 ] ; then npm install -g jshint ; fi

lint: jshint
	jshint assets/twiddlers*.js

phantomjs:
	# may need sudo
	which phantomjs ; if [ $$? -ne 0 ] ; then npm install -g phantomjs ; fi

test: testlib phantomjs
	phantomjs test/lib/run-jasmine.js test/SpecRunner.html

build:
	make clean lib compass lint test
