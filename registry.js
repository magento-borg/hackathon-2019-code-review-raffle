'use strict';

let AWS = require('aws-sdk');
let documentClient = new AWS.DynamoDB.DocumentClient();

exports.getReviewersInChannel = (channelId, callback) => {
    let params = {
            TableName : process.env.tableName,
            FilterExpression: 'begins_with(channel, :channelId)',
            ExpressionAttributeValues: {
                ':channelId': channelId
            }
        };
    documentClient.scan(params, (err, data) => {
        if (err) {
            callback(err, data);
        } else {
            callback(null, data.Items);
        }
    });
};

exports.getReviewerInChannel = (userId, channelId, callback) => {
    let params = {
            TableName : process.env.tableName,
            FilterExpression: 'channel = :channelId',
            ExpressionAttributeValues: {
                ':channelId': channelId + ':' + userId
            }
        };
        
    documentClient.scan(params, (err, data) => {
        if (err) {
            callback(err, data);
        } else if (data.Items.length === 0) {
            callback(`<@${userId}> is not in the channel raffle pool`);
        } else {
            let first;
            data.Items.forEach((item) => {
                first = item;
                return false;
            });
            callback(null, first);
        }
    });
};


exports.addReviewerToChannel = (username, userId, channelId, githubUsername, oneloginUsername, callback) => {
    let params = {
        TableName: process.env.tableName,
		Item: {
			channel: channelId + ':' + userId,
			username:  username,
			user_id:  userId,
			github_username: githubUsername,
			onelogin_username: oneloginUsername
		}
	};
	documentClient.put(params, (err, data) => {
		if (err) {
		    callback(err, data);
		} else {
		    callback(null, data);
		}
	});
};

exports.removeReviewerFromChannel = (userId, channelId, callback) => {
    let params = {
        TableName: process.env.tableName,
        Key: {
            channel: channelId + ':' + userId,
        },
        ConditionExpression: 'user_id = :userId',
        ExpressionAttributeValues: {
            ':userId': userId
        }
    };

    documentClient.delete(params, (err, data) => {
      if (err){
          callback(err);
      } else {
          callback(null, data);
      }
    });
};