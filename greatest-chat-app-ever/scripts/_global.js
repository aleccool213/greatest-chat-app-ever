chatRoom = new Mongo.Collection("chat-room");
messages = new Mongo.Collection("messages");
greetings = new Mongo.Collection("greetings");
user_settings = new Mongo.Collection("user-settings");

if (Meteor.isClient) {

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

<<<<<<< HEAD
    Template.chatRoom.events({
        "keyup .chat-input" : function(event) {
            if (event.which == 13 && !event.shiftKey) {
                chatRoom.insert({ parent: this._id, dateCreated: new Date(), owner: Meteor.userId });
            }
        },
    });
=======



>>>>>>> FETCH_HEAD
}

if (Meteor.isServer) {
    Meteor.startup(function () {
    // code to run on server at startup

    });


}




Meteor.methods({
  addFriend: function (friendID){
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }


  }


});