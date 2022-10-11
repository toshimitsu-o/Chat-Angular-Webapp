let assert = require('assert');
//let app = require('./server.js');
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
let expect = chai.expect;
chai.use(chaiHttp);

const SERVER = "http://localhost:3000";

let newUser = { username: "testtest30", email: "email@test.com", role: "user", pwd: "pass", avatar: "image.png" };
let noUser = { username: "test-non-exist", email: "email@test.com", role: "user", pwd: "wrongpass", avatar: "image.png" };

let newChan = { id: "testcha1", name: "testcha", gid: "g1" };
let noChan = { id: "no-testcha", name: "no testcha", gid: "g1" };

let newGroup = { id: "testgroup", name: "test group" };

let newGroupMem = { username: "testmember4", gid: "g1" };
let newChanMem = { username: "testmember5", cid: "c1" };

describe('Server API test', () => {

    // Messages

    describe('Get chat messages /messages/:cid/:limit', () => {
        it('should return an array of messages with the limit', (done) => {
            chai.request(SERVER)
                .get('/messages/c1/3')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.should.have.lengthOf(3);
                    done();
                });
        });
    });

    // Uploader

    describe('Post file upload /api/upload', () => {
        it('should return error 400 with wrong data', (done) => {
            let file = "wrong.png"
            chai.request(SERVER)
                .post('/api/upload').set('content-type', 'application/json')
                .send(file)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
    });

    // Groups

    describe('Get groups /group', () => {
        it('should return an array of all items (more than 3)', (done) => {
            chai.request(SERVER)
                .get('/group')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.should.have.lengthOf.above(3);
                    done();
                });

        });
        it('should return an array with items that contains properties of group', (done) => {
            chai.request(SERVER)
                .get('/group')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.should.have.nested.property('[0].id');
                    res.body.should.have.nested.property('[0].name');
                    done();
                });

        });
    });

    describe('Add a group /group', () => {
        it('should insert a new item with no error', (done) => {
            chai.request(SERVER)
                .post('/group').set('content-type', 'application/json')
                .send(newGroup)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('err').with.equal(null);
                    done();
                });
        });
    });

    describe('Remove an item /group/:id', () => {
        it('should remove the item and return all items', (done) => {
            chai.request(SERVER)
                .delete('/group/'+ newGroup.id)
                .end((err, res) => {
                    res.body.should.be.a('array');
                    res.body.should.have.lengthOf.above(3);
                    done();
                });
        });
    });

    describe('Get group members /member/group', () => {
        it('should return an array of all items (more than 3)', (done) => {
            chai.request(SERVER)
                .get('/member/group')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.should.have.lengthOf.above(3);
                    done();
                });

        });
        it('should return an array with items that contains properties of member', (done) => {
            chai.request(SERVER)
                .get('/member/group')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.should.have.nested.property('[0].username');
                    res.body.should.have.nested.property('[0].gid');
                    done();
                });

        });
    });

    describe('Add a member /member/group', () => {
        it('should insert a new item with no error', (done) => {
            chai.request(SERVER)
                .post('/member/group').set('content-type', 'application/json')
                .send(newGroupMem)
                .end((err, res) => {
                    res.body.should.be.a('array');
                    res.body.should.have.lengthOf.above(3);
                    done();
                });
        });
    });

    describe('Remove an item /member/group/:username/:gid', () => {
        it('should remove the item and return all items', (done) => {
            chai.request(SERVER)
                .delete('/member/group/'+ newGroupMem.username + '/' + newGroupMem.gid)
                .end((err, res) => {
                    //console.log(res.body)
                    res.body.should.be.a('array');
                    res.body.should.have.lengthOf.above(3);
                    done();
                });
        });
    });


    // Chnnels

    describe('Get channels /channel', () => {
        it('should return an array of all items (more than 3)', (done) => {
            chai.request(SERVER)
                .get('/channel')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.should.have.lengthOf.above(3);
                    done();
                });

        });
        it('should return an array with items that contains properties of channel', (done) => {
            chai.request(SERVER)
                .get('/channel')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.should.have.nested.property('[0].id');
                    res.body.should.have.nested.property('[0].name');
                    res.body.should.have.nested.property('[0].gid');
                    done();
                });

        });
    });

    describe('Add a channel /channel', () => {
        it('should insert a new item with no error', (done) => {
            chai.request(SERVER)
                .post('/channel').set('content-type', 'application/json')
                .send(newChan)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('err').with.equal(null);
                    done();
                });
        });
        it('should not insert a duplicate item', (done) => {
            chai.request(SERVER)
                .post('/channel').set('content-type', 'application/json')
                .send(newChan)
                .end((err, res) => {
                    res.body.should.have.property('err').with.equal("duplicate item");
                    done();
                });
        });
    });

    describe('Remove an item /channel/:id', () => {
        it('should remove the item and return all items', (done) => {
            chai.request(SERVER)
                .delete('/channel/'+ newChan.id)
                .end((err, res) => {
                    res.body.should.be.a('array');
                    res.body.should.have.lengthOf.above(3);
                    done();
                });
        });
        it('should not remove an item that doesn not exist', (done) => {
            chai.request(SERVER)
                .delete('/channel/'+ noChan.id)
                .end((err, res) => {
                    res.body.should.not.be.a('array');
                    done();
                });
        });
    });

    describe('Get channel members /member/channel', () => {
        it('should return an array of all items (more than 3)', (done) => {
            chai.request(SERVER)
                .get('/member/channel')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.should.have.lengthOf.above(3);
                    done();
                });

        });
        it('should return an array with items that contains properties of member', (done) => {
            chai.request(SERVER)
                .get('/member/channel')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.should.have.nested.property('[0].username');
                    res.body.should.have.nested.property('[0].cid');
                    done();
                });

        });
    });

    describe('Add a member /member/channel', () => {
        it('should insert a new item with no error', (done) => {
            chai.request(SERVER)
                .post('/member/channel').set('content-type', 'application/json')
                .send(newChanMem)
                .end((err, res) => {
                    res.body.should.be.a('array');
                    res.body.should.have.lengthOf.above(3);
                    done();
                });
        });
    });

    describe('Remove an item /member/channel/:username/:cid', () => {
        it('should remove the item and return all items', (done) => {
            chai.request(SERVER)
                .delete('/member/channel/'+ newChanMem.username + '/' + newChanMem.cid)
                .end((err, res) => {
                    //console.log(res.body)
                    res.body.should.be.a('array');
                    res.body.should.have.lengthOf.above(3);
                    done();
                });
        });
    });

    // Users

    describe('Get users /admin/users', () => {
        it('should return an array of all users (more than 3)', (done) => {
            chai.request(SERVER)
                .get('/admin/users')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.should.have.lengthOf.above(3);
                    done();
                });

        });
        it('should return an array with items that contains properties of user', (done) => {
            chai.request(SERVER)
                .get('/admin/users')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.should.have.nested.property('[0].username');
                    res.body.should.have.nested.property('[0].email');
                    res.body.should.have.nested.property('[0].role');
                    done();
                });

        });
    });

    describe('Add a user /admin/users', () => {
        it('should insert a new user with no error', (done) => {
            chai.request(SERVER)
                .post('/admin/users').set('content-type', 'application/json')
                .send(newUser)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('err').with.equal(null);
                    done();
                });
        });
        it('should not insert a duplicate user', (done) => {
            chai.request(SERVER)
                .post('/admin/users').set('content-type', 'application/json')
                .send(newUser)
                .end((err, res) => {
                    res.body.should.have.property('err').with.equal("duplicate item");
                    done();
                });
        });
    });

    describe('Update a user /admin/users', () => {
        it('should update the user', (done) => {
            let user = Object.assign({}, newUser);
            user.email = "email@test.com.au";
            chai.request(SERVER)
                .put('/admin/users').set('content-type', 'application/json')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.should.have.lengthOf.above(3);
                    done();
                }, 5000); // Extend the timeout
        });
        it('should not update a user that doesn not exist', (done) => {
            chai.request(SERVER)
                .put('/admin/users').set('content-type', 'application/json')
                .send(noUser)
                .end((err, res) => {
                    res.body.should.have.property('err').with.equal("user does not exist");
                    done();
                });
        });
    });

    describe('Login /auth/login', () => {
        it('should get valid: true with a right user details', (done) => {
            chai.request(SERVER)
                .post('/auth/login').set('content-type', 'application/json')
                .send(newUser)
                .end((err, res) => {
                    //console.log(res.body)
                    res.body.should.have.property('valid').with.equal(true);
                    done();
                });

        });
        it('should return valide:false with a wrong user details', (done) => {
            chai.request(SERVER)
                .post('/auth/login').set('content-type', 'application/json')
                .send(noUser)
                .end((err, res) => {
                    res.body.should.have.property('valid').with.equal(false);
                    done();
                });

        });
    });

    describe('Update user details /auth/update', () => {
        it('should update the details when user exists and return user data', (done) => {
            let user = Object.assign({}, newUser);
            user.email = "email@testtest.com.au";
            chai.request(SERVER)
                .post('/auth/update').set('content-type', 'application/json')
                .send(user)
                .end((err, res) => {
                    //console.log(res.body)
                    res.should.have.status(200);
                    res.body.should.have.property('username');
                    res.body.should.have.property('email');
                    res.body.should.have.property('role');
                    done();
                });
        });
        it('should not update a user that doesn not exist', (done) => {
            chai.request(SERVER)
                .post('/auth/update').set('content-type', 'application/json')
                .send(noUser)
                .end((err, res) => {
                    res.body.should.have.property('err').with.equal("user does not exist");
                    done();
                });
        });
    });

    describe('Remove a user /admin/users/:username/:by', () => {
        it('should remove the user and return all users', (done) => {
            chai.request(SERVER)
                .delete('/admin/users/'+ newUser.username + '/sadmin')
                .end((err, res) => {
                    res.body.should.be.a('array');
                    res.body.should.have.lengthOf.above(3);
                    done();
                });
        });
        it('should not remove a user that doesn not exist', (done) => {
            chai.request(SERVER)
                .delete('/admin/users/'+ noUser.username + '/sadmin')
                .end((err, res) => {
                    res.body.should.not.be.a('array');
                    done();
                });
        });
    });

});