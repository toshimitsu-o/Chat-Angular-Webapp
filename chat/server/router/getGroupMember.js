var fs = require('fs');

const FILE = './data/groupMembers.json';

module.exports = function (req, res) {
        let gArray = [];
        fs.readFile(FILE, 'utf8', function (err, data) {
            //open the file of user list
            if (err) throw err;
            gArray = JSON.parse(data);

            // send response to user
            res.send(gArray);
        });
}