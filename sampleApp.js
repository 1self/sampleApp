if (Meteor.isClient) {
    // counter starts at 0
    Session.setDefault("counter", 0);

    Meteor.startup(function () {
        if (window.localStorage.streamId === undefined) {
            console.info("registering stream.");
            lib1self.configure({

            });
            //register stream
            window.localStorage.streamId = "ABCD";
        } else {
            console.info("already registered.");
        }
    });

    Template.habits.helpers({
        counter: function () {
            return Session.get("counter");
        }
    });

    Template.habits.events({
        'click #smoke': function () {
            //send event to 1self
            // increment the counter when button is clicked
            Session.set("counter", Session.get("counter") + 1);
        }
    });


}

if (Meteor.isServer) {
    Meteor.startup(function () {
        // code to run on server at startup
    });
}
