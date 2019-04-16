'use strict';

const config = require('config');
const http = require('https');
const parseXmlString = require('xml2js').parseString;
const base64string = Buffer.from(`${config.jiraUsername}:${config.jiraPassword}`).toString('base64');

exports.getFisheyeReviewers = (reviewId, callback) => {
    const options = {
        hostname: 'fisheye.corp.magento.com',
        path: `/rest-service/reviews-v1/${reviewId}/reviewers`,
        port: 443,
        method: 'GET',
        headers: {
            'Authorization': `Basic ${base64string}`
        }
    };

    let data = '';
    const req = http.request(options, function (res) {
        res.on('data', (d) => {
           data += d; 
        });
        res.on('end', () => {
            parseXmlString(data, function (err, result) {
                if (err) {
                    callback(err);
                    return;
                }
                if (result.message && result.message[0]) {
                    callback(result.message[0]);
                    return;
                }
                
                if (!result.reviewers.reviewer) {
                    callback(null, []);
                    return;
                }
                
                callback(null, result.reviewers.reviewer.map((reviewer) => reviewer.userName[0]));
            });
        });
        
    });
    
    req.on('error', (error) => {
        callback(error);
    });
    req.write('');
    req.end();
};

exports.getFisheyeAuthor = (reviewId, callback) => {
    const options = {
        hostname: 'fisheye.corp.magento.com',
        path: `/rest-service/reviews-v1/${reviewId}`,
        port: 443,
        method: 'GET',
        headers: {
            'Authorization': `Basic ${base64string}`
        }
    };

    let data = '';
    const req = http.request(options, function (res) {
        res.on('data', (d) => {
           data += d; 
        });
        res.on('end', () => {
            parseXmlString(data, function (err, result) {
                if (err) {
                    callback(err);
                    return;
                }
                if (result.message && result.message[0]) {
                    callback(result.message[0]);
                    return;
                }
                callback(null, result.reviewData.author[0].userName[0]);
            });
        });
        
    });
    
    req.on('error', (error) => {
        callback(error);
    });
    req.write('');
    req.end();

};

exports.addFisheyeReviewer = (fisheyeUsername, reviewId, callback) => {
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
            if (res.statusCode === 204) {
                callback(null, `https://fisheye.corp.magento.com/cru/${reviewId}`);
                return;
            }
            
            parseXmlString(data, function (err, result) {
                if (err) {
                    callback(err);
                    return;
                }
                if (result.message && result.message[0]) {
                    callback(result.message[0]);
                    return;
                }
                callback(null, result);
            });
            
        });
        
    });
    
    req.on('error', (error) => {
        callback(error);
    });
    req.write(fisheyeUsername);
    req.end();

};