class CreateUserBody {
    constructor(first_name, last_name, username, email, password) {
        this.first_name = first_name;
        this.last_name = last_name;
        this.username = username;
        this.email = email;
        this.password = password;
    }
}

class LoginUserBody {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
}

module.exports = {
    CreateUserBody,
    LoginUserBody
};