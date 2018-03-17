'use strict';

const _ = require('lodash');
const UserSchema = require('../model/user.model');
const mongoose = require("mongoose");

/**
 * Método para traer todos los usuarios
 */
UserSchema.static('getAll', async (query) => {
    let _query = query;
    try{
        return await UserDao.find(_query).exec();
    }catch(err){
        throw err;
    }
});

UserSchema.static('getById', async (id) => {

    try{
        return await UserDao.findOne({_id: id}).exec();
    }catch (err){
        throw err;
    }
});

/**
 * Permite encontrar un usuario por su email
 */
UserSchema.static('getByEmail', async (email) => {

    try{
        return await UserDao.findOne({email: email}).exec();
    }catch (err){
        throw err;
    }
});



/**
 * Método para crear un usuario
 */
UserSchema.static('create', async (user) => {
    if (!_.isObject(user)) {
        throw new TypeError('User is not a valid object.');
    }

    let _user = new UserDao(user);
    let saved = await  _user.save();
    let __user = await UserDao.findOne({_id: saved._id})
        .exec();
    return (__user);
});

/**
 * Método para actualizar un usuario
 */
UserSchema.static('update', async (id, user) => {
    if (!_.isObject(user)) {
        throw new TypeError('User is not a valid object.');
    }

    try {
        return await UserDao.findOneAndUpdate({_id: id}, user, {new: true}).exec();
    }catch (err){
        throw err;
    }
});


UserSchema.static('remove', async (id) =>{
    try{
        return await UserDao.findOneAndRemove({_id: id}).exec();
    }catch (err){
        throw err;
    }
});

let UserDao = mongoose.model('User', UserSchema);
module.exports = UserDao;