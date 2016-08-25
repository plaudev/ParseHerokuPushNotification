Parse.Cloud.define('hello', function(request, response) {
  response.success('Hi');
});

Parse.Cloud.define('nGameScores', function(request, response) {
  response.success("Don't like double quotes, or do you?");
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

Parse.Push.send({
	where: { 
		"deviceType": { "$in": [ "ios" ]  }  	  
	},
	data: { 
		"title": "Ant-man",
		"alert": "This is awesome. It is awesome."
	}
}, { useMasterKey: true });