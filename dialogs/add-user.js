'use strict';
const slack = require('../slack-client.js');

module.exports = (params, callback) => {
    const options = {
      trigger_id: params.trigger_id,
      dialog: {
        callback_id: 'add_user',
        title: "Add/edit user",
        submit_label: "Add",
        notify_on_cancel: false,
        //"state": "",
        elements: [
            {
                label: 'Slack user',
                name: 'slack_username',
                type: 'select',
                data_source: 'users'
            },
            {
                type: 'text',
                label: 'Github username',
                name: 'github_username',
                value: params.user_name
            },
            {
                type: 'text',
                label: 'Onelogin username',
                name: 'onelogin_username',
                value: params.user_name
            },
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