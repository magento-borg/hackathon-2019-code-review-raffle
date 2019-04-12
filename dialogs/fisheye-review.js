'use strict';
const slack = require('../slack-client.js');

module.exports = (params, callback) => {
    const options = {
      trigger_id: params.trigger_id,
      dialog: {
        callback_id: 'fisheye_review',
        title: "Fisheye Review",
        submit_label: "Assign",
        notify_on_cancel: false,
        //"state": "",
        elements: [
            {
                type: 'text',
                label: 'Fishey Review ID',
                name: 'review_id',
                placeholder: 'CR-MAGETWO-12345'
            }
        ]
      }
    };
    
    slack.request('POST', '/api/dialog.open', options, (error, res) => {
        if (error) {
            callback(error);
            return;
        }
        const response = JSON.parse(res);
        
        if (response.ok) {
            callback(null, '');
            return;
        }
        
        callback('Something went wrong while opening the dialog. ' + JSON.stringify(response));
    });
};