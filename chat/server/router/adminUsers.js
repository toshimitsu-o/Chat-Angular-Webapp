var fs = require('fs');

const FILE = './data/extendedUsers.json';

module.exports = function (req, res) {
    if (req.params.func == "get") { // Request to Get user data

        let uArray = [];
        fs.readFile(FILE, 'utf8', function (err, data) {
            //open the file of user list
            if (err) throw err;
            uArray = JSON.parse(data);

            // send response to user
            res.send(uArray);
        });
    } else if (req.params.func == "create") { // Request to Add new user 

        let userobj = {
            "username": req.body.username,
            "email": req.body.email,
            "role": req.body.role
        }
        let uArray = [];
        fs.readFile(FILE, 'utf8', function (err, data) {
            //open the file of user list
            if (err) throw err;
            uArray = JSON.parse(data);
            // add new user 
            uArray.push(userobj);
            // send response to user
            res.send(uArray);
            // save the file of user list
            let uArrayjson = JSON.stringify(uArray);
            fs.writeFile(FILE, uArrayjson, 'utf-8', function (err) {
                if (err) throw err;
            });
        });
    } else if (req.params.func == "delete") { // Request to Add new user 
        let uArray = [];
        let user = req.params.id;
        fs.readFile(FILE, 'utf8', function (err, data) {
            //open the file of user list
            if (err) throw err;
            uArray = JSON.parse(data);
            if (req.params.id == "all") {
                // Delete all user except the (by) user
                uArray = uArray.filter(u => u.username == req.params.by);
            } else {
                // Delete the user
                uArray = uArray.filter(u => u.username != user);
            }

            // send response to user
            res.send(uArray);
            // save the file of user list
            let uArrayjson = JSON.stringify(uArray);
            fs.writeFile(FILE, uArrayjson, 'utf-8', function (err) {
                if (err) throw err;
            });
        });
    } else if (req.params.func == "update") { // Request to Add new user 
        let userobj = {
            "username": req.body.username,
            "email": req.body.email,
            "role": req.body.role
        }
        let uArray = [];
        let user = req.params.id;
        fs.readFile(FILE, 'utf8', function (err, data) {
            //open the file of user list
            if (err) throw err;
            uArray = JSON.parse(data);
            const target = uArray.find(u => u.username == user);
            target.email = userobj.email;
            target.role = userobj.role;

            // send response to user
            res.send(uArray);
            // save the file of user list
            let uArrayjson = JSON.stringify(uArray);
            fs.writeFile(FILE, uArrayjson, 'utf-8', function (err) {
                if (err) throw err;
            });
        });
    }
}