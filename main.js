Parse.Cloud.define('hello', function(request, response) {
  response.success('Hi');
});

Parse.Cloud.define('scorerHighest', function(request, response) {
  // PLauDev http://stackoverflow.com/a/28648168/1827488
  var query = new Parse.Query('GameScore');
  query.descending('score');
  query.first({
    success: function(result) {
      response.success(result.get("playerName"));
    },
    error: function() {
      response.error("no scores!");
    }
  });
});

// PLauDev cloud push 
// https://github.com/ParsePlatform/parse-server/issues/2595
// wrap in cloud func http://stackoverflow.com/a/36621151/1827488
// http://rogerstringer.com/2016/02/11/parse-server-push/
// with promises https://github.com/ParsePlatform/Parse-Server/wiki/Push
// https://github.com/ParsePlatform/PushTutorial/blob/master/iOS/README.md#1-creating-the-ssl-certificate

Parse.Cloud.define("pushFuncOne", function (request, response) {

  console.log(">>", Parse.serverURL);
  var pushQuery = new Parse.Query(Parse.Installation);
  
  // Send push notification to query
  Parse.Push.send({
    where: pushQuery, // Set our installation query
    data: {
        "title": "greetings",
        "alert": "message to all users",
        "badge": 1,
        "sound": "default"
        }
    }, {
    success: function () {
        // Push was successful
        console.log("Message was sent successfully");
        response.success('true');
    },
    error: function (error) {
        response.error(error);
    }
    , useMasterKey: true});
});

Parse.Cloud.define("pushFuncTwo", function (request, response) {

  console.log(">>", Parse.serverURL);
  //var pushQuery = new Parse.Query(Parse.Installation);
  var pushContents = {
    where: { 
      "deviceType": { "$in": [ "ios" ]  }  	  
	},
    data: {
        "title": "promises",
        "alert": "message to all iOS users",
        "badge": 1,
        "sound": "default"
        }
  };
  
  Parse.Push.send(pushContents, {useMasterKey: true}).then(function(success) {
      // Push was successful
      console.log("Message was sent successfully");
      response.success('true');
  }, function(error) {
      response.error(error);
  });
});
