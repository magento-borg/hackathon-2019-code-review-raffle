'use strict';

const config = require('config.js');
const dialogFrontController = require('./dialog-front-controller.js');
const blockFrontController = require('./block-front-controller.js');

module.exports = (params, callback) => {
    if (params.payload) {
        const payload = JSON.parse(params.payload);
        if (payload.type === 'dialog_submission') {
            dialogFrontController(payload, callback);
            return;
        }
        if (payload.type === 'block_actions') {
            blockFrontController(payload, callback);
            return;
        }
        
        callback('Invalid payload type');
        return;
    }

    let matches = params.text.match(/([a-z]+)\s*/);
    
    if (matches && matches[1] && config.commands[matches[1]]) {
        const command = require(config.commands[matches[1]]);
        command(params, callback);
        
        return;
    }
    
    require(config.commands.help)(params, callback, matches && matches[1]);
};