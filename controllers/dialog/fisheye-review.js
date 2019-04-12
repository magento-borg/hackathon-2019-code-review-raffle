'use strict';
const genericResponse = require('./generic-response.js');
const registry = require('registry.js');
const fisheye = require('fisheye-client.js');

function validate (payload) {
    let errors = [];
    
    if (!payload.submission) {
        throw new Error('Invalid submission payload');
    }
    
    const submission = payload.submission;
    
    ['review_id'].forEach((username) => {
        if (submission[username]) {
            submission[username] = submission[username].replace(/[^a-z0-9_-]/ig,'');
        }
        
        if (!submission[username]) {
            errors.push({
                name: username,
                error: 'Invalid input'
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
    
    registry.getReviewersInChannel(
        payload.channel.id,
        (err, data) => {
            if (err) {
                genericResponse(err, payload.response_url, callback);
                return;
            }
            let fields = [];
            
            if (!data.length) {
                genericResponse('There are no users in the raffle pool for this channel', payload.response_url, callback);
                return;
            }
            
            let user = data[Math.floor(Math.random() * data.length)];
            
            fisheye.addFisheyeReviewer(
                user.onelogin_username, 
                payload.submission.review_id,
                (error, url) => {
                    if (error) {
                        genericResponse(JSON.stringify(error), payload.response_url, callback);
                        return;
                    }
                    
                    genericResponse(`<@${user.user_id}> has been selected to review ${url}. :confetti_ball:`, payload.response_url, callback);
                }
            );
            
        }
    );
    
};