'use strict';
const genericResponse = require('./generic-response.js');
const registry = require('registry.js');

function validate (payload) {
    let errors = [];
    
    if (!payload.submission) {
        throw new Error('Invalid submission payload');
    }
    
    const submission = payload.submission;
    
    ['slack_username'].forEach((username) => {
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

    registry.removeReviewerFromChannel(
        payload.submission.slack_username,
        payload.channel.id, 
        (err, data) => {
            if (err) {
                if (err.code && err.code === 'ConditionalCheckFailedException') {
                    genericResponse(`<@${payload.submission.slack_username}> user is not currently in the channel's raffle pool`, payload.response_url, callback);
                    return;
                }
                genericResponse(err, payload.response_url, callback);
                return;
            }
            
            genericResponse(`Removed <@${payload.submission.slack_username}> from the channel's raffle pool`, payload.response_url, callback);
        }
    );
};