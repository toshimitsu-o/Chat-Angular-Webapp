enum Role {
    standard = 'Standard',
    super = 'Super Admin'
}

export class User {
    username: string;
    email: string;
    role: Role;
    valid: boolean;

    constructor(username: string, email: string, role: Role, valid: boolean) {
        this.username = username;
        this.email = email;
        this.role = role;
        this.valid = valid;
    }
}
