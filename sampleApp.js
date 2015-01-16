if (Meteor.isClient) {

    var config = {
        appId: "app-id-6067ea8c031f56db3f0180502128aa4b",
        appSecret: "app-secret-56950d1747416435ddb76c258d0d48daa4cd21f3e1a87c4ca6fe5b318ab143a3",
        "appName": "co.1self.sampleApp",
        "appVersion": "1.1.1"
    };
    var oneself = new Lib1self(config);
    Meteor.startup(function () {
        if (window.localStorage.streamId === undefined) {
            console.info("registering stream.");
            oneself.registerStream(function (stream) {
                console.info(JSON.stringify(stream));
                window.localStorage.streamId = stream.streamid;
                window.localStorage.readToken = stream.readToken;
                window.localStorage.writeToken = stream.writeToken;
            });
        } else {
            console.info("already registered.");
        }
    });

    Template.habits.events({
        'click #logActivity': function () {
            var beerDrank = $("input[name='beer']").val();
            var beerEvent = {
                "source": config.appName,
                "version": config.appVersion,
                "objectTags": ["alcohol", "beer"],
                "actionTags": ["drink"],
                "properties": {
                    "volume": parseInt(beerDrank)
                }
            };
            oneself.sendEvent(beerEvent, function () {
                console.info("Event logged");
            });
            $("input[name='beer']").val("");
        }
    });
    Template.footer.events({
        'click #log': function () {
            $(".logActivityTemplate").attr("style", "display: block;");
            $(".showVizTemplate").attr("style", "display: none;");
            $(".vizTemplate").attr("style", "display: none;");
        },
        'click #selectViz': function () {
            $(".showVizTemplate").attr("style", "display: block;");
            $(".logActivityTemplate").attr("style", "display: none;");
            $(".vizTemplate").attr("style", "display: none;");
        }
    });
    Template.selectVisualisations.events({
        'click #beerViz': function () {
            var url = oneself.objectTags(["alcohol", "beer"])
                .actionTags(["drink"])
                .sum("volume")
                .barChart()
                .url();
            console.info(url);
            $(".vizTemplate").attr("style", "display: block;");
            $(".showVizTemplate").attr("style", "display: none;");
            $(".logActivityTemplate").attr("style", "display: none;");
            $("#vizIframe").attr('src', url);
            $("#vizIframe").attr('height', "100%");
            $("#vizIframe").attr('width', "100%");
        }
    });
}

if (Meteor.isServer) {
    Meteor.startup(function () {
        // code to run on server at startup
    });
}
