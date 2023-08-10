export class FileDL {
    constructor(name, size, uploadDate, owner) {
        this.Name = name;
        this.Size = size;
        this.UploadDate = uploadDate;
        this.Owner = owner;
    }
}

export class UserDL {
    constructor(username, email, salt, hash) {
        this.Username = username;
        this.Email = email;
        this.Salt = salt;
        this.Hash = hash;
        this.Files = [];
    }
}

/* IN Models */
export class UserSignupPOST {
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

export class UserSigninPOST {
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















export class ImagePOST {
    constructor(image, description) {
        this.Image = image;
        this.Description = description;
    }
}

export class TehnicalInfoPOST {
    constructor(dimensions, material) {
        this.Dimensions = dimensions;
        this.Material = material;
    }
}





/* OUT Models */

export class UserGET {
    constructor(username) {
        this.Username = username;
    }
}

export class UserSigninGET {
    constructor(username, token) {
        this.Username = username;
        this.Token = token;
    }
}