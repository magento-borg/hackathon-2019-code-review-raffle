'use strict';

const jiraUser = process.env.jiraUsername;
const jiraPwd = process.env.jiraPassword;
const http = require('https');

exports.addFisheyeReviewer = (fisheyeUsername, reviewId, callback) => {
    const base64string = Buffer.from(`${jiraUser}:${jiraPwd}`).toString('base64');
    const options = {
        hostname: 'fisheye.corp.magento.com',
        path: `/rest-service/reviews-v1/${reviewId}/reviewers`,
        port: 443,
        method: 'POST',
        headers: {
            'Authorization': `Basic ${base64string}`,
            'Content-Length': fisheyeUsername.length
        }
    };

    let data = '';
    const req = http.request(options, function (res) {
        res.on('data', (d) => {
           data += d; 
        });
        res.on('end', () => {
           // 204 returned is success, however crucible doesn't return any other information
            if (res.statusCode === 204) {
                callback(null, `https://fisheye.corp.magento.com/cru/${reviewId}`);
                return;
            }
            
            // xml regex matching. Oh yea.
            const errors = data.match(/<message>(.*)<\/message>/);
            if (errors && errors[1]) {
                callback(errors[1]);
            } else {
                callback(data);
            }
        });
        
    });
    
    req.on('error', (error) => {
        callback(error);
    });
    req.write(fisheyeUsername);
    req.end();

};