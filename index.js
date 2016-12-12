// push2u
// Patrick Lau @plaudev
// For use with Rob Pervical's iOS9 course lecture #140 on push notification https://www.udemy.com/the-complete-ios-9-developer-course/learn/v4/content

// turning verbose on will help debugging
// process.env.VERBOSE = true

// init express framework
var express = require('express');
var app = express();

// debug print
console.log(process.env.APP_ID + "|" + process.env.CLIENT_KEY + "|" + process.env.MASTER_KEY + "|" + process.env.DATABASE_URI + "|" + process.env.PARSE_MOUNT + "|" + process.env.PARSER_SERVER_URL + "|" + process.env.SERVER_URL + "|" + process.env.CLOUD_CODE_MAIN + "|" + process.env.PORT + "|" + process.env.VERBOSE);

// init Parse
var ParseServer = require('parse-server').ParseServer;
var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;
var mountPath = process.env.PARSE_MOUNT || '/parse';

var api = new ParseServer({
  databaseURI: databaseUri,
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID,
  masterKey: process.env.MASTER_KEY,
  serverURL: (process.env.PARSER_SERVER_URL || process.env.SERVER_URL ) + process.env.PARSE_MOUNT,
  publicServerURL: process.env.PARSE_PUBLIC_SERVER_URL || process.env.PARSER_SERVER_URL || process.env.SERVER_URL,
  liveQuery: {
    classNames: ["Posts", "Comments"]
  },
  push: {
    //android: {
    //  senderId: "",
    //  apiKey: ""
    //},
    ios: {
      pfx: "certs/Certificates.nopw.p12",
      //passphrase: '', // optional password to your p12/PFX
      bundleId: "com.plaudev.Tinder",
      production: false
    }
  }
});

// serve Parse API on mount dir
app.use(mountPath, api);

// Parse server plays nicely with other web routes
app.get('/', function (request, response) {
  response.status(200).send('Greetings!');  
});

// set port to either Heroku env var or 5000 if local
app.set('port', (process.env.PORT || 5000));

// load /public/index.html
app.use(express.static(__dirname + '/public'));

// test
console.log("Hello world!");

// listen to port
app.listen(app.get('port'), function() {
  console.log('push2u is running on port', app.get('port'));
});
