'use strict';

var UserDao = require('../../user/dao/user.dao');

var jwt = require('../../auth/jwt/jwt.service');
var bcrypt = require('bcrypt-nodejs');

const { check, validationResult } = require('express-validator/check');


/**
 * Registro único para los administradores
 * @param req
 * @param res
 * @param next
 */
function register(req, res, next) {

    try {
        validationResult(req).throw();

        let user = req.body;
        let userObj = JSON.parse(JSON.stringify(user));

        bcrypt.hash(userObj.password, null, null, (err, hash) => {
            if(err) {
                return res.status(400).send({message: 'Password encryption problem.'});
            }

            if(hash){
                userObj.password = hash;
                UserDao['create'](userObj)
                    .then(async _user =>{
                        delete _user.password;
                        res.status(201).json({"user": _user});
                    }).catch(err => {
                    if(err.code === 11000){
                        res.status(409).json({message: "User already exists."});
                    }else{
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


function login(req, res, next) {
    try{
        validationResult(req).throw();

        let email = req.body.email;
        let password = req.body.password;

        UserDao['getByEmail'](email)
            .then(async user =>{
                if(!user){
                    res.status(404).json({"err": 'User not found.'});
                }else {
                    bcrypt.compare(password, user.password, (err) => {
                        if(err){
                            res.status(400).json({"err": 'Invalid credentials.'});
                        }else {
                            res.status(200).json({"token": jwt.createToken(user)});
                        }
                    });
                }
            })
            .catch(err => res.status(500).json({"err": err}));
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
        .isMongoId().withMessage('is an invalid ObjectId format.')
];

const loginValidation = [
    check('email')
        .exists().withMessage('is required')
        .isEmail().withMessage('is an invalid Email format.'),
    check('password')
        .exists().withMessage('is required'),
];

module.exports = {
    register,
    login,
    objectValidation,
    idAndOthersValidations,
    loginValidation
};