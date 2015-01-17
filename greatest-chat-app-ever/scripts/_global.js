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
//---------------------Don't Delete-------------------
// Template.greeting.events({
// "submit .new-greeting": function (event){

//   var greeting = event.target.text.value;

//   Greeting.insert({
//     content: greeting,
//     dateCreated: new Date(),
//     owner: Meteor.userId
//   });

//   // Clear Form
//   event.target.text.value = "";

//   //Prevent default form submission

//   return false
//   }
  
// });

// Template.greeting.helpers({

//       greetings: function(){
  
//       return Greeting.find({},{sort: {dateCreated: -1}});
//     }

// });


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
