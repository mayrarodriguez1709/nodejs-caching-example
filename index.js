'use strict';

var mongoose = require('mongoose');
var port = process.env.PORT || 3977;

var app = require('./app');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/nodejs_redis_db')
    .then(function() {
        console.log('Conectado a la BD');
        app.listen(port, function () {
            console.log('Servidor corriendo exitosamente en http://localhost:'+port)
        })
    }, function(err) {
        console.log(err); // Error!
        throw err;
    });