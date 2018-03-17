'use strict';

var UserDao = require('../dao/user.dao');
var jwt = require('../../auth/jwt/jwt.service');
var bcrypt = require('bcrypt-nodejs');

const { check, validationResult } = require('express-validator/check');

/**
 * Método para traer los usuarios ACTIVOS
 * @param req
 * @param res
 * @param next
 */
function getAll(req, res, next) {
    let query = req.query;
    UserDao['getAll'](query)
        .then(async users =>{
            res.status(200).json({"users": users});
        })
        .catch(err => {
            res.status(500).json({message: err});
        });
}

/**
 * Método para traer un usuario
 * @param req
 * @param res
 * @param next
 */
function getById(req, res, next) {
    try{
        validationResult(req).throw();

        let userId = req.params.id;

        UserDao['getById'](userId)
            .then(async user =>{
                if(!user){
                    res.status(404).json({message: 'User not found.'});
                }else {
                    res.status(200).json({"user": user});
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
 * Método para crear un usuario
 * @param req
 * @param res
 * @param next
 */
function create(req, res, next) {

    try {
        validationResult(req).throw();

        let user = req.body;

        bcrypt.hash(user.password, null, null, (err, hash) => {
            if(err) {
                return res.status(400).send({message: 'Password encryption problem.'});
            }

            if(hash){
                user.password = hash;
                let userObj = JSON.parse(JSON.stringify(user));

                UserDao['create'](userObj)
                    .then(async _user =>{
                        res.status(201).json({"user": _user});
                    }).catch(err => {
                    if(err.code === 11000){
                        res.status(409).json({message: "User already exists."});
                    }{
                        res.status(500).json({message: err});
                    }
                });
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
 * Método para actualizar un usuario
 * @param req
 * @param res
 * @param next
 */
function update(req, res, next) {
    try {
        validationResult(req).throw();

        let user = req.body;
        let userObj = JSON.parse(JSON.stringify(user));
        let userId = req.params.id;

        UserDao['update'](userId, userObj)
            .then(async _user =>{
                if(!_user){
                    res.status(404).json({message: 'User not found.'});
                }else {
                    res.status(200).json({"user": _user});
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
 * Método para eliminar un Usuario
 * @param req
 * @param res
 * @param next
 */
function remove(req, res, next) {
    try{
        validationResult(req).throw();

        let userId = req.params.id;

        UserDao['remove'](userId)
            .then(async user =>{
                if(!user){
                    res.status(404).json({message: 'User not found.'});
                }else {
                    res.status(200).json({message: 'User deleted.'});
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
    check('email')
        .exists().withMessage('is required')
        .isEmail().withMessage('is an invalid Email format.'),
    check('password')
        .exists().withMessage('is required'),
];


const idAndOthersValidations = [
    check('id')
        .exists().withMessage('is required')
        .isMongoId().withMessage('is an invalid ObjectId format.'),
    check('email')
        .optional()
        .isEmail().withMessage('is an invalid Email format.'),
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