if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault("counter", 0);

  //Test function to show all logged in users
  Template.listOfOverallUsers.userInCollection = function(){
        return Meteor.users.find();
    }


}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });


}



