if (Meteor.isClient) {
    var config = {
        appId: "app-id-6067ea8c031f56db3f0180502128aa4b",
        appSecret: "app-secret-56950d1747416435ddb76c258d0d48daa4cd21f3e1a87c4ca6fe5b318ab143a3",
        "appName": "co.1self.sampleApp",
        "appVersion": "1.1.1"
    };
    var oneself = new Lib1self(config);
    Session.setDefault("pendingEventsCount", oneself.pendingEventsCount());
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
            oneself.registerStream(function (stream) {
                storeStreamDetails(stream);
            });
        }
    });

    Template.logging.events({
        'click #logActivity': function () {
            var beerInput = $("input[name='beer']");
            var beerDrank = parseInt(beerInput.val());
            if (!beerDrank) {
                beerInput.addClass("validation-error");
                return;
            }
            beerInput.removeClass("validation-error");
            var beerEvent = {
                "source": config.appName,
                "version": config.appVersion,
                "objectTags": ["alcohol", "beer"],
                "actionTags": ["drink"],
                "properties": {
                    "volume": beerDrank
                }
            };
            var updatePendingEventsCount = function () {
                Session.set("pendingEventsCount", oneself.pendingEventsCount());
            };
            oneself.onsendsuccess = function () {
                updatePendingEventsCount();
            };
            var onqueuesuccess = function () {
                updatePendingEventsCount();
            };
            oneself.sendEvent(beerEvent, window.localStorage.streamId, window.localStorage.writeToken, onqueuesuccess);
            beerInput.val("");
        }
    });
    Template.footer.helpers({
        pendingEventsCount: function () {
            return Session.get("pendingEventsCount");
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
            var url = oneself.visualize(window.localStorage.streamId, window.localStorage.readToken)
                .objectTags(["alcohol", "beer"])
                .actionTags(["drink"])
                .sum("volume")
                .barChart()
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
