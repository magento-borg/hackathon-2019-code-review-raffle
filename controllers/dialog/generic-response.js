'use strict';
const http = require('https');
var url  = require('url');
const oAuthToken = process.env.oAuthToken;

module.exports = (text, response_url, callback) => {
    let responseData = {
        response_type: 'in_channel'
    };
    
    if (typeof text === 'object') {
        responseData.blocks = text;
    } else {
        responseData.text = text;
    }
    
    const stringData = JSON.stringify(responseData);
    const urlParts = url.parse(response_url);
    
    let options = {
        hostname: urlParts.hostname,
        path: urlParts.pathname,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${oAuthToken}`
        }
    };
    
    if (stringData.length) {
        options.headers['Content-Length'] = stringData.length;
    }
    
    const req = http.request(options, () => {
        callback(null, null, false);
    });
    req.write(stringData);
    req.end();
};