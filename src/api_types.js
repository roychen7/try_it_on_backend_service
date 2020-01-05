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

class UpdateUserBody {
    constructor(action, value) {
        this.action = action;
        this.value = value;
    }
}

class GetUserResult {
    constructor(user_id, first_name, last_name, username, email, password) {
        this.user_id = user_id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.username = username;
        this.email = email;
        this.password = password;

    }
}

class GetUsersListResult {
    constructor(size, users) {
        this.size = size;
        this.users = users;
    }
}

module.exports = {
    CreateUserBody,
    LoginUserBody,
    UpdateUserBody,
    GetUserResult,
    GetUsersListResult
};