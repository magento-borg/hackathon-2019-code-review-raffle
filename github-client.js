let http = require('https');
const githubToken = process.env.githubToken;

exports.addGithubReviewer = (githubUsername, org, repo, pr, callback) => {
    var postData = {
        reviewers: [
            githubUsername
        ],
        team_reviewers: []
    };

    const json = JSON.stringify(postData);
    var options = {
        host: 'api.github.com',
        path: `/repos/${org}/${repo}/pulls/${pr}/requested_reviewers`,
        port: 443,
        method: 'POST',
        headers: {
            'User-Agent': 'Raffle-Bot',
            'Authorization': `token ${githubToken}`,
            'Content-Length': json.length,
        }
    };
    
    let data = '';
    const req = http.request(options, (res) => {
        res.on('data', (d) => {
            data += d;
        });
        res.on('end', () => {
            const response = JSON.parse(data);
            if (response.message) {
                callback(response.message);
                return;
            }
            callback(null, response);
        });
    });
    
    req.on('error', (error) => {
        callback(error);
    });
    
    req.write(json);
    req.end();  
};

exports.getPrInfo = (org, repo, pr, callback) => {
    var options = {
        host: 'api.github.com',
        path: `/repos/${org}/${repo}/pulls/${pr}`,
        port: 443,
        method: 'GET',
        headers: {
            'User-Agent': 'Raffle-Bot',
            'Authorization': `token ${githubToken}`
        }
    };
    
    let data = '';
    const req = http.request(options, (res) => {
        res.on('data', (d) => {
            data += d;
        });
        res.on('end', () => {
            const response = JSON.parse(data);
            if (response.message) {
                callback(response.message);
                return;
            }
            callback(null, response);
        });
    });
    
    req.on('error', (error) => {
        callback(error);
    });
    
    req.write('');
    req.end();  
};