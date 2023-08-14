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

export class ProjectGET {
    constructor(id, name, concept) {
        this.Id = id;
        this.Name = name;
        this.Concept = concept;
        //this.TehnicalInfo = tehnicalInfo;
    }

    static InstanceFromObject(obj) {
        return new ProjectGET(obj._id, obj.Name, obj.Concept);
    }

    static InstanceFromObjectArray(objArr) {
        const result = [];

        objArr.forEach(function (el) {
            result.push(ProjectGET.InstanceFromObject(el));
        });

        return result;
    }
}





// DATA LAYER

export class ProjectCreate {
    constructor(userId, name, concept) {
        this.UserId = userId;
        this.Name = name;
        this.Concept = concept;
        //this.TehnicalInfo = tehnicalInfo;
    }

    static InstanceFromObject(userId, obj) {
        return new ProjectCreate(userId, obj.Name, obj.Concept);
    }
}

export class ProjectUpdate {
    constructor(name, concept) {
        this.Name = name;
        this.Concept = concept;
        //this.TehnicalInfo = tehnicalInfo;
    }

    static InstanceFromObject(obj) {
        return new ProjectUpdate(obj.Name, obj.Concept);
    }
}