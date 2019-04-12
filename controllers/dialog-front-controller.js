'use strict';

const config = require('config.js');

module.exports = (payload, callback) => {
    if (payload.callback_id && config.dialogSubmissions[payload.callback_id]) {
        require(config.dialogSubmissions[payload.callback_id])(payload, callback);
        return;
    }
    
    callback('Invalid callback_id');
    return;
};