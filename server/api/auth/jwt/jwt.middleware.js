'use strict';

const jwt = require('jwt-simple');
const moment = require('moment');
const secretKey = 'BZEEOGKFYK';

function ensureAuth(req, res, next) {

    if(!req.headers.authorization){
        return res.status(403).json({"msg": "Authorization header required."})
    }
    let payload;
    const token = req.headers.authorization.replace(/[' "]+/g, '');

    try {
        payload = jwt.decode(token, secretKey, null, null);

        if(payload.exp <= moment.unix()){
            return res.status(401).json({message: 'Token expired.'});
        }
    }catch (ex){
        return res.status(404).json({message: 'Token invalid.'});
    }

    req.user  = payload;

    next();
}

module.exports = { ensureAuth };