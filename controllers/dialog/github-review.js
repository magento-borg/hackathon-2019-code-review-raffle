'use strict';
const genericResponse = require('./generic-response.js');
const registry = require('registry.js');
const github = require('github-client.js');

function validate (payload) {
    let errors = [];
    
    if (!payload.submission) {
        throw new Error('Invalid submission payload');
    }
    
    const submission = payload.submission;
    
    ['pr','org','repo'].forEach((username) => {
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
            
            if (!data.length) {
                genericResponse('Error: There are no users in the raffle pool for this channel', payload.response_url, callback);
                return;
            }
            
            github.getPrInfo(
                payload.submission.org, 
                payload.submission.repo, 
                payload.submission.pr,
                (error, pr) => {
                    if (error) {
                        genericResponse(JSON.stringify(error), payload.response_url, callback);
                        return;
                    }
                    
                    const username = pr.user.login;
                    
                    const eligibleUsers = data.filter((user) => {
                        return username !== user.github_username 
                            && !pr.requested_reviewers.some((reviewer) => reviewer.login === user.github_username);
                    });

                    if (!eligibleUsers.length) {
                        genericResponse('Error: The only users in the raffle pool are either the owner of the PR or already added to the review.', payload.response_url, callback);
                        return;
                    }
                    
                    const selectedUser = eligibleUsers[Math.floor(Math.random() * eligibleUsers.length)];
                    github.addGithubReviewer(
                        selectedUser.github_username, 
                        payload.submission.org, 
                        payload.submission.repo, 
                        payload.submission.pr,
                        (error, pr) => {
                            if (error) {
                                genericResponse('Github error: ' + JSON.stringify(error), payload.response_url, callback);
                                return;
                            }
                            
                            const url = pr.html_url;
                            
                            genericResponse(`<@${selectedUser.user_id}> has been selected to review ${url}. :confetti_ball:`, payload.response_url, callback);
                        }
                    );
                }
            );
        }
    );
    
};