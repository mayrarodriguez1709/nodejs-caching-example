'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
    title: String,
    description: String,
    createAt: String
});

module.exports =  UserSchema;