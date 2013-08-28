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

        it("should search for tiddlers by title an followers when provided", function () {
            stubAjax.yieldsTo("success");

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

    });

    xdescribe("Button", function () {

    });
});