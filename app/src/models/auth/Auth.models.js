export class RegisterPOST {
    constructor(username, email, password) {
        this.Username = username;
        this.Email = email;
        this.Password = password;
    }

    Validate() {
        if (!this.Username)
            return "Username is required.";

        if (!this.Email)
            return "Email is required.";

        if (!this.Password)
            return "Password is required.";
    }
}

export class LoginPOST {
    constructor(username, password) {
        this.Username = username;
        this.Password = password;
    }

    Validate() {
        if (!this.Username)
            return "Username is required.";

        if (!this.Password)
            return "Password is required.";
    }
}