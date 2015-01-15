if (Meteor.isClient) {

    var config = {
        appId: "abc",
        appSecret: "123",
        "appName": "co.1self.sampleApp",
        "appVersion": "1.1.1"
    };
    var oneself = new lib1self(config);
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
            $("#vizIframe").attr('height', screen.height);
            $("#vizIframe").attr('width', screen.width);
        }
    });
}

if (Meteor.isServer) {
    Meteor.startup(function () {
        // code to run on server at startup
    });
}
