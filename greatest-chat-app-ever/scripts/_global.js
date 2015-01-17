chatRoom = new Mongo.Collection("chat-room");
messages = new Mongo.Collection("messages");
greetings = new Mongo.Collection("greetings");
user_settings = new Mongo.Collection("user-settings");

if (Meteor.isClient) {

    Template.listOfOverallUsers.userInCollection = function(){
        return Meteor.users.find();
        
        var friendObjects = [];
        var friendList = user_settings.find({ id: Meteor.userId }, { friendList: true });
        for (i = 0; i < friendList.length; i++) {
            friendObjects.push(friendList[i]);
        }

        return friendObjects

    }

    Template.tempList.tempUser = function(){
      return user_settings.find();
    }

    Template.addFriend.events({
      "submit .add-a-friend": function (event){
          var text = event.target.addFriendTextField.value;

          console.log(text);

          //Meteor.call("addFriend", text);
          user_settings.update({ id: Meteor.userId }, { $push: { friendsList: text }});

          // Clear form
          event.target.addFriendTextField.value = "";

          // Prevent default form submit
          return false;
        }
    });

    //get friends list

}

// code to run on server at startup
if (Meteor.isServer) {
    Meteor.startup(function () {
      //empty
    });
    
}




Meteor.methods({

  addFriend: function (friendUserName){
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }


    //find id of friend
    //var temp = Meteor.users.find( { services: {twitter: {screenName: friendUserName} } }, { id: true }); 
    //var temp = Meteor.users.find( { services.twitter.screenName: friendUserName }, { id: true });
    //push to friends list
    //user_settings.update({ id: Meteor.userId }, { $push: { friendsList: friendUserName }});
  },



});