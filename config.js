var duckegg = require('./duckegg');
var config = {};

config.gmail = {};
config.dropbox = {};
config.captcha = {};
config.web = {};

config.gmail.username = process.env.GMAIL_USER || 'gmail_username'; //sender's gmail username
config.gmail.password = process.env.GMAIL_PASS || 'gmail_password'; //sender's gmail password

config.dropbox.key = process.env.DROPBOX_KEY || 'dropbox_app_key';
config.dropbox.secret = process.env.DROPBOX_SECRET || 'dropbox_app_secret';

config.captcha.id = process.env.CAPTCHA_ID || 123456; //6 digit integer
config.captcha.key = process.env.CAPTCHA_KEY || 'abcdef0123456789abcdef0123456789'; //32 character hexadecimal string
config.captcha.secret = process.env.CAPTCHA_SECRET || '0123456789abcdef0123'; //19 character hexadecimal string

config.web.port = process.env.WEB_PORT || 3000;


////////////////////////////////////
config.gmail.username = duckegg.GMAIL_USER;
config.gmail.password = duckegg.GMAIL_PASS;

config.dropbox.key = duckegg.DROPBOX_KEY;
config.dropbox.secret = duckegg.DROPBOX_SECRET;
config.dropbox.token = duckegg.DROPBOX_TOKEN;

config.captcha.id = duckegg.CAPTCHA_ID;
config.captcha.key = duckegg.CAPTCHA_KEY;
config.captcha.secret = duckegg.CAPTCHA_SECRET;

config.web.port = duckegg.WEB_PORT;
////////////////////////////////////


module.exports = config;
