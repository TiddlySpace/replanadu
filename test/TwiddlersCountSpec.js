describe("TwiddlersCount", function () {

    jasmine.getFixtures().fixturesPath = "fixtures";

    var twiddlersCount;
    var stubbedTiddlyweb = {};

    beforeEach(function () {
        stubbedTiddlyweb.status = {
            username: "pads",
                server_host: {
                host: "tiddlyspace.org"
            }
        };
        twiddlersCount = new TwiddlersCount(stubbedTiddlyweb);
    });

    describe("Construction", function () {

        it("should not yet know the tiddler title", function () {
            expect(twiddlersCount.title).toBeUndefined();
        });

        it("should know the current user", function () {
            expect(twiddlersCount.currentUser).toBe("pads");
        });

        it("should know the link to the replanadu application", function () {
            expect(twiddlersCount.targetURI).toBe("replanadu.html");
        });

        it("should know the location of the all related tiddlers icon", function () {
            expect(twiddlersCount.allImage).toBe("/bags/replanadu_public/tiddlers/replanadu-white.png");
        });

        it("should know the location of the related tiddlers from followers icon", function () {
            expect(twiddlersCount.followImage).toBe("/bags/replanadu_public/tiddlers/replanadu-gold.png");
        });
    });

    describe("Initialisation", function () {
        it("Should get the tiddler title from the correct element", function () {
            var mockJQuery = sinon.mock($.fn);
            mockJQuery.expects("text").once().returns("HelloWorld");

            twiddlersCount.init();

            expect(twiddlersCount.title).toBe("HelloWorld");
            mockJQuery.verify();
        });
    });

    describe("Get Followers", function () {

        var stubAjax;

        beforeEach(function () {
           stubAjax = sinon.stub($, "ajax");
        });

        afterEach(function () {
           stubAjax.restore();
        });

        it("should get a list of the current user's followers", function () {
            twiddlersCount._getFollowers();

            sinon.assert.calledWithMatch(stubAjax, {
                url: '/search.txt?q=bag:pads_public%20tag:follow%20_limit:999',
                headers: { 'X-ControlView': 'false' }
            });
        });

        it("should not get a list of followers when there is no logged-in user", function () {
            stubbedTiddlyweb.status.username = "GUEST";
            twiddlersCount = new TwiddlersCount(stubbedTiddlyweb);

            twiddlersCount._getFollowers();

            sinon.assert.neverCalledWithMatch(stubAjax, {
                url: '/search.txt?q=bag:GUEST_public%20tag:follow%20_limit:999'
            });
        });
    });

    describe("Search", function () {

        var stubAjax;
        var stubText;

        beforeEach(function () {
            stubAjax = sinon.stub($, "ajax");
            stubText = sinon.stub($.fn, "text");
            stubText.returns("HelloWorld");
            twiddlersCount.init();
        });

        afterEach(function () {
            stubAjax.restore();
            stubText.restore();
        });

        it("should search for all tiddlers by title", function () {
            twiddlersCount._search();

            sinon.assert.calledWithMatch(stubAjax, {
                url: '/search.txt?q=title:"HelloWorld"',
                headers: { 'X-ControlView': 'false' }
            });
        });

        it("should search for tiddlers by both title and followers when more than one result", function () {
            // we must pass data or else the second request will not run
            stubAjax.yieldsTo("success", "HelloWorld\nHelloWorld");

            twiddlersCount._search(["cdent", "colmjude"]);

            var searchRequest = stubAjax.getCall(0);
            var modifierRequest = stubAjax.getCall(1);

            expect(searchRequest.calledWithMatch({
                url: '/search.txt?q=title:"HelloWorld"',
                headers: { 'X-ControlView': 'false' }
            })).toBeTruthy();

            expect(modifierRequest.calledWithMatch({
                url: '/search.txt?q=title:"HelloWorld"%20modifier:cdent%20OR%20modifier:colmjude',
                headers: { 'X-ControlView': 'false' }
            })).toBeTruthy();
        });

        it("should not search for tiddlers by follower when only one result", function () {
            stubAjax.yieldsTo("success", "HelloWorld");

            twiddlersCount._search(["cdent", "colmjude"]);

            expect(stubAjax.calledWithMatch({
                url: '/search.txt?q=title:"HelloWorld"',
                headers: { 'X-ControlView': 'false' }
            })).toBeTruthy();

            expect(stubAjax.neverCalledWithMatch({
                url: '/search.txt?q=title:"HelloWorld"%20modifier:cdent%20OR%20modifier:colmjude',
                headers: { 'X-ControlView': 'false' }
            })).toBeTruthy();
        });

    });

    describe("Button", function () {

        beforeEach(function () {
            loadFixtures("HTMLTiddler.html");
            twiddlersCount.init();
        });

        it("should be added as the first child of the body", function () {
            twiddlersCount.addButton();

            expect($("body").children().first()).toBe("a#twiddlers");
        });

        it("should contain the correct icon", function () {
            twiddlersCount.addButton();

            expect($("#twiddlers img")).toHaveAttr("src", "/bags/replanadu_public/tiddlers/replanadu-white.png");
        });

        it("should link to the replanadu application with the correct title", function () {
            twiddlersCount.addButton();

            expect($("#twiddlers")).toHaveAttr("href", "/replanadu.html#GettingStarted");
        });

        it("should store the total number of related tiddlers found as a data attribute", function () {
            twiddlersCount.addButton(16);

            expect($("#twiddlers")).toHaveAttr("data-twiddlerall", 16);
        });

        it("should contain the followers icon when updated to link to related tiddlers from followers", function () {
            twiddlersCount.updateButton();

            expect($("#twiddlers img")).toHaveAttr("src", "/bags/replanadu_public/tiddlers/replanadu-gold.png");
        });

        it("should store the total number of related tiddlers from followers found as a data attribute", function () {
            twiddlersCount.updateButton(6);

            expect($("#twiddlers")).toHaveAttr("data-tiddlerfollow", 6);
        });
    });
});
