export class UserGET {
    constructor(email, username, fullName, bio, profilePictureId) {
        this.Email = email;
        this.Username = username;
        this.FullName = fullName;
        this.Bio = bio;
        this.ProfilePictureId = profilePictureId;
    }

    static InstanceFromObject(obj) {
        return new UserGET(obj.Email, obj.Username, obj.FullName, obj.Bio, obj.ProfilePictureId);
    }
}

export class UserPUT {
    constructor(fullName, bio) {
        this.FullName = fullName;
        this.Bio = bio;
    }

    static InstanceFromObject(obj) {
        return new UserPUT(obj.FullName, obj.Bio);
    }
}