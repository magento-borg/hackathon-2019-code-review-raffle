'use strict';
const githubDialog = require('dialogs/github-review.js');
const fisheyeDialog = require('dialogs/fisheye-review.js');

const commands = {
    github: githubDialog,
    fisheye: fisheyeDialog,
    help: help
};

function help (params, callback, isError) {
    const message = 'Usage: `review <github|fisheye|help>`';
    if (isError) {
        callback(message);
        return;
    }
    
    callback(null, message);
}

module.exports = (params, callback) => {
    const matches = params.text.match(/^\s*review\s+(github|fisheye|help)\s*/);
    
    if (!matches || !matches[1] || !commands[matches[1]]) {
        commands.help(params, callback);
        return;
    }
    
    commands[matches[1]](params, callback);
};