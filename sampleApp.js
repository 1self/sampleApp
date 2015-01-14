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
            var dateTime = moment();
            var smokeEvent = {
                "dateTime": dateTime,
                "source": config.appName,
                "version": config.appVersion,
                "objectTags": ["self", "cigarette"],
                "actionTags": ["smoke"],
                "properties": {
                    "total": parseInt(cigarettesSmoked)
                }
            };
            var beerDrank = $("input[name='beer']").val();
            var beerEvent = {
                "dateTime": dateTime,
                "source": config.appName,
                "version": config.appVersion,
                "objectTags": ["self", "beer"],
                "actionTags": ["drink"],
                "properties": {
                    "volume": parseInt(beerDrank)
                }
            };
            var chipsEaten = $("input[name='chips']").val();
            var chipsEvent = {
                "dateTime": dateTime,
                "source": config.appName,
                "version": config.appVersion,
                "objectTags": ["self", "chips"],
                "actionTags": ["eat"],
                "properties": {
                    "volume": parseInt(chipsEaten)
                }
            };
//            var event = [smokeEvent, beerEvent, chipsEvent];
            oneself.send(smokeEvent, function () {
                console.info("Event logged");
            });
            oneself.send(beerEvent, function () {
                console.info("Event logged");
            });
            oneself.send(chipsEvent, function () {
                console.info("Event logged");
            });
        },
        'click #viz': function () {
            var url = oneself.objectTags(["self", "cigarette"])
                .actionTags(["smoke"])
                .count()
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
