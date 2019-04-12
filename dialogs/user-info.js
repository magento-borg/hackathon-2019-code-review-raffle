'use strict';
const slack = require('../slack-client.js');

module.exports = (params, callback) => {
    const options = {
      trigger_id: params.trigger_id,
      dialog: {
        callback_id: 'user_info',
        title: "User Info",
        submit_label: "Submit",
        notify_on_cancel: false,
        //"state": "",
        elements: [
            {
                label: 'Slack user',
                name: 'slack_username',
                type: 'select',
                data_source: 'users'
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