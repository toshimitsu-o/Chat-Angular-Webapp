var fs = require('fs');

const FILE = './data/channelMembers.json';

module.exports = function (req, res) {
        let cArray = [];
        fs.readFile(FILE, 'utf8', function (err, data) {
            //open the file of user list
            if (err) throw err;
            cArray = JSON.parse(data);

            // send response to user
            res.send(cArray);
        });
}