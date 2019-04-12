'use strict';
const registry = require('registry.js');
const genericResponse = require('controllers/dialog/generic-response.js');

module.exports = (payload, callback) => {
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
            
            data.forEach((user) => {
                fields.push({
    				type: 'plain_text',
    				text: `<@${user.username}>`,
    				emoji: true
    			});
            });
            
            
            genericResponse([{
            		type: 'section',
            		fields: fields
            	}], payload.response_url, callback);
        }
    );
}