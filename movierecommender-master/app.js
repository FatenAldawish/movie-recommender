/**
 * Copyright 2018 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var express = require('express'); // app server
var bodyParser = require('body-parser'); // parser for post requests
var Conversation = require('watson-developer-cloud/conversation/v1'); // watson sdk
var request = require('request');
var req = require('request');
var dateTime = require('node-datetime');
var http = require('http');



var app = express();
var description = '';
var sleep = require('system-sleep');
// for automatically deploying to IBM Cloud
const fs = require('fs');// file system for loading JSON;
var newLineStream = require('new-line');
var source = fs.createReadStream('./package.json');
var target = fs.createWriteStream('./out.json');
var newLine = newLineStream();
source.pipe(newLine).pipe(target);

var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');

const WatsonConversationSetup = require('./lib/watson-conversation-setup');

const DEFAULT_NAME_C = 'Conversation-ICD';


// Bootstrap application settings
app.use(express.static('./public')); // load UI from public folder
app.use(bodyParser.json());

// Create the Conversation service wrapper
var conversation = new Conversation({
  // If unspecified here, the CONVERSATION_USERNAME and CONVERSATION_PASSWORD env properties will be checked
  // After that, the SDK will fall back to the bluemix-provided VCAP_SERVICES environment property
  // username: '<username>',
  // password: '<password>',
  url: 'https://gateway.watsonplatform.net/conversation/api',
  version_date: '2016-10-21',
  version: 'v1'
});

// for automatically deploying to IBM Cloud
let workspaceID; // workspaceID will be set when the workspace is created or validated.
const conversationSetup = new WatsonConversationSetup(conversation);
const workspaceJson = JSON.parse(fs.readFileSync('./training/ITSM_workspace.json'));
const conversationSetupParams = { default_name: DEFAULT_NAME_C, workspace_json: workspaceJson };
conversationSetup.setupConversationWorkspace(conversationSetupParams, (err, data) => {
  if (err) {
    handleSetupError(err);
  } else {
    console.log('Watson Assistant is ready!');
    workspaceID = data;
  }
});



// Create the Tone analyzer service wrapper
var toneAnalyzer = new ToneAnalyzerV3({
  version_date:'2016-05-19',
  version: 'v3',
  username: 'ae7743a2-1b2c-45f9-b7ac-253b3ae3901c',
    password: 'DTIM4SwNdrIQ',
    url: 'https://gateway.watsonplatform.net/tone-analyzer/api'
  });




// Endpoint to be call from the client side
app.post('/api/message', function (req, res) {
  var workspace = process.env.WORKSPACE_ID || '<workspace-id>';
  if (!workspace || workspace === '<workspace-id>') {
    return res.json({
      'output': {
        'text': 'The app has not been configured with a <b>WORKSPACE_ID</b> environment variable. Please refer to the ' + '<a href="https://github.com/watson-developer-cloud/conversation-simple">README</a> documentation on how to set this variable. <br>' + 'Once a workspace has been defined the intents may be imported from ' + '<a href="https://github.com/watson-developer-cloud/conversation-simple/blob/master/training/car_workspace.json">here</a> in order to get a working application.'
      }
    });
  }

  var payload = {
    workspace_id: workspace,
    context: req.body.context || {},
    input: req.body.input || {text: 'Hi'}

  };


  // Send the input to the conversation service
  conversation.message(payload, function (err, data) {
    if (err) {
      return res.status(err.code || 500).json(err);
    }

    {
        return res.json(updateMessage(payload, data));
    }

  });

});

/**
 * Updates the response text using the intent confidence
 * @param  {Object} input The request to the Conversation service
 * @param  {Object} response The response from the Conversation service
 * @return {Object}          The response with the updated message
 */

getJoyMovies();
var JoyMovies =[];
getSadMovies();
var SadMovies =[];
getComedyMovies();
var ComedyMovies =[];
var movies = [];


function updateMessage(input, response) {
    var responseTone;
    var tone_type=null;
    if (!response.output) {
        response.output = {};
    } else {
        if (response.intents[0].intent == 'emotion') {
            toneAnalyzer.tone(
                {
                    tone_input: response.input.text,
                    content_type: 'text/plain'
                },
                function (err, tone) {
                    if (err) {
                        console.log(err);
                    } else {
                        responseTone = tone.document_tone.tone_categories[0].tones[0];
                        for (var i = 1; i < tone.document_tone.tone_categories[0].tones.length; i++) {
                            if (tone.document_tone.tone_categories[0].tones[i].score > tone.document_tone.tone_categories[0].tones[0].score) {
                                responseTone = tone.document_tone.tone_categories[0].tones[i];

                            }
                        }


                    }



                });

            sleep(3*1000);
           response.output.text= getTone(responseTone);
            return response;
        }

        else {
            return response;
        }
    }

}

function getTone(tone) {
    var text;
    if (tone.tone_name == 'Joy'){
        text = 'we detected'+' '+ tone.tone_name +' '+'<br/>'+
            'based on your mood ,the following movies are recommended for you:'+' '+'<br/>'
            +'<img'+' '+'src='+'https://image.tmdb.org/t/p/w1280'+ JoyMovies[0].poster_path+' '+'height'+'='+'200'+' '+ 'width'+'='+'150' +'>'
            +' '+'<img'+' '+'src='+'https://image.tmdb.org/t/p/w1280'+ JoyMovies[1].poster_path+' '+'height'+'='+'200'+' '+ 'width'+'='+'150' +'>'
            +' '+'<img'+' '+'src='+'https://image.tmdb.org/t/p/w1280'+ JoyMovies[2].poster_path+' '+'height'+'='+'200'+' '+ 'width'+'='+'150' +'>'
            +' '+'<img'+' '+'src='+'https://image.tmdb.org/t/p/w1280'+ JoyMovies[3].poster_path+' '+'height'+'='+'200'+' '+ 'width'+'='+'150' +'>'
            +' '+'<img'+' '+'src='+'https://image.tmdb.org/t/p/w1280'+ JoyMovies[4].poster_path+' '+'height'+'='+'200'+' '+ 'width'+'='+'150' +'>'
            +' '+'<img'+' '+'src='+'https://image.tmdb.org/t/p/w1280'+ JoyMovies[5].poster_path+' '+'height'+'='+'200'+' '+ 'width'+'='+'150' +'>'


        return text;
  }
  else if (tone.tone_name == 'Sadness'){
        text = 'we detected'+' '+ tone.tone_name +' '+'<br/>'+
            'based on your mood ,the following movies are recommended for you:'+' '+'<br/>'
            +'<img'+' '+'src='+'https://image.tmdb.org/t/p/w1280'+ SadMovies[0].poster_path+' '+'height'+'='+'200'+' '+ 'width'+'='+'150' +'>'
            +' '+'<img'+' '+'src='+'https://image.tmdb.org/t/p/w1280'+ SadMovies[1].poster_path+' '+'height'+'='+'200'+' '+ 'width'+'='+'150' +'>'
            +' '+'<img'+' '+'src='+'https://image.tmdb.org/t/p/w1280'+ SadMovies[2].poster_path+' '+'height'+'='+'200'+' '+ 'width'+'='+'150' +'>'
            +' '+'<img'+' '+'src='+'https://image.tmdb.org/t/p/w1280'+ SadMovies[3].poster_path+' '+'height'+'='+'200'+' '+ 'width'+'='+'150' +'>'
            +' '+'<img'+' '+'src='+'https://image.tmdb.org/t/p/w1280'+ JoyMovies[4].poster_path+' '+'height'+'='+'200'+' '+ 'width'+'='+'150' +'>'
            +' '+'<img'+' '+'src='+'https://image.tmdb.org/t/p/w1280'+ JoyMovies[5].poster_path+' '+'height'+'='+'200'+' '+ 'width'+'='+'150' +'>'


        return text;
  }
  else if (tone.tone_name == 'Disgust' ||  tone.tone_name == 'Fear'  ||tone.tone_name == 'Anger'){
        text = 'we detected'+' '+ tone.tone_name +' '+'<br/>'+
            'based on your mood ,the following movies are recommended for you:'+' '+'<br/>'
            +'<img'+' '+'src='+'https://image.tmdb.org/t/p/w1280'+ ComedyMovies[0].poster_path+' '+'height'+'='+'200'+' '+ 'width'+'='+'150' +'>'
            +' '+'<img'+' '+'src='+'https://image.tmdb.org/t/p/w1280'+ ComedyMovies[1].poster_path+' '+'height'+'='+'200'+' '+ 'width'+'='+'150' +'>'
            +' '+'<img'+' '+'src='+'https://image.tmdb.org/t/p/w1280'+ ComedyMovies[2].poster_path+' '+'height'+'='+'200'+' '+ 'width'+'='+'150' +'>'
            +' '+'<img'+' '+'src='+'https://image.tmdb.org/t/p/w1280'+ ComedyMovies[3].poster_path+' '+'height'+'='+'200'+' '+ 'width'+'='+'150' +'>'
            +' '+'<img'+' '+'src='+'https://image.tmdb.org/t/p/w1280'+ JoyMovies[4].poster_path+' '+'height'+'='+'200'+' '+ 'width'+'='+'150' +'>'
            +' '+'<img'+' '+'src='+'https://image.tmdb.org/t/p/w1280'+ JoyMovies[5].poster_path+' '+'height'+'='+'200'+' '+ 'width'+'='+'150' +'>'


        return text;
  }

}

function getJoyMovies() {
        request({
            headers:
                { 'content-type': 'application/json' },
            url :'https://api.themoviedb.org/3/discover/movie?with_genres=35,10749,18&page=1&include_video=false&include_adult=false&sort_by=popularity.desc&language=en-U&api_key=2919effefd26e2a3bdfa4cd065e40724',
            method: "GET"
        }, function (err, resp) {
            if (err) {
                console.log(err);
            } else {
                JSON.parse(resp.body).results.forEach(function(result){
                    JoyMovies.push(result);

                })


            }

        });
    }

function getComedyMovies() {
    request({
        headers:
            { 'content-type': 'application/json' },
        url :'https://api.themoviedb.org/3/discover/movie?with_genres=35&page=1&include_video=false&include_adult=false&sort_by=popularity.desc&language=en-U&api_key=2919effefd26e2a3bdfa4cd065e40724',
        method: "GET"
    }, function (err, resp) {
        if (err) {
            console.log(err);
        } else {
            JSON.parse(resp.body).results.forEach(function(result){
                ComedyMovies.push(result);

            })


        }

    });
}
function getSadMovies() {
    request({
        headers:
            { 'content-type': 'application/json' },
        url :'https://api.themoviedb.org/3/discover/movie?with_genres=18&page=1&include_video=false&include_adult=false&sort_by=popularity.desc&language=en-U&api_key=2919effefd26e2a3bdfa4cd065e40724',
    method: "GET"
    }, function (err, resp) {
        if (err) {
            console.log(err);
        } else {
            JSON.parse(resp.body).results.forEach(function(result){
                SadMovies.push(result);

            })


        }

    });
}
/*function getAngerMovies() {
    request({
        headers:
            { 'content-type': 'application/json' },
        url :'https://api.themoviedb.org/3/discover/movie?with_genres=35&page=1&include_video=false&include_adult=false&sort_by=popularity.desc&language=en-U&api_key=2919effefd26e2a3bdfa4cd065e40724',
        method: "GET"
    }, function (err, resp) {
        if (err) {
            console.log(err);
        } else {
            JSON.parse(resp.body).results.forEach(function(result){
                AngerMovies.push(result);

            })


        }

    });
}
function getDisgustMovies() {
    request({
        headers:
            { 'content-type': 'application/json' },
        url :'https://api.themoviedb.org/3/discover/movie?with_genres=35&page=1&include_video=false&include_adult=false&sort_by=popularity.desc&language=en-U&api_key=2919effefd26e2a3bdfa4cd065e40724',
        method: "GET"
    }, function (err, resp) {
        if (err) {
            console.log(err);
        } else {
            JSON.parse(resp.body).results.forEach(function(result){
                DisgustMovies.push(result);

            })


        }

    });
}*/

module.exports = app;
