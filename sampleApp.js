if (Meteor.isClient) {
    var config = {
        appId: "app-id-6067ea8c031f56db3f0180502128aa4b",
        appSecret: "app-secret-56950d1747416435ddb76c258d0d48daa4cd21f3e1a87c4ca6fe5b318ab143a3",
        "appName": "co.1self.sampleApp",
        "appVersion": "1.1.1"
    };
    var lib1self = new Lib1self(config, "sandbox");
    Meteor.startup(function () {
        var isStreamRegistered = function () {
            return window.localStorage.streamId !== undefined;
        };
        var storeStreamDetails = function (stream) {
            window.localStorage.streamId = stream.streamid;
            window.localStorage.readToken = stream.readToken;
            window.localStorage.writeToken = stream.writeToken;
        };

        if (!isStreamRegistered()) {
            console.info("registering stream.");
            lib1self.registerStream(function (stream) {
                storeStreamDetails(stream);
            });
        }
    });

    Template.logging.events({
        'click #logActivity': function () {
            var beerInput = $("input[name='beer']");
            var beerEvent = {
                "source": config.appName,
                "version": config.appVersion,
                "objectTags": ["alcohol", "beer"],
                "actionTags": ["drink"],
                "properties": {
                    "volume": parseInt(beerInput.val())
                }
            };
            
            lib1self.sendEvent(beerEvent, window.localStorage.streamId, window.localStorage.writeToken, function(){});
            beerInput.val("");
            console.log("Event sent:");
            console.log(beerEvent);
        }
    });
    Template.footer.events({
        'click #displayLogActivityTemplate': function () {
            $(".logActivityTemplate").show();
            $(".showVizTemplate").hide();
        },
        'click #displaySelectVizTemplate': function () {
            $(".showVizTemplate").show();
            $(".logActivityTemplate").hide();
        }
    });
    Template.selectVisualizations.events({
        'click #beerViz': function () {
            var url = lib1self.visualize(window.localStorage.streamId, window.localStorage.readToken)
                .objectTags(["alcohol", "beer"])
                .actionTags(["drink"])
                .sum("volume")
                .barChart()
                .backgroundColor("84c341")
                .url();
            console.info(url);
            $(".logActivityTemplate").hide();
            window.open(url, "_system", "location=no");
        }
    });
}

if (Meteor.isServer) {
    Meteor.startup(function () {
        // code to run on server at startup
    });
}
