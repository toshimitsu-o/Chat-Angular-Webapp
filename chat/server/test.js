let assert = require('assert');
//let app = require('./server.js');
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
let expect = chai.expect;
chai.use(chaiHttp);

const SERVER = "http://localhost:3000";

let newUser = { username: "testtest30", email:  "email@test.com", role: "user", pwd: "pass", avatar: "image.png" };
let noUser = { username: "test-non-exist", email:  "email@test.com", role: "user", pwd: "wrongpass", avatar: "image.png" };

describe('Server API test', () => {
    // beforeEach(()=>{
    //     dbserver();
    //     const collection = db.collection('products');
    //     collection.drop();
    //     db.products.insertOne({id: 1, name: "Product A", description: "This is a product for cleaning.", price: 45.5, units: 23});
    // });

    describe('Get users /admin/users', () => {
        it('should return an array of all products (more than 3)', (done) => {
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
        it('should not insert a duplicate product', (done) => {
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
                .post('/admin/users/'+ noUser.username + '/sadmin')
                .end((err, res) => {
                    res.body.should.not.be.a('array');
                    done();
                });
        });
    });

});