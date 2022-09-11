var fs = require('fs');

const FILE = './data/channels.json';

module.exports = function (req, res) {
        // save the file of user list
        let cArray = JSON.stringify(req.body);
        fs.writeFile(FILE, cArray, 'utf-8', function(err) {
            if (err) throw err;
            // send response to user
            res.send(cArray);
        });
}