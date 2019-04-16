'use strict';

const AWS = require('aws-sdk');
const qs = require('querystring');
const frontController = require('controllers/front-controller.js');

const kmsEncryptedToken = process.env.kmsEncryptedToken;
let token;

function processEvent(event, callback) {
    const params = qs.parse(event.body);
    if (params.payload) {
        const payload = JSON.parse(params.payload);
        
        if (payload.token !== token) {
            console.error(`Request token (${payload.token}) does not match expected`);
            callback('Invalid request token');
            return;
        }
    } else if (params.token !== token) {
        console.error(`Request token (${params.token}) does not match expected`);
        return callback('Invalid request token');
    }
    
    frontController(params, callback);
}

exports.handler = (event, context, callback) => {
    const done = (err, res, wrap) => {
        if (typeof wrap !== 'boolean') {
            wrap = true;
        }
        let body = res;
        
        if (err) {
            body = JSON.stringify({
                response_type: 'in_channel',
                text: typeof err === 'object' ? JSON.stringify(err) : err,
            });
        } else if (body !== null) {
            if (wrap) {
                body = JSON.stringify({
                    response_type: 'in_channel',
                    text: body,
                });
            }
        }
        
        callback(null, {
            statusCode: '200',
            body: body,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
    };

    if (token) {
        // Container reuse, simply process the event with the key in memory
        processEvent(event, done);
    } else if (kmsEncryptedToken && kmsEncryptedToken !== '<kmsEncryptedToken>') {
        const cipherText = { CiphertextBlob: new Buffer(kmsEncryptedToken, 'base64') };
        const kms = new AWS.KMS();
        kms.decrypt(cipherText, (err, data) => {
            if (err) {
                console.log('Decrypt error:', err);
                return done(err);
            }
            token = data.Plaintext.toString('ascii');
            processEvent(event, done);
        });
    } else {
        done('Token has not been set.');
    }
};
