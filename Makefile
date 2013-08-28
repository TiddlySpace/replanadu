.PHONY: clean lib compass jshint lint

download = curl --location -f --output $(1) --time-cond $(1) --remote-time $(2)

clean:
	rm -rf .sass-cache || true

lib:
	$(call download, "assets/handlebars-1.0.0.js", \
		"https://raw.github.com/wycats/handlebars.js/1.0.0/dist/handlebars.js")
	$(call download, "assets/modernizr-2.6.2.js", \
		"http://modernizr.com/downloads/modernizr-latest.js")

compass:
	compass compile

deploy: lib compass lint
	tsapp push_hard replanadu_public

jshint:
	# may need sudo
	which jshint ; if [ $$? -ne 0 ] ; then npm install -g jshint ; fi

lint: jshint
	jshint assets/twiddlers*.js
