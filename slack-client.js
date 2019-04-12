'use strict';
const http = require('https');
const querystring = require('querystring');
const oAuthToken = process.env.oAuthToken;

exports.request = (method, path, data, callback) => {
    const stringData = JSON.stringify(data);
    
    let options = {
        hostname: 'slack.com',
        port: 443,
        path: path,
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${oAuthToken}`
        }
    };
    
    if (stringData.length) {
        options.headers['Content-Length'] = stringData.length;
    }
    
    let resData = '';
    const req = http.request(options, (res) => {
        res.on('data', (d) => {
            resData += d;
        });
        res.on('end', () => {
            callback(null, resData);
        });
    });
    
    req.on('error', (error) => {
        callback(error);
    });
    
    req.write(stringData);
    req.end();
};


exports.getUserInfo = (userId, callback) => {
  let options = {
        hostname: 'slack.com',
        port: 443,
        path: '/api/users.info?' + querystring.stringify(
            {
                token: oAuthToken,
                user: userId
            }
        ),
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    
    const req = http.request(options, (res) => {
        res.on('data', (d) => {
            callback(null, JSON.parse(d));
        });
    });
    
    req.on('error', (error) => {
        callback(error);
    });
    
    req.write('');
    req.end();  
};