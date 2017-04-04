/**
 * Created by bhuwan on 3/30/17.
 */

'use strict;'

var Movies = require('../../config/db')


module.exports = {
    getAll : getAll,
    saveit : saveit,
    getOne : getOne,
    update : update,
    delMovie : delMovie
};

function getAll(req,res,next){
    Movies.find({},function(err,response){
        if(err) throw {err:err};
        var allMovie = response;
        res.send({Movielist: allMovie});
    });
}

//POST /movie operationId
function saveit(req, res, next) {
    var mTitle = req.body.Title;
    // make sure movie doesn't exit in database before saving
    Movies.find({Title: mTitle}, function (err, response) {
        if (err) throw {err:err};
        if (response.length === 0) {

            var newMovie = new Movies(req.body);
            newMovie.save(function (err) {
                if (err) throw {err:err};
            });
            res.send({success: "New movie successfully added to database"})
        }
        else
            res.send({message: "Movie already exist"})
    })
}
//GET /movie/{id} operationId
function getOne(req, res, next) {
    var Title = req.swagger.params.Title.value; //req.swagger contains the path parameters
    var movie = Movies.find({Title : Title}, function (err,response) {
        if (err) throw {err:err};
        if (response.length === 0){
            res.send({message: "No such movie is found"})
        }
        else
        res.send({movie: response})
    });
}
//PUT /movie/{id} operationId
function update(req, res, next) {
    var mTitle = req.swagger.params.Title.value; //req.swagger contains the path parameters
    // make sure movie doesn't exit in database before saving
    Movies.find({Title: mTitle}, function (err, movie) {
        if (err) throw {err:err};
        if (movie.length === 0) {
            res.send({message: "No such movie is found"})
        }
        else {
            Movies.findOneAndUpdate({Title: mTitle},{$set: req.body},{new: true}, function (err, numUpdated) {
               // console.log(updated)
            });
             res.send({message: "Movie is updated"})
        }
        // res.send(req.body);
    })
}
//DELETE /movie/{id} operationId
function delMovie(req, res, next) {
    var Title = req.swagger.params.Title.value; //req.swagger contains the path parameters
    Movies.find({Title: Title}, function (err, response) {
        if (err) throw {err:err};
        // if movie doesn't exist send the message
        if (response.length === 0) {
            res.send({message: "No such movie is found"})
        }
        else {
            Movies.remove({ Title: Title }, function(err) {
               if(err) throw {err:err};
               res.send({message: "Movie successfully deleted"})
            });
        }
    })
}