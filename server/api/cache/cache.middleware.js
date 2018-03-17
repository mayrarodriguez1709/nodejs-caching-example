'use strict';

// const redis = require('redis');
// const client = redis.createClient();
// const moment = require('moment');

var mcache = require('memory-cache');

var cache = (duration) => {
    return (req, res, next) => {
        let key = '__express__' + req.originalUrl || req.url;
        let cachedBody = mcache.get(key);
        if (cachedBody) {
            res.send(JSON.parse(cachedBody));
            return
        } else {
            res.sendResponse = res.send;
            res.send = (body) => {
                // TODO: add 304 status if match
                res.setHeader('Cache-Control', `public, max-age=${duration}`);
                res.setHeader("Expires", new Date(Date.now() + duration).toUTCString());
                mcache.put(key, body, duration * 1000);
                res.sendResponse(body);
            };
            next()
        }
    }
};

module.exports = { cache };