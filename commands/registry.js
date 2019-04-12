'use strict';
const registry = require('registry.js');
const addUserDialog = require('dialogs/add-user.js');
const removeUserDialog = require('dialogs/remove-user.js');
const infoDialog = require('dialogs/user-info.js');

const commands = {
    list: listUsers,
    add: addUser,
    remove: removeUser,
    info: info,
    help: help
};

function listUsers (params, callback) {
    registry.getReviewersInChannel(
        params.channel_id,
        (err, data) => {
            if (err) {
                callback(err);
                return;
            }
            let fields = [];
            
            if (!data.length) {
                callback(null, 'There are no users in the raffle pool for this channel');
                return;
            }
            
            data.forEach((user) => {
                fields.push({
    				type: 'plain_text',
    				text: `<@${user.username}>`,
    				emoji: true
    			});
            });
            
            callback(null, JSON.stringify({
                response_type: 'in_channel',
                blocks: [{
            		type: 'section',
            		fields: fields
            	}]
            }), false);
        }
    );
}

function addUser (params, callback) {
    addUserDialog(params, callback);
}
function removeUser (params, callback) {
    removeUserDialog(params, callback);
}
function info (params, callback) {
    infoDialog(params, callback);
}
function help (params, callback, isError) {
    const message = 'Usage: `registry <list|add|remove|info|help>`';
    if (isError) {
        callback(message);
        return;
    }
    
    callback(null, message);
}

module.exports = (params, callback) => {
    const matches = params.text.match(/^\s*registry\s+(list|add|remove|info|help)\s*/);
    
    if (!matches || !matches[1] || !commands[matches[1]]) {
        commands.help(params, callback);
        return;
    }
    
    commands[matches[1]](params, callback);
};