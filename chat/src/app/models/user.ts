export class User {
    username: string;
    email: string;
    role: string;
    pwd: string;

    constructor(username: string, email: string, role: string, pwd: string) {
        this.username = username;
        this.email = email;
        this.role = role;
        this.pwd = pwd;
    }
}
