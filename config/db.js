/**
 * Created by Bhuwan on 3/30/17.
 */
'use strict;'
var mongoose = require('mongoose');

// to create encrypted password
// var vault = require('avault').createVault(__dirname);
// var keyName = 'key1';
// vault.generateKey(keyName).then(
//     function (keyResponse) {
//         vault.store(keyName, '{"username": "<put db username here>", "password": "<put db user password here>"}', 'GitVault').then(
//             function (storeResponse) {
//                 console.log('Ok', storeResponse);
//             },
//             function (err) {
//                 console.log('Error', err);
//             });
//     },
//     function (err) {
//         console.log('Error', err);
//     });

var vault = require('avault').createVault(__dirname);
vault.get('GitVault', function (profileString) {
    if(!profileString){
        console.log('Error: required vault is not found');
    }else {
        var profile = JSON.parse(profileString);
        console.log(profile);
    }
    var options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
    replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };

    var dbHost = 'mongodb://' + profile.username +':' + profile.password + '@ds149700.mlab.com:49700/movie';

        mongoose.connect(dbHost, options);
    });

//
// var dbHost = 'mongodb://localhost/hw4movie'
//
// mongoose.connect(dbHost);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'))

db.once('open', function () {
    //console.log("Connected to DB");
});
var ActorSchema = new mongoose.Schema({
    Name: {type: String, required: true}
})

var movieSchema = new mongoose.Schema({
    Title: {type: String, required: true, unique: true},
    YearReleased: {type: Number, required: true},
    Actors: [ActorSchema]
})


module.exports = mongoose.model('Movie', movieSchema)
