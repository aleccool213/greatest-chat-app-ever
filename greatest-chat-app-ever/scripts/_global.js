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




Meteor.methods({
  addFriend: function (friendID){
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }


  }


});