'use strict';
const genericResponse = require('controllers/dialog/generic-response.js');
const config = require('config.js');

module.exports = (payload, callback) => {
    if (payload.actions && payload.actions[0] && config.blockActions[payload.actions[0].value]) {
        require(config.blockActions[payload.actions[0].value])(payload, callback);
        return;
    }
    
    genericResponse('Invalid action', payload.response_url, callback);
    return;
};