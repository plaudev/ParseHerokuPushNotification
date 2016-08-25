# 1 Parse Heroku Push Notification

Files required to set up Parse Server on Heroku for push notification. For use with Rob Pervical's iOS9 course lecture #140 on push notification https://www.udemy.com/the-complete-ios-9-developer-course/learn/v4/content. Patrick Lau @plaudev 2016-08-25.

## 1.1 Introduction

When I began my attempt to get push notification working for Lecture #140 under the Parse/Heroku set up, I decided to deploy a brand new app on that platform for fear of breaking what little I had on the Tinder app set-up. This is documentation of my attempt to duplicate the ability of push notification to my Tinder Parse/Heroku app. 

At the outset of this process I had successfully sent push notification from the Terminal shell using curl to my physical iphone and from the parse-dashboard. I have not yet tried sending from the iphone. I have not verified that it works on android. 

This readme contains step-by-step instructions to deploy push notification (section 2), a list of future implementations/enhancements (section 3) and references I used to devise this implementation (section 4). The instructions are mac based because that's what I use; if you use a PC. hope you can easily find the equivalent of what I'm doing here.

This Parse/Heroku set-up involves Node.js which is a form of Javascript. But I'm giving you all the files you need on github so no need to sweat. After you unzip the package, you may want to plop each file in individually so you have a chance to examine what it contains which is very little. If you do know even just a hint of Node.js and/or Javascript - uh-hmm, let me do my best Rob impression here - you can challenge yourself to compose those files yourself. I have no formal knowledge of Node.js and whatever know-how on Javascript I have came from taking Rob's Web Dev Course (plug plug plug, Rob :P). In any case, there is only about 2 pages of .js code and that language is highly readable.

You will also need to do some git & npm. I didn't know all that much about either of them but, if you follow the first two steps I recommend you do, you will know enough about both for our purpose.

Like solving most problems, it always feels a lot harder before reaching the solution than after. It's like building a jigsaw by finding one piece from this stackoverflow post, and another from a different post. In this case, it did not help that one particular online tutorial contains a code typo which threw a lot of people off including myself. Nonetheless, if you just scan the numbered titles of this readme, you will soon find there is not all that much to it.

I'm borrowing some formatting from Markdown (#4.5.8) to make this readme more readable. Apologies to the knowledgeable if I'm misusing it as I don't really know much beyond a quick glance of that wiki page.

It should be noted that the current Parse push functionality requires the use of the masterKey. There are some security implications of this which are beyond the scope of this lecture. You might want to read #4.2.7 also to find out more about what key is needed where with Parse.


# 2 Steps to Deploy Push

Since things change really fast especially on iOS - and you are reading this because parse.com is disappearing - please note that these instructions are essentially effective as of the date of this readme. Should there be a need to update, any bugs or enhancements you think would be useful, please kindly let me know. Good luck!

## 2.1 Deploy Parse Server on Heroku & Parse-Dashboard on Mac

The starting point of these instructions assumes you have already followed Rob's instructions in Lecture #112 to deploy Parse Server on Heroku and those in Lecture #113 to deploy parse-dashboard. If you are stuck trying to figure out those, Geir Fjærli has an excellent & very detailed guide that will very likely help you (#4.1.3).

## 2.2 Set Up Parse Server Locally

### 2.2.1 Bare Bones Node.js Web Server on Heroku
The very first thing I recommend you do is to watch the 6-minute Hot Sauce JS youtube video (#4.5.1) which will show you how easy it is to get a web server up & running. Just use the Heroku Tinder app credentials you already set up. The author seems to be using the Sublime code editor but you can use whatever you have handy. This example it isolates the Heroku/Node.js part from our Parse/Heroku set-up and makes clear what is what in this whole process. Optionally, read a bit about Express (#4.5.2) if you like which I never heard of beforehand. 

In case you wonder, notice this author uses the filename app.js unlike the Heroku & Parse folks which use index.js. It doesn't matter what you use as long as the name is consistent in all the places it shows up. I have chosen to use index.js.

Also both this author & the next tutorial uses the Heroku Toolbelt which I describe how to install in #2.2.3. You can install that whenever you feel ready for it.

## 2.2.2 Heroku Node.js Server Tutorial
The second thing I recommend you do is to follow the Heroku Node.js Server tutorial (#4.3.1). This tutorial sets up a more complex Heroku server example using code they give you. By the end of this tutorial & the previous video, you should: a) have a very good sense of how a Heroku server works; b) know enough about git & npm to work with them; and c) see that npm brings in every single piece of software you will require. Notice also that up to this point, we have not done a thing about Parse yet.

If you followed this tutorial completely, you would have at some point did this:

  $ heroku create
  
which creates an app on Heroku. Since we already followed Rob's instructions to create the Parse app on Heroku (remember that purple button you clicked?), we WILL NOT have to do that when we set up push for your Tinder app. 

## 2.2.3 Install Heroku Toolbelt
Install the Heroku toolbelt (#4.3.2) which gives you command line access to your Heroku app from the Terminal. Sometimes people refer to this as the Heroku CLI for command line interface. Once installed, start it up by entering

  $ heroku login

at the Terminal which will prompt you for your Heroku account credentials. From hereon in, anytime you see an indented "$" means you are doing that at your Terminal prompt. 

## 2.2.4 Clone Your Tinder App Files Locally to Mac
Create a new folder that you will permanently use to pass back & forth between Heroku & your mac wrt setting up the Parse server. It is important you only use this folder for this sole purpose as git, what we will be using here, maintains a hidden .git subfolder within each folder that it creates for you to keep track of things. For the sake of clarity, I will use folder names I created for myself to illustrate. 

  $ cd ~/Documents/Coding
  $ mkdir Parse
  $ cd Parse
  
Then do this by replacing "tinderpl" with the name of your own Tinder app as you named it when you set up Parse on Heroku:

  $ heroku git:clone -a tinderpl
  
This will create the folder ~/Documents/Coding/Parse/tinderpl. Then do these:

  $ cd tinderpl
  $ ls -l
  
Notice anything strange? This folder is empty! What?! Apparently there is a known issue with Heroku where cloning (aka downloading) your app with git does not actually download anything (#4.3.4). So you are scratching your head wondering why I just wasted your time with this. I guarantee you it's not because this conundrum has wasted many hours of mine & therefore nefariously I want you to suffer the same. The answer (drum roll, please):

  $ ls -la
  
will show the hidden .git file I mentioned earlier which you will need for all the steps that follow. It is into tinderpl, or whatever you named your Heroku app (I will stop mentioning this from hereon in), we will be plopping the files you need to set up push.

## 2.2.5 Download Files from My Github to Mac
Now it's time to download my files (#5.1). But don't put them in the folder you just did the git to clone your Tinder app files into. I suggest you place these files in a folder unrelated to your existing Tinder app development so you can plop each one into where you need it as you need it, or compose each one yourself, and most importantly not interfere with what git will do for you. Let's say you have just downloaded that zip file into ~/Documents/Coding/SomewhereElse. Unzip that file and take a look. You should have these contents in the appropriate subfolders:

  certs
  cloud/main.js
  index.js
  package.json
  Procfile
  public/index.html
  public/styles.css
  README.md
  .env
  .gitignore
  
The empty folder "certs" is where you will plop your own .p12 certificate created according to Rob's instructions in Lecture #140. The two files beginning with a dot are hidden files. The .env sets up Heroku environment variables locally so the same Node.js code can function the same way locally & on Heroku (#4.3.5). The .gitignore lists files that git should ignore when it up-/down-loads between Heroku & your mac.

#### 2.2.5.1 If You Are Really Pressed For Time
At this point, you already have all the files & set-up you need. If you are really pressed for time, you can just copy the files from #2.2.5 into ~/Documents/Coding/Parse/tinderpl. The knowledge from #2.2.1 & #2.2.2 should take you the rest of the way within 5-10 minutes. The rest of this guide are more explanations than instructions.

### 2.2.6 "package.json"
It is worth understanding this file in a bit of detail because it is the crux of how Parse (or any app) on Heroku is set up, including push notifications. You are already familiar with the json format for passing data. Indeed, the actual push messages will also be in json. At a high level, package.json tells Heroku - and npm importantly - what are the pieces of software required to get whatever you are setting up to work. You will notice many version numbers which are what npm looks at in determining the dependencies among the software and then finding the right pieces installed for you. It's really quite impressive what npm does for us as you see the logs on the screen while it runs. I must confess that I hardly know anything about what versions depends on what other the ones specified in this file work as of the date of this readme.

The first 3 items - name, version & description - don't mean a lot. In fact, I still have the name of my Heroku app I used to test out push in there with a version number ("0.3.0") that I made up. You can edit that with your own information if you'd like.

The "engines" block names what is needed to start up this Heroku app which in this case is only Node.js and index.js is the first file that gets executed by running the "start" script "node index.js".

The "dependencies" block specifies the other software pieces needed for this app. As you saw in #2.2.1 & #2.2.2, "express" is pretty native to Heroku. The other three - mongodb, parse & parse-server - need no explanation. Here is the crux: these dependencies enable npm to set up the Parse Server locally on your mac and also enables git to do the same for you on Heroku. I stared at the Roger Stringer Parse Server tutorial (#4.4.1) for hours but could not get the index.js file not to crash. This package.json, and in particular this "dependencies" block, is the missing piece.

I would note that the mongodb version 2.2.8 is pretty low compared to the latest 3.2.x for a reason. Somehow npm says it cannot find or otherwise install a later version. But that version still works.

The "repository" block I am guessing specifies the url of the git repository on Heroku for your app. Because I wanted to get this push thing working asap, anything that did not stop me I did not pursue. Apparently leaving it blank works. I will update if I find out for certain, or let me know if you figure it out first.

The "keywords" block I am guessing is only informational only. You can enter anything you like there probably.

Finally, the "license" block specifies the usage rights. MIT License (#4.5.10) was there in the sources I used so I left it the same.

### 2.2.7 "Procfile"
Since a single spelling mistake in a tutorial I read costed me & others hours of lost sleep, allow me to point out this file is spelled with a "c", capitalized & has no file extension. This is like the .bat file in DOS. Oops, did I just give away my age? :P  All it does is it tells Heroku how to get the party going. It takes only one line which you can see by doing:

  $ cat Procfile
  
I'm not sure why this seems to be duplicating what's already in package.json but onwards I wanted to go.

### 2.2.8 "index.js"
As you already saw in #2.2.1 & #2.2.2, this is the file that actually launches the services required on your Heroku server, and it is pretty self explanatory.

Everything on Heroku begins with Express, at least in everything I've seen in the past few days.

Then the Parse Server is cued up to launch. I print the environment variables in the console just to see what is there so I could set up the .env file appropriately. They are all the same ones Rob & Geir told us to set up. It is worth stressing that I tried to rely on environment variables as much as possible to preventing hardcoding things in this file. The:

  var api = new ParseServer({...})

block is also where we set up push. As you can see, it only requires those few skimpy lines. You need to fill out the "pfx" field with your own .p12 certificate details of course, and also the "bundleId". 

In Rob's video, he told us specifically not to put a password on the .p12 certificate. If you did, you need to put in the password in the "passphrase" field which I commented out for now. I did NOT have time actually to verify that the "passphrase" field works.

The "production" field value must match the equivalent property of our .p12 certificate. In other words, if you created a development certificate, you must specify false here. On the other hand, if you created a production certificate, you must specify true. You can try out the different combos and watch the logs on Heroku; I don't think you can mix them. In any case, if your app is not on the app store it is, I believe, not technically in production and therefore give you a connection error (#4.5.4).

Notice the android part of the "push" block is commented out as I'm not there yet. Also there is a "liveQuery" block just before the "push" block which is explained in one of the videos in #4.2.5.

Then the Parse API is mounted and Heroku is instructed to listen to a specific port for incoming API calls. Notice I also put in a placeholder for an .html page when you go to your app's url in a browser, which is where the index.html & style.css files come in. However I have not figured out how to get it to show yet. Theoretically, I think this page can serve the same function as the parse-dashboard. Again, in my best Rob impression, here's a challenge for you...

As an aside, here is where the spelling error I mentioned earlier showed up. Instead of "pfx", the Roger Stringer tutorial had "pdx" (#4.4.2). Apparently this caused a lot of confusion & wasted time (#4.5.6 & #4.5.5) though the official guides like #4.2.6 have the right spelling. Let me state here clearly though, the Roger Stringer tutorials nonetheless helped me greatly figure out how to set all this up.

### 2.2.9 "main.js"
The main.js file contains what is known as cloud functions which is a feature where you can perform ad hoc actions on the Parse Server (#4.2.8). It is commonly used for pre- and post-API call processing. Push apparently can also be done from a cloud function although I have NOT yet figured out how to do it.

The default main.js only has the first of 4 functions in my zip file. I put in the others in an attempt to figure out how to get it to send push notification but I needed more time.


## 2.3 If All That Did Not Put You To Sleep...

Now that you have plopped or composed all those files in ~/Documents/Coding/Parse/tinderpl, let's install something!

### 2.3.1 Install & Test Locally
To install locally:

  $ cd ~/Documents/Coding/Parse/tinderpl
  $ npm install
  
watch the logs that are shown in the Terminal for any errors. Some of lines are colour coded and errors are often in red & warnings yellow. In all the times I've run npm in this exercise, I've only seen 2 problems. The first one is a file structure permissions problem (#4.5.9) where something needs to be installed within /usr/local/lib. While some people recommend you bypass such a problem with:

  $ sudo npm ... [don't do this]
  
it has the drawback of potentially requiring you to have do sudo every time you run that app. So the better solution is to change the ownership of the folders (-R for recursively) in question to yourself:

  $ sudo chown -R $(whoami) /usr/local/lib

The other is the mongodb version issue already discussed above in #2.2.6. If any step here seems confusing, read #2.2.2 & #4.3.1 again. I'm intentionally trying to control my verbiage here to save time. 

All those pieces of software & files you need will be placed into a folder "node_modules" that npm will create for you. This is why you have that entry in the .gitignore file (the other is a "logs" folder that your local Heroku server will write to). Assuming npm installs everything correctly:

  $ heroku local web
  
will launch the Parse Heroku server locally which uses a local copy of the mongodb. If you specify it in either .env or in index.js, you can optionally tell this local set-up to use the online mongodb which I've tried and seen it work. What I have NOT done is to try push with this local set-up. Feel free to have a go at that & let me know how you get on!

### 2.3.2 Install & Test on Heroku
Now finally the big one. Actually with not that much extra effort, we can get all this to run in the cloud.

  $ cd ~/Documents/Coding/Parse/tinderpl
  $ git add .
  
That git line above tells git you want to add everything (minus those in .gitignore) in the current folder (where that hidden .git subfolder is).

  $ git commit -m "something to remember this commit by"
  
I have not actually gone anywhere to check them, but I'm taking a leap of faith here that all those messages I left myself will become useful one day. Needless to say please fill in something different of your own between the double quotes for each commit.

  $ git push heroku master
  
This one line does everything that "npm install" did for you locally. Again please watch the logs on the screen for errors. Some people including myself has run into the situation where after working for a while, the above "git push" line has to be changed to:

  $ git push origin master
  
I think this issue can pop up if there are many branching, forking, pushing, pulling, fetching, etc going on with git (#4.5.3). In my case, in trying to get past certain problems, I re-cloned my Parse Heroku app to my mac making git think I've forked the repository. So now I have to do it the second way. I'm sure if I spend the time reading up on git I can fix it. The important thing is that either way will not affect the Tinder app.

Sometimes you get the situation where this "git push" step asks you for authentication (#4.3.3) as I did one time. Should that happen, follow the instructions in #4.3.3 to run:

  $ heroku auth:token
  
and then copy & paste the token at the appropriate prompt. Once "git push heroku/origin master" completes successfully, your Tinder app will become active in the cloud as it shows at the end of the logs. Congratulations!

## 2.4 Testing Push
The Parse Push docs (#4.2.6) gives examples of using curl to send push notifications. Curl, or more properly cURL (#4.5.11) - not to be confused with curling locks or rocks! - can be performed from the Terminal. Essentially you pass it some http headers specifying the appId, the masterKey, etc and then a json object of your push notification. I will leave you to read the docs to try it. Because the length of the whole cURL command is long, the docs use a "\" to concatenate line-breaks which actually work as is if you copy & paste into Terminal. I prefer typing it out manually since you have to change many of the parameters manually anyway.

I can confirm that cURL works. I was also able to do it from the parse-dashboard.

As already noted, I have yet to figure out how to use Parse cloud code to send push notification. And I have not tried Android at all but this set-up (provided you uncomment & fill out the relevant lines in index.js) should do immediately work for Android, too.

Good luck & have fun! Please also do let me know about any bugs, enhancements or anything you figured out along the way!


# 3 Future Implementation & Enhancements

## 3.1 Bugs

### 3.1.1 Notification Title
When device is locked or otherwise app is in background, notification alerts somehow retains the title "ParseStarterProject-Swift" instead of new project name "Tinder".

## 3.2 Enhancements for iOS

### 3.2.1 Push from Device

### 3.2.2 Verify Cloud Send Function Works

## 3.3 Implementation for Android


# 4 References & Resources

## 4.1 Rob Percival iOS9 Course

### 4.1.1 Rob Percival Parse Starter Project Feb 2016
http://www.robpercival.co.uk/parse-server-on-heroku/

### 4.1.2 Rob Percival Parse Starter Project June 2015
http://www.robpercival.co.uk/parse-working-on-xcode-7swift-2/

### 4.1.3 Geir Fjærli Parse/Heroku Guide
https://www.udemy.com/the-complete-ios-9-developer-course/learn/v4/questions/1460332


## 4.2 Parse

### 4.2.1 Parse iOS Docs
http://parseplatform.github.io/docs/ios/guide/

### 4.2.2 Parse iOS SDK 1.14.2
https://github.com/ParsePlatform/Parse-SDK-iOS-OSX/releases/tag/1.14.2

### 4.2.3 Parse Server Github
https://github.com/ParsePlatform/parse-server-example

### 4.2.4 Parse Server set-up
https://github.com/ParsePlatform/parse-server/

### 4.2.5 Parse Server Videos
http://blog.parse.com/learn/parse-server-video-series-april-2016/

### 4.2.6 Parse Server Push
https://github.com/ParsePlatform/parse-server/wiki/Push

### 4.2.7 Parse Server Keys
https://github.com/ParsePlatform/parse-server/wiki/Parse-Server-Guide#keys

### 4.2.8 Parse Cloud Code
http://parseplatform.github.io/docs/cloudcode/guide/


## 4.3 Heroku

### 4.3.1 Heroku Node.js Server Tutorial
https://devcenter.heroku.com/articles/getting-started-with-nodejs

### 4.3.2 Heroku Toolbelt
https://toolbelt.heroku.com/

### 4.3.3 Heroku Git Authentication
http://stackoverflow.com/a/28331676/1827488

### 4.3.4 Heroku Git Repo Size Zero
https://github.com/ParsePlatform/parse-server/issues/1304

### 4.3.5 Heroku Local Environment Variables
https://devcenter.heroku.com/articles/heroku-local#set-up-your-local-environment-variables


## 4.4 Roger Stringer

### 4.4.1 Roger Stringer Parse/Heroku Deployment Tutorial
http://rogerstringer.com/2016/02/04/parse-server-heroku/

### 4.4.2 Roger Stringer Parse/Heroku Push Notification Tutorial
http://rogerstringer.com/2016/02/11/parse-server-push/


## 4.5 Misc

### 4.5.1 Bare Bone Node.js Web Server on Heroku
https://www.youtube.com/watch?v=vUqB77UO4E0

### 4.5.2 Express
https://www.npmjs.com/package/express

### 4.5.3 Git Push Heroku/Origin Master
http://stackoverflow.com/a/32238628/1827488

### 4.5.4 APNS Cannot Find Valid Connection To Device
https://github.com/ParsePlatform/parse-server/issues/1282

### 4.5.5 Generating PEM Files (Red Herring)
http://stackoverflow.com/a/38180025/1827488
https://www.raywenderlich.com/123862/push-notifications-tutorial
http://serverfault.com/a/9717

### 4.5.6 Parse Push Uses "pfx" NOT "pdx"
https://github.com/ParsePlatform/parse-server/issues/697

### 4.5.7 Show Hidden Files in Finder
http://ianlunn.co.uk/articles/quickly-showhide-hidden-files-mac-os-x-mavericks/

### 4.5.8 Markdown .md
https://en.wikipedia.org/wiki/Markdown

### 4.5.9 Permission Problems When Running NPM
https://github.com/nodeschool/discussions/issues/305

### 4.5.10 MIT License
https://opensource.org/licenses/MIT

### 4.5.11 cURL
https://quickleft.com/blog/command-line-tutorials-curl/


# 5 My Files

## 5.1 Everything You Need is Here
https://github.com/plaudev/ParseHerokuPushNotification

## 5.2 Some Screenshots
https://www.udemy.com/the-complete-ios-9-developer-course/learn/v4/questions/1597794
