if (Meteor.isClient) {
    // counter starts at 0
    Session.setDefault("counter", 0);

    Template.listOfOverallUsers.userInCollection = function(){
        return Meteor.users.find();
    }

    Template.friendList.helpers({
        friends: function() {
            var friendObjects = []
            var friendIdArray = Meteor.userSettings.find({ _id: Meteor.userId }, { friendList: true });
            for (i = 0; i < friendIdArray.length; i++) {
                friendObjects.push(Meteor.users.find({ _id: friendIdArray[i] }));
            }

            return friendObjects
        }
    }); 

    Template.chatRoom.events({
        "keyup .chat-input" : function(event) {
            if (event.which == 13 && !event.shiftKey) {
                chatRoom.insert({ parent: this._id, dateCreated: new Date(), owner: Meteor.userId });
            }
        },
    });
}

if (Meteor.isServer) {
    Meteor.startup(function () {
    // code to run on server at startup

    });


}




