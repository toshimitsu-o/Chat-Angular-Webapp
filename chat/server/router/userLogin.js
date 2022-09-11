var fs = require('fs');

module.exports = function(req, res) {
    var u = req.body.username;
    var p = req.body.pwd;
    c = u + p;
    console.log(c);
    fs.readFile('./data/users.json', 'utf8', function(err, data) {
        // the above path is with respect to where we run server.js
        if (err) throw err;
        let userArray = JSON.parse(data);
        console.log(userArray);
        let i = userArray.findIndex(user =>
            ((user.username == u) && (user.pwd == p)));
        if (i == -1) {
            res.send({
                "valid": false
            });
        } else {
            fs.readFile('./data/extendedUsers.json', 'utf8', function(err, data) {
                // the above path is with respect to where we run server.js
                if (err) throw err;
                let extendedUserArray = JSON.parse(data);

                let i = extendedUserArray.findIndex(user =>
                    ((user.username == u)));
                let userData = extendedUserArray[i];
                userData["valid"] = true;
                console.log(userData);
                res.send(userData);
            })
        }
    });

}