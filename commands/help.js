'use strict';
const genericResponse = require('controllers/dialog/generic-response.js');

module.exports = (params, callback, isError) => {
    const message = `Usage: \`${params.command} <registry|review|help>\``;
        
    if (isError) {
        callback(message);

        return;
    }
    
    genericResponse(getMenu(message), params.response_url, callback);
};


function getMenu(message) {
    return [
    	{
    		"type": "section",
    		"text": {
    			"type": "mrkdwn",
    			"text": message
    		}
    	},
    	{
    		"type": "divider"
    	},
    	{
    		"type": "section",
    		"text": {
    			"type": "mrkdwn",
    			"text": "*Review*"
    		}
    	},
    	{
    		"type": "section",
    		"text": {
    			"type": "mrkdwn",
    			"text": "Randomly select a user from the channel raffle pool and assign them to a GitHub review"
    		},
    		"accessory": {
    			"type": "button",
    			"text": {
    				"type": "plain_text",
    				"text": "Github Review",
    				"emoji": true
    			},
    			"value": "github_review"
    		}
    	},{
    		"type": "section",
    		"text": {
    			"type": "mrkdwn",
    			"text": "Randomly select a user from the channel raffle pool and assign them to a Fisheye review"
    		},
    		"accessory": {
    			"type": "button",
    			"text": {
    				"type": "plain_text",
    				"text": "Fisheye Review",
    				"emoji": true
    			},
    			"value": "fisheye_review"
    		}
    	},
        {
    		"type": "divider"
    	},
    	{
    		"type": "section",
    		"text": {
    			"type": "mrkdwn",
    			"text": "*Registry*"
    		}
    	},
    	{
    		"type": "section",
    		"text": {
    			"type": "mrkdwn",
    			"text": "Add a user to the raffle pool for this channel"
    		},
    		"accessory": {
    			"type": "button",
    			"text": {
    				"type": "plain_text",
    				"text": "Add User",
    				"emoji": true
    			},
    			"value": "add_user"
    		}
    	},{
    		"type": "section",
    		"text": {
    			"type": "mrkdwn",
    			"text": "Remove a user from the raffle pool for this channel"
    		},
    		"accessory": {
    			"type": "button",
    			"text": {
    				"type": "plain_text",
    				"text": "Remove User",
    				"emoji": true
    			},
    			"value": "remove_user"
    		}
    	},{
    		"type": "section",
    		"text": {
    			"type": "mrkdwn",
    			"text": "List users in the raffle pool for this channel"
    		},
    		"accessory": {
    			"type": "button",
    			"text": {
    				"type": "plain_text",
    				"text": "List Users",
    				"emoji": true
    			},
    			"value": "list_users"
    		}
    	},
        {
    		"type": "section",
    		"text": {
    			"type": "mrkdwn",
    			"text": "Get the configuration of a user in this channel"
    		},
    		"accessory": {
    			"type": "button",
    			"text": {
    				"type": "plain_text",
    				"text": "More Info",
    				"emoji": true
    			},
    			"value": "user_info"
    		}
    	}
    ];
}