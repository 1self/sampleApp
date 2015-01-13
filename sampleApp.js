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
        'click #smoke': function () {
            var event = {
                "dateTime": moment(),
                "source": config.appName,
                "version": config.appVersion,
                "objectTags": ["self", "cigarette"],
                "actionTags": ["smoke"],
                "properties": {}
            };
            oneself.send(event, function () {
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
