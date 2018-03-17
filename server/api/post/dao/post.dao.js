'use strict';

const _ = require('lodash');
const PostSchema = require('../model/post.model');
const mongoose = require("mongoose");

PostSchema.static('getAll', async (query) => {
    let _query = query;
    try{
        return await PostDao.find(_query).exec();
    }catch(err){
        throw err;
    }
});

PostSchema.static('getById', async (id) => {

    try{
        return await PostDao.findOne({_id: id}).exec();
    }catch (err){
        throw err;
    }
});

PostSchema.static('create', async (post) => {
    if (!_.isObject(post)) {
        throw new TypeError('Post is not a valid object.');
    }

    let _post = new PostDao(post);
    let saved = await  _post.save();
    let __post = await PostDao.findOne({_id: saved._id})
        .exec();
    return (__post);
});

PostSchema.static('update', async (id, post) => {
    if (!_.isObject(post)) {
        throw new TypeError('Post is not a valid object.');
    }

    try {
        return await PostDao.findOneAndUpdate({_id: id}, post, {new: true}).exec();
    }catch (err){
        throw err;
    }
});


PostSchema.static('remove', async (id) =>{
    try{
        return await PostDao.findOneAndRemove({_id: id}).exec();
    }catch (err){
        throw err;
    }
});

let PostDao = mongoose.model('Post', PostSchema);
module.exports = PostDao;