export class User {
    username: string;
    email: string;
    role: string;
    pwd: string;
    avatar: string;

    constructor(username: string, email: string, role: string, pwd: string, avatar: string = "user.png") {
        this.username = username;
        this.email = email;
        this.role = role;
        this.pwd = pwd;
        this.avatar = avatar;
    }
}
