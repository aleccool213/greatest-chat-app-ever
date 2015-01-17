// Note: You CANNOT put a dash in the collection name or it will be a syntax error
chatRoom = new Mongo.Collection("chatRoom");
messages = new Mongo.Collection("messages");
greetings = new Mongo.Collection("greetings");
user_settings = new Mongo.Collection("userSettings");

if (Meteor.isClient) {

// =======================================
// TEMPLATE HELPERS
// =======================================

    Template.listOfOverallUsers.helpers({
        userInCollection: function(){
            return Meteor.users.find();
        }
    })

    Template.friendList.helpers({
        friends: function() {
            var friendObjects = []
            var friendIdArray = user_settings.find( { id: Meteor.userId() } ).fetch()[0].friendList;
            console.log(friendIdArray);

            for (i = 0; i < friendIdArray.length; i++) {
                friendObjects.push(Meteor.users.findOne( friendIdArray[i] ));
                console.log(Meteor.users.findOne( friendIdArray[i] ));
            }

            return friendObjects
        }
    });

    Template.greetingList.helpers({
        greetings: function() {
            return greetings.find({},{sort: {dateCreated: -1}});
        }
    })

    // Template.chatRoom.events({
    //     "keyup .message-input" : function(event) {
    //         if (event.which == 13 && !event.shiftKey) {
    //             Meteor.call('addMessage', this._id, $(".message-input").val())
    //         }
    //     },
    // });

// =======================================
// TEMPLATE EVENTS
// =======================================

    Template.addFriendModalTemplate.events({
        "keyup #addFriendInput": function(event){
            if (event.which == 13) {
                Meteor.call('addFriend', $("#addFriendInput").val())
                $("#addFriendInput").val('')
                $("#addFriendModal").modal('hide')
            }
        } 
    })

    Template.addGreetingModalTemplate.events({
        "keyup #addGreetingInput": function(event) {
            if (event.which == 13) {
                Meteor.call('addGreeting', $("#addGreetingInput").val())
                $("#addGreetingInput").val('')
                $("#addGreetingModal").modal('hide')
            }
        }
    })
// =======================================
// HANDLEBARS HELPERS
// =======================================

    Handlebars.registerHelper("prettifyDate", function(timestamp) {
        return moment(new Date(timestamp)).fromNow();
    });
}

// =======================================
// METEOR METHODS
// =======================================

    Meteor.methods({
        addFriend: function (friendScreenName){
            // Make sure the user is logged in before inserting a task
            if (! Meteor.userId()) {
                throw new Meteor.Error("not-authorized");
            }

            var friendToAdd = Meteor.users.find({ 'services.twitter.screenName': friendScreenName }).fetch();
            var friendToAddId = friendToAdd[0]._id;
            console.log("adding: "+ friendScreenName+ "with id: "+friendToAddId);
            // console.log(friendToAdd)

            if (friendToAdd.length == 1) {

                if (user_settings.find({ id: Meteor.userId() }).fetch().length > 0) {
                    user_settings.update({ id: Meteor.userId() }, { $addToSet: { friendList: friendToAddId }});
                    console.log(user_settings.find().fetch());
                } else {
                    user_settings.insert({ id: Meteor.userId(), friendList: [friendToAddId] });
                    console.log(user_settings.find().fetch());
                }
            }
            

        },

        addGreeting: function(greetingContent) {
            greetings.insert({ content: greetingContent, dateCreated: new Date(), owner: Meteor.userId() })
        },

        addMessage: function(chatRoomID, messageContent) {
            messages.insert({ parent: chatRoomID, content: messageContent, dateCreated: new Date(), owner: Meteor.userId() });
        }


    });