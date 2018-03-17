'use strict';

var PostDao = require('../dao/post.dao');
// const redis = require('redis');
// const client = redis.createClient();

const { check, validationResult } = require('express-validator/check');

/**
 * Método para traer los Posts
 * @param req
 * @param res
 * @param next
 */
function getAll(req, res, next) {
    let query = req.query;
    // const urlKey = req.protocol + '://' + req.get('host') + req.originalUrl;
    PostDao['getAll'](query)
        .then(async posts => {
            console.log('Posts');
            // const time = 1000;
            // client.set(urlKey, JSON.stringify(posts), 'EX', time);

            res.status(200).json({"posts": posts});
        })
        .catch(err => {
            res.status(500).json({message: err});
        });
}

/**
 * Método para traer un post
 * @param req
 * @param res
 * @param next
 */
function getById(req, res, next) {
    try{
        validationResult(req).throw();

        let postId = req.params.id;

        PostDao['getById'](postId)
            .then(async post =>{
                if(!post){
                    res.status(404).json({message: 'Post not found.'});
                }else {
                    res.status(200).json({"post": post});
                }
            })
            .catch(err => {
                res.status(500).json({message: err});
            });
    }catch (err){
        const errorFormatter = ({ msg, param }) => {
            return `The value: ${param} ${msg}`;
        };
        const result = validationResult(req).formatWith(errorFormatter);
        if(!result.isEmpty()){
            return res.status(422).json({ errors: result.array() });
        }
    }
}

/**
 * Método para crear un post
 * @param req
 * @param res
 * @param next
 */
function create(req, res, next) {
    // const urlKey = req.protocol + '://' + req.get('host') + req.originalUrl;
    try {
        validationResult(req).throw();

        let post = req.body;

        let postObj = JSON.parse(JSON.stringify(post));
        postObj['createAt'] = new Date();
        PostDao['create'](postObj)
            .then(async _post => {
                // const time = 1000;
                // client.set(urlKey, JSON.stringify(_post), 'EX', time);
                // client.del('http://localhost:3977/api/posts');
                // res.setHeader('Cache-Control', `public, max-age=${time}`);
                // res.setHeader("Expires", new Date(Date.now() + time).toUTCString());
                res.status(201).json({"post": _post});
            }).catch(err => {
            if(err.code === 11000){
                res.status(409).json({message: "Post already exists."});
            }{
                res.status(500).json({message: err});
            }
        });


    }catch (err){
        const errorFormatter = ({ msg, param }) => {
            return `The value: ${param} ${msg}`;
        };
        const result = validationResult(req).formatWith(errorFormatter);
        if(!result.isEmpty()){
            return res.status(422).json({ errors: result.array() });
        }
    }
}

/**
 * Método para actualizar un post
 * @param req
 * @param res
 * @param next
 */
function update(req, res, next) {
    try {
        validationResult(req).throw();

        let post = req.body;
        let postObj = JSON.parse(JSON.stringify(post));
        let postId = req.params.id;

        PostDao['update'](postId, postObj)
            .then(async _post =>{
                if(!_post){
                    res.status(404).json({message: 'Post not found.'});
                }else {
                    res.status(200).json({"post": _post});
                }
            }).catch(err => res.status(500).json({message: err}));

    }catch (err){
        const errorFormatter = ({ msg, param }) => {
            return `The value: ${param} ${msg}`;
        };
        const result = validationResult(req).formatWith(errorFormatter);
        if(!result.isEmpty()){
            return res.status(422).json({ errors: result.array() });
        }
    }
}

/**
 * Método para eliminar un post
 * @param req
 * @param res
 * @param next
 */
function remove(req, res, next) {
    try{
        validationResult(req).throw();

        let postId = req.params.id;

        PostDao['remove'](postId)
            .then(async post =>{
                if(!post){
                    res.status(404).json({message: 'Post not found.'});
                }else {
                    res.status(200).json({message: 'Post deleted.'});
                }
            })
            .catch(err => res.status(500).json({message: err}));
    }catch (err){
        const errorFormatter = ({ msg, param }) => {
            return `The value: ${param} ${msg}`;
        };
        const result = validationResult(req).formatWith(errorFormatter);
        if(!result.isEmpty()){
            return res.status(422).json({ errors: result.array() });
        }
    }
}

const objectValidation = [
    check('title')
        .exists().withMessage('is required'),
    check('description')
        .exists().withMessage('is required'),
];


const idAndOthersValidations = [
    check('title')
        .exists().withMessage('is required'),
    check('description')
        .exists().withMessage('is required'),
];

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove,
    objectValidation,
    idAndOthersValidations
};