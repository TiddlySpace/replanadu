describe("TwiddlersCount", function () {

    jasmine.getFixtures().fixturesPath = "fixtures";

    var twiddlersCount;
    var stubbedTiddlyweb = {
        status: {
            username: "pads",
            server_host: {
                host: "tiddlyspace.org"
            }
        }
    };

    beforeEach(function () {
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

    xdescribe("Search", function () {

    });
});