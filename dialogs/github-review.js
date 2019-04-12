'use strict';
const slack = require('../slack-client.js');

module.exports = (params, callback) => {
    const options = {
      trigger_id: params.trigger_id,
      dialog: {
        callback_id: 'github_review',
        title: "Github Review",
        submit_label: "Assign",
        notify_on_cancel: false,
        //"state": "",
        elements: [
            {
                type: 'text',
                label: 'Github organization',
                name: 'org',
                placeholder: 'magento-borg'
            },
            {
                type: 'text',
                label: 'Repo',
                name: 'repo',
                placeholder: 'magento2ce'
            },
            {
                type: 'text',
                label: 'PR Number',
                name: 'pr',
                subtype: 'number',
                placeholder: '1234'
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