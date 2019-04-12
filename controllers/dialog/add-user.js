'use strict';
const genericResponse = require('./generic-response.js');
const registry = require('registry.js');
const slack = require('slack-client.js');

function validate (payload) {
    let errors = [];
    
    if (!payload.submission) {
        throw new Error('Invalid submission payload');
    }
    
    const submission = payload.submission;
    
    ['slack_username','github_username','onelogin_username'].forEach((username) => {
        if (submission[username]) {
            submission[username] = submission[username].replace(/[^a-z0-9]/ig,'');
        }
        
        if (!submission[username]) {
            errors.push({
                name: username,
                error: 'Invalid username'
            });
        }
    });
    
    return errors;
}
module.exports = (payload, callback) => {
    const errors = validate(payload);

    if (errors.length) {
        callback(errors, null, false);
        return;
    }
    
    slack.getUserInfo(payload.submission.slack_username, (err, data) => {
        if (err) {
            genericResponse(err, payload.response_url, callback);
            return;
        }
        const userId = data.user.id;
        registry.addReviewerToChannel(
            data.user.name,
            userId,
            payload.channel.id, 
            payload.submission.github_username, 
            payload.submission.onelogin_username, 
            (err, data) => {
                if (err) {
                    genericResponse(err, payload.response_url, callback);
                    return;
                }
                
                genericResponse(`Added <@${userId}> to the channel's raffle pool.`, payload.response_url, callback);
            }
        );
    });
    
};