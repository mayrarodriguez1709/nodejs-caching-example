'use strict';

const express = require('express');
const bodyParser = require('body-parser');
// const redis = require('redis');

const app = express();
// const client = redis.createClient(); //creates a new client

/*client.on('connect', function() {
    console.log('Conectado con Redis');
});*/

app.use(bodyParser.urlencoded({extended: false, limit: '50mb'}));
app.use(bodyParser.json({limit: '50mb'}));

const authRoutes = require('./server/api/auth/routes/auth.routes');
const userRoutes = require('./server/api/user/routes/user.routes');
const postRoutes = require('./server/api/post/routes/post.routes');

app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', postRoutes);

module.exports = app;