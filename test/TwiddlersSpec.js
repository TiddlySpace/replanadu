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

    describe("Get Twinned Tiddlers", function () {

        it("should get the local tiddler", function () {

        });
    });
});