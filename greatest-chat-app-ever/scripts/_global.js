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

    Template.chatRoom.events({
        "keyup .message-input" : function(event) {
            if (event.which == 13 && !event.shiftKey) {
                Meteor.call('addMessage', this._id, $(".message-input").val())
            }
        },
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
  },
  addMessage: function(chatRoomID, messageContent) {
    messages.insert({ parent: chatRoomID, content: messageContent, dateCreated: new Date(), owner: Meteor.userId });
  }


});