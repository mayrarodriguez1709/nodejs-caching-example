'use strict';

const express = require('express');
const AuthController = require('../controller/auth.controller');
const endpoint = '/auth';
// const mdAuth = require('../../auth/jwt/jwt.middleware');

var api = express.Router();

api.post(`${endpoint}/register`, AuthController.objectValidation, AuthController.register);
api.post(`${endpoint}/login`, AuthController.loginValidation, AuthController.login);


module.exports = api;