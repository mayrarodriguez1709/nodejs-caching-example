'use strict';

var jwt = require('jwt-simple');
var moment = require('moment');
var secretKey = 'BZEEOGKFYK';

function createToken(user) {

    var payload = {
        sub: user.id,
        iat: moment().unix(),
        exp: moment().add(365, 'days')
    }

    return jwt.encode(payload, secretKey, null, null);

};

module.exports = { createToken };