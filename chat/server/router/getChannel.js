var fs = require('fs');

const FILE = './data/channels.json';

module.exports = function (req, res) {
    if (req.params.gid == "-") { // Request to Get user data
        let cArray = [];
        fs.readFile(FILE, 'utf8', function (err, data) {
            //open the file of user list
            if (err) throw err;
            cArray = JSON.parse(data);

            // send response to user
            res.send(cArray);
        });
    }
}