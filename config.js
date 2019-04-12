'use strict';

module.exports = {
    commands: {
        help: 'commands/help.js',
        review: 'commands/review.js',
        registry: 'commands/registry.js',
    },
    dialogSubmissions: {
        add_user: 'controllers/dialog/add-user.js',
        remove_user: 'controllers/dialog/remove-user.js',
        github_review: 'controllers/dialog/github-review.js',
        fisheye_review: 'controllers/dialog/fisheye-review.js',
        user_info: 'controllers/dialog/user-info.js',
    },
    blockActions: {
        add_user: 'dialogs/add-user.js',
        remove_user: 'dialogs/remove-user.js',
        github_review: 'dialogs/github-review.js',
        fisheye_review: 'dialogs/fisheye-review.js',
        user_info: 'dialogs/user-info.js',
        list_users: 'controllers/block/list-users.js',
    },
    jiraUsername: process.env.jiraUsername,
    jiraPassword: process.env.jiraPassword,
    githubToken: process.env.githubToken,
    kmsEncryptedToken: process.env.kmsEncryptedToken,
    slackOAuthToken: process.env.oAuthToken,
    dynamoTableName: process.env.tableName
};