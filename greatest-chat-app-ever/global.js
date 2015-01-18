// Note: You CANNOT put a dash in the collection name or it will be a syntax error
chatRoom = new Mongo.Collection("chatRoom");
messages = new Mongo.Collection("messages");
greetings = new Mongo.Collection("greetings");
user_settings = new Mongo.Collection("userSettings");
requests = new Mongo.collection("requests");


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
            for (i = 0; i < friendIdArray.length; i++) {
                friendObjects.push(Meteor.users.findOne( friendIdArray[i] ));
            }

            return friendObjects
        }
    });

    Template.friend.events({
        'click .friend-item': function(){
            console.log(this._id);
            Meteor.call('checkChat', this._id)
        }
    })

    Template.greetingList.helpers({
        greetings: function() {
            return greetings.find({},{sort: {dateCreated: -1}}).fetch();
        }
    })

    Template.friendRequests.helper({
        requests: function(){
            console.log();
            var friendObjects = []
            var friendIdArray = requests.find( { id: Meteor.userId() } ).fetch()[0].friendRequests;
            console.log(requests.find( { id: Meteor.userId() } ).fetch()[0].friendRequests);
            for (i = 0; i < friendIdArray.length; i++) {
                friendObjects.push(Meteor.users.findOne( friendIdArray[i] ));
            }

            return friendObjects
        }
    })

    Template.greeting.events({
        'click .greeting-item': function(){
            console.log(this.owner._id);
            if (this.owner._id != Meteor.userId()) {
                Meteor.call('checkChat', this.owner._id)
            }
        }
    })

    Template.chatRooms.helpers({
        chatRooms: function() {
            //return array of chat room ids
            return chatRoom.find({}, { _id: true }).fetch()
        }
    })

    Template.chatHeader.helpers({
        chatName: function(){
            
            return "First Lastname"

        }
    })

    Template.chatRoomNumber.events({
        "click .chatroom-item": function () {
            // Set the checked property to the opposite of its current value
            console.log(this._id.toString());
            console.log("button is clicked!");
            Session.set("currentRoomId", this._id);
            $("#userMessage").focus();
          }
    })

    // Template.chatRoom.events({
    //     "keyup .message-input" : function(event) {
    //         if (event.which == 13 && !event.shiftKey) {
    //             Meteor.call('addMessage', this._id, $(".message-input").val())
    //         }
    //     },
    // });

    Template.userChatMessageIn.events({
        "submit .new-message": function(){
            var message = event.target.chatText.value;
            console.log("message submitted:"+message);
            messages.insert({
                owner: Meteor.user(),                
                userMessages: message,
                dateCreated: new Date(),
                currChatRoom: Session.get("currentRoomId")
            });

            //Clear Form
            event.target.chatText.value = "";
            return false
        }
    });

    Template.chatRoomNumber.helpers({
        user: function(){
            var targetId
            userIdArray = chatRoom.find({ _id: this._id }).fetch()[0].userIds
            if (userIdArray[0] == Meteor.userId()){
                targetId = userIdArray[1]
            } else {
                targetId = userIdArray[0]
            }

            return Meteor.users.find({_id: targetId}).fetch()[0]
        }
    })


    Template.body.helpers({
        validChat: function(){
            return Session.get("currentRoomId")
        }
    })


    Template.chatRoomMessages.helpers({
        chatMessages: function(){
            var messagesArray = []

            if (Session.get("currentRoomId") != undefined) {
                messagesArray = messages.find({currChatRoom: Session.get("currentRoomId")});
                console.log("currentRoomId: " + Session.get("currentRoomId"))
                console.log("messagesArray: " + messagesArray.fetch()[0]);
            }

            return messagesArray;

            
        }
    });

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

    //new chat when user clicks content of a greeting
    // Template.greeting.events({
    //     "click #greetingContent": function(event){
    //         Meteor.call('newChat', $('#ownerID').val());
    //     }
    // })
// =======================================
// HANDLEBARS HELPERS
// =======================================

    Handlebars.registerHelper("prettifyDate", function(timestamp){
        return moment(new Date(timestamp)).fromNow();
    });

    Handlebars.registerHelper("chatRoomHelper", function(chatRoomID){
        return messages.find({ currChatRoom: chatRoomID }).fetch();
    })

    Handlebars.registerHelper("getAvatar", function(user){
        return user.services.twitter.profile_image_url_https
    })

    Handlebars.registerHelper("getName", function(user){
        return user.profile.name
    })

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
            console.log("adding: "+ friendScreenName + "with id: "+ friendToAddId);
            // console.log(friendToAdd)

            //if friend is a real person
            if (friendToAdd.length == 1) {
                //if friend is not in friendlist, then send invite
                if (user_settings.find({ id: Meteor.userId() }).fetch().length == 0) {
                    requests.insert({ id: Meteor.userId() }, { $addToSet: { friendRequests: friendToAdd }});
                    //user_settings.insert({ id: Meteor.userId(), friendList: [friendToAddId] });
                    //console.log(user_settings.find().fetch());
                }
                else{
                    alert("already in friendlist");
                }
            }
            else{
                //invite a friend
                alert("friend is not signed up for Merge.im yet")
            }
        },

        addGreeting: function(greetingContent) {
            var ownerObject = Meteor.users.find({ _id: Meteor.userId() }).fetch()[0];
            greetings.insert({ content: greetingContent, dateCreated: new Date(), owner: ownerObject })
        },

        addMessage: function(chatRoomID, messageContent) {
            messages.insert({ parent: chatRoomID, content: messageContent, dateCreated: new Date(), owner: Meteor.userId() });
        },

        checkChat: function(userID){
            
            var temp = chatRoom.find({ userIds: [Meteor.userId(), userID] }).fetch()
            var temp2 = chatRoom.find({ userIds: [userID, Meteor.userId()] }).fetch()
            console.log("temp: " + temp);
            console.log("temp2: "+ temp2);
            if (temp.length == 1){
                Session.set("currentRoomId", temp._id);
            }
            else if(temp2.lenght == 1){
                Session.set("currentRoomId", temp2._id)
            }
            else{
                chatRoom.insert({ userIds: [Meteor.userId(), userID], modsActivated: [] });
                var currentRoom = chatRoom.find({ userIds: [Meteor.userId(), userID] }).fetch()[0]
                Session.set("currentRoomId", currentRoom._id);
            } 
        }       

    });




