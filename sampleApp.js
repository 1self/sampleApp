if (Meteor.isClient) {
    var config = {
        appId: "app-id-6067ea8c031f56db3f0180502128aa4b",
        appSecret: "app-secret-56950d1747416435ddb76c258d0d48daa4cd21f3e1a87c4ca6fe5b318ab143a3",
        "appName": "co.1self.sampleApp",
        "appVersion": "1.1.1"
    };
    var lib1self = new Lib1selfClient(config, "sandbox");

    var stream;
    Meteor.startup(function () {
        lib1self.fetchStream(function (err, response) {
            stream = response;
        });
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

            lib1self.sendEvent(beerEvent, stream);
            beerInput.val("");
            console.log("Event sent:");
            console.log(beerEvent)
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
            var url = lib1self
                .objectTags(["alcohol", "beer"])
                .actionTags(["drink"])
                .sum("volume")
                .barChart()
                .backgroundColor("84c341")
                .url(stream);
            console.info(url);
            $(".logActivityTemplate").hide();
            window.open(url, "_system", "location=no");
        }
    });

}