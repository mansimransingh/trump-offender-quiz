// server.js

// set up ========================
var express = require('express');
var app = express(); // create our app w/ express
var mongoose = require('mongoose'); // mongoose for mongodb
var morgan = require('morgan'); // log requests to the console (express4)
var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

var Answer = require('./answerSchema');

// configuration =================
//This needs to be changed to database
mongoose.connect('mongodb://localhost/trump', function (err) {
    if (err) console.log(err);
}); // connect to mongoDB database on modulus.io

app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({
    'extended': 'true'
})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
})); // parse application/vnd.api+json as json
app.use(methodOverride());


// define model =================
var Question = mongoose.model('Question', {
    question: String,
    answers: String,
    offended: Number,
    feedback: String,
    url: String
});

// listen (start app with node server.js) ======================================
app.listen(80);
console.log("App listening on port 80");

// routes ======================================================================

// api ---------------------------------------------------------------------
// get all todos
// app.get('/api/questions', function (req, res) {

//     // use mongoose to get all todos in the database
//     Question.find(function (err, todos) {

//         // if there is an error retrieving, send the error. nothing after res.send(err) will execute
//         if (err)
//             res.send(err)

//         res.json(questions); // return all todos in JSON format
//     });
// });

// create todo and send back all todos after creation. This needs to be adjusted for the answer inputted.
app.post('/api/answer', function (req, res) {
     var ans = parseInt(req.body.ans || 0);
     var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

     if (typeof ans === "number"){
         // create a todo, information comes from AJAX request from Angular
        Answer.create({
            ip: ip,
            value: ans
        }, function (err) {
            console.log(err);

            res.json({hello:'world'});
        });       
    } else {
        res.json({hello:'world'});
    }
});

// // delete a question
// app.delete('/api/questions/:question_id', function (req, res) {
//     Question.remove({
//         _id: req.params.question_id
//     }, function (err, question) {
//         if (err)
//             res.send(err);

//         // get and return all the questions after you create another
//         Question.find(function (err, questions) {
//             if (err)
//                 res.send(err)
//             res.json(questions);
//         });
//     });
// });

// application -------------------------------------------------------------
app.get('*', function(req, res) {
    res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});
