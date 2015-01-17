if (Meteor.isClient) {
    // counter starts at 0
    Session.setDefault("counter", 0);

    Template.listOfOverallUsers.userInCollection = function(){
        return Meteor.users.find();
    }

    Template.friendList.helpers({
        friends: function() {
            var friendObjects = []
            var friendIdArray = Meteor.userSettings.find({ type: 'friendList' });
            for (i = 0; i < friendIdArray.length; i++) {
                friendObjects.push(Meteor.users.find({ _id: friendIdArray[i] }));
            }

            return friendObjects
        }
    }); 
}

if (Meteor.isServer) {
    Meteor.startup(function () {
    // code to run on server at startup

    });


}




