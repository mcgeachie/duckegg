'use strict';

/* Express Dependencies */
var express = require('express');
var config = require('./config')
var app = express();
var port = config.web.port;

/* Use Handlebars for templating */
var exphbs = require('express3-handlebars');
var hbs;


/* Use NodeMailer for emailer */
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: config.gmail.username,
        pass: config.gmail.password
    }
});


// Big help from http://stackoverflow.com/users/893780/robertklep via
// someone else's stack overflow question
// http://stackoverflow.com/questions/16323806/transfer-files-to-dropbox-from-node-js-without-browser-based-oauth-authenticatio
/* Dropbox */
var Dropbox = require('dropbox');
var dbClient = new Dropbox.Client({
    key: config.dropbox.key,
    secret: config.dropbox.secret,
    token: config.dropbox.token
});


/* Captcha */
var sweetcaptcha = require('sweetcaptcha')(config.captcha.id, config.captcha.key, config.captcha.secret);

// For gzip compression
app.use(express.compress());

// To parse body
app.use(express.bodyParser());


/* Config for Production and Development */
if (process.env.NODE_ENV === 'production') {
    // Set the default layout and locate layouts and partials
    app.engine('handlebars', exphbs({
        defaultLayout: 'main',
        layoutsDir: 'dist/views/layouts/',
        partialsDir: 'dist/views/partials/'
    }));

    // Locate the views
    app.set('views', __dirname + '/dist/views');

    // Locate the assets
    app.use(express.static(__dirname + '/dist/assets'));

} else {
    app.engine('handlebars', exphbs({
        // Default Layout and locate layouts and partials
        defaultLayout: 'main',
        layoutsDir: 'views/layouts/',
        partialsDir: 'views/partials/'
    }));

    // Locate the views
    app.set('views', __dirname + '/views');

    // Locate the assets
    app.use(express.static(__dirname + '/assets'));
}

// Set Handlebars
app.set('view engine', 'handlebars');



/* Routes */

//Index
app.get('/', function (request, response, next) {
    sweetcaptcha.api('get_html', function (error, html) {
        if (error) return console.log(error);

        response.render('index', { captcha : html });
    });
});

// Mailer Endpoint
app.post('/send', function (request, response) {

    var captchaOptions = {
            sckey: request.body.sckey,
            scvalue: request.body.scvalue
        };

    sweetcaptcha.api('check', captchaOptions, function (err, res) {
        if (err) return console.log(err);

        if (res === 'true') {

            var mailOptions = {
                    from: request.body.user.name + '<' + request.body.user.email + '>', // sender
                    to: 'mcgeachiehimself@gmail.com', // comma separated list of receivers
                    subject: 'Project Duckegg: Submission from ' + request.body.user.name, // subject
                    text: request.body.user.text // plain-text body
                };

            console.log(request.body.user.picture);

            dbClient.authenticate(function (error, client) {
                if (error) return console.log(error);

                console.log('Connected to Dropbox...');
            });

            // transporter.sendMail(mailOptions, function (error, info) {
            //     var msg = error ? error : 'Message sent: ' + info.response;
            //     console.log(msg);
            // });

            response.send("Thanks! Have a biscuit.");
        }

        if (response === 'false'){
            console.log("Invalid Captcha");
            response.send("Try again");
        }
    });
});


/* Start it up */
app.listen(config.web.port);
console.log('Express started on port ' + config.web.port);
