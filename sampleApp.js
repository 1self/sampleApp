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
            var cigarettesSmoked = $("input[name='cigarettes']").val();
            var smokeEvent = {
                "source": config.appName,
                "version": config.appVersion,
                "objectTags": ["tobacco", "cigarette"],
                "actionTags": ["smoke"],
                "properties": {
                    "total": parseInt(cigarettesSmoked)
                }
            };
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
            var chipsEaten = $("input[name='chips']").val();
            var chipsEvent = {
                "source": config.appName,
                "version": config.appVersion,
                "objectTags": ["food", "potato", "carbs", "chips"],
                "actionTags": ["eat"],
                "properties": {
                    "volume": parseInt(chipsEaten)
                }
            };
            var event = [smokeEvent, beerEvent, chipsEvent];
            oneself.sendEvent(smokeEvent, function () {
                console.info("Event logged");
            });
            oneself.sendEvent(beerEvent, function () {
                console.info("Event logged");
            });
            oneself.sendEvent(chipsEvent, function () {
                console.info("Event logged");
            });
        }
    });
    Template.footer.events({
        'click #log': function () {
            $(".logActivityTemplate").attr("style", "display: block;");
            $(".showVizTemplate").attr("style", "display: none;");
        },
        'click #viz': function () {
            $(".showVizTemplate").attr("style", "display: block;");
            $(".logActivityTemplate").attr("style", "display: none;");
        }
    });
    Template.visualisations.events({
        'click #smokeViz': function () {
            var url = oneself.objectTags(["tobacco", "cigarette"])
                .actionTags(["smoke"])
                .sum("total")
                .barChart()
                .url();
            console.info(url);
            window.location = url;
        },
        'click #beerViz': function () {
            var url = oneself.objectTags(["alcohol", "beer"])
                .actionTags(["drink"])
                .sum("volume")
                .barChart()
                .url();
            console.info(url);
            window.location = url;
        },
        'click #chipsViz': function () {
            var url = oneself.objectTags(["food", "potato", "carbs", "chips"])
                .actionTags(["eat"])
                .sum("volume")
                .barChart()
                .url();
            console.info(url);
            window.location = url;
        }
    });
}

if (Meteor.isServer) {
    Meteor.startup(function () {
        // code to run on server at startup
    });
}
