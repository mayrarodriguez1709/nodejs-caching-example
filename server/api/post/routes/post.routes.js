'use strict';

const express = require('express');
const PostController = require('../controller/post.controller');
const endpoint = '/post';
const mdAuth = require('../../auth/jwt/jwt.middleware');
const mdCache = require('../../cache/cache.middleware');

var api = express.Router();

api.get(endpoint, [ mdCache.cache(10), mdAuth.ensureAuth],PostController.getAll);
api.get(`${endpoint}/:id`, [ mdCache.cache(20), mdAuth.ensureAuth, PostController.idAndOthersValidations ], PostController.getById);
api.post(endpoint, PostController.objectValidation, PostController.create);
api.patch(`${endpoint}/:id`, [ mdAuth.ensureAuth, PostController.idAndOthersValidations], PostController.update);
api.delete(`${endpoint}/:id`, [ mdAuth.ensureAuth, PostController.idAndOthersValidations ], PostController.remove);


module.exports = api;