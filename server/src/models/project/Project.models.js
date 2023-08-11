export class ProjectPOST {
    constructor(name, concept) {
        this.Name = name;
        this.Concept = concept;
        //this.TehnicalInfo = tehnicalInfo;
    }

    static InstanceFromObject(obj) {
        return new ProjectPOST(obj.Name, obj.Concept);
    }

    Validate() {
        if (!this.Name)
            return "Name is required.";
    }
}

export class ProjectDL {
    constructor(userId, name, concept) {
        this.UserId = userId;
        this.Name = name;
        this.Concept = concept;
        //this.TehnicalInfo = tehnicalInfo;
    }

    static InstanceFromObject(userId, obj) {
        return new ProjectDL(userId, obj.Name, obj.Concept);
    }
}