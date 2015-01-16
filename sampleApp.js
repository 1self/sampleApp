if (Meteor.isClient) {
    var config = {
        appId: "app-id-6067ea8c031f56db3f0180502128aa4b",
        appSecret: "app-secret-56950d1747416435ddb76c258d0d48daa4cd21f3e1a87c4ca6fe5b318ab143a3",
        "appName": "co.1self.sampleApp",
        "appVersion": "1.1.1"
    };
    var oneself = new Lib1self(config);
    Session.setDefault("pendingEvents", oneself.pendingEvents());
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
            oneself.sendEvent(beerEvent, function () {
                Session.set("pendingEvents", oneself.pendingEvents());
                console.info("Event logged");
            });
            beerInput.val("");
        }
    });
    Template.footer.helpers({
        pendingEvents: function () {
            return Session.get("pendingEvents");
        }
    });
    Template.footer.events({
        'click #log': function () {
            $(".logActivityTemplate").show();
            $(".showVizTemplate").hide();
            $(".vizTemplate").hide();
        },
        'click #selectViz': function () {
            $(".showVizTemplate").show();
            $(".logActivityTemplate").hide();
            $(".vizTemplate").hide();
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
            $(".vizTemplate").show();
            $(".showVizTemplate").hide();
            $(".logActivityTemplate").hide();
            $("#vizIframe").attr('src', url);
        }
    });
}

if (Meteor.isServer) {
    Meteor.startup(function () {
        // code to run on server at startup
    });
}
