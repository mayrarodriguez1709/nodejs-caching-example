'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
    names: String,
    surname: String,
    email: { type: String, unique: true},
    password: String
});

module.exports =  UserSchema;