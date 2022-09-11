var fs = require('fs');

const FILE = './data/groups.json';

module.exports = function (req, res) {
        // save the file of user list
        let gArray = JSON.stringify(req.body);
        fs.writeFile(FILE, gArray, 'utf-8', function(err) {
            if (err) throw err;
            // send response to user
            res.send(gArray);
        });
}