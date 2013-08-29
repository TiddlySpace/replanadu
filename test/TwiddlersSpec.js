describe("Twiddlers", function () {

    jasmine.getFixtures().fixturesPath = "fixtures";

    var twiddlers;
    var stubbedTiddlyweb = {};

    beforeEach(function () {
        stubbedTiddlyweb.status = {
            username: "colmjude",
            server_host: {
                scheme: "http",
                host: "tiddlyspace.org"
            }
        };
        loadFixtures("Replanadu.html");
        document.location.hash = "#About";

        twiddlers = new Twiddlers(stubbedTiddlyweb);
    });

    describe("Construction", function () {

        it("should know the current user", function () {
            expect(twiddlers.currentUser).toBe("colmjude");
        });

        it("should know the host details", function () {
            expect(twiddlers.serverHost).toBe(stubbedTiddlyweb.status.server_host);
        });
    });

    describe("Initialisation", function () {

        it("should get the title from the URI hash", function () {
            twiddlers._setTitle();

            expect(twiddlers.title).toBe("About");
        });
    });

    describe("Handlebars Custom Helpers", function () {

        beforeEach(function () {
            twiddlers._registerHandlebarsHelpers();
        });

        it("should register getSpaceName", function () {
            expect(typeof(Handlebars.helpers.getSpaceName)).toBe("function");
        });

        it("should register getSpaceURI", function () {
            expect(typeof(Handlebars.helpers.getSpaceURI)).toBe("function");
        });

        it("should register dateString", function () {
            expect(typeof(Handlebars.helpers.dateString)).toBe("function");
        });

        it("should extract the space name from a TiddlySpace bag name", function () {
            var spaceName = Handlebars.helpers.getSpaceName("cdent_public");
            expect(spaceName).toBe("cdent");
        });

        it("should extract the space URI from a TiddlySpace bag name", function () {
            var spaceName = Handlebars.helpers.getSpaceURI("cdent_public");
            expect(spaceName).toBe("http://cdent.tiddlyspace.org");
        });

        it("should extract the space URI from a TiddlySpace username", function () {
            var spaceName = Handlebars.helpers.getSpaceURI("patrickmooney");
            expect(spaceName).toBe("http://patrickmooney.tiddlyspace.org");
        });

        it("should return a date string in ISO format", function () {
            var dateString = Handlebars.helpers.dateString("20130822022920");
            expect(dateString).toBe("2013-08-22T02:29:20.000Z");
        });
    });

    describe("Get Local Tiddler", function () {

        var stubbedAjax;

        beforeEach(function () {
            stubbedAjax = sinon.stub($, "ajax");
        });

        afterEach(function () {
            stubbedAjax.restore();
        });

        it("should get the tiddler using the correct URI", function () {
            twiddlers._getLocalTiddler("About");

            sinon.assert.calledWithMatch(stubbedAjax, {
                url: '/About?render=1',
                headers: { 'X-ControlView': 'false' }
            });
        });

        it("should resolve on success", function () {
            stubbedAjax.yieldsTo("success", {
                // This would be a complete tiddler JSON object
                bag: "puss"
            });
            var spy = sinon.spy();

            var promise = twiddlers._getLocalTiddler("About");

            // When the local tiddler response is successful, the promise should call the
            // function passed to done.  The spy represents an action that would happen
            // next (e.g. display tiddler).
            promise.done(spy);

            expect(spy.called).toBeTruthy();
        });
    });

    describe("Get Related Tiddlers", function () {

        var stubbedAjax;

        beforeEach(function () {
            stubbedAjax = sinon.stub($, "ajax");
            twiddlers._setTitle();
        });

        afterEach(function () {
            stubbedAjax.restore();
        });

        it("should search for the all tiddlers using the correct URI", function () {
            twiddlers._allSearch("About");

            sinon.assert.calledWithMatch(stubbedAjax, {
                url: '/search.json?q=title:"About"',
                headers: { 'X-ControlView': 'false' }
            });
        });

        it("should resolve on success when searching for all tiddler", function () {
            stubbedAjax.yieldsTo("success", [
                // This would be a an array of complete tiddler JSON objects
                { bag: "puss" },
                { bag: "tea" }
            ]);
            var spy = sinon.spy();

            var promise = twiddlers._allSearch("About");

            promise.done(spy);

            expect(spy.called).toBeTruthy();
        });

        it("should search for tiddlers from followers using the correct URI", function () {
            twiddlers._followSearch(["pads", "cdent"]);

            sinon.assert.calledWithMatch(stubbedAjax, {
                url: '/search?q=title:"About"%20modifier:pads%20OR%20modifier:cdent',
                headers: { 'X-ControlView': 'false' }
            });
        });

        it("should resolve on success when searching for all tiddler", function () {
            stubbedAjax.yieldsTo("success", [
                { bag: "puss" },
                { bag: "tea" }
            ]);
            var spy = sinon.spy();

            var promise = twiddlers._followSearch(["pads", "cdent"]);

            promise.done(spy);

            expect(spy.called).toBeTruthy();
        });
    });
});