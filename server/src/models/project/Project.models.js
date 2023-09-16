export class ProjectPOST {
    constructor(name, concept, material, width, height, depth) {
        this.Name = name;
        this.Concept = concept;
        this.Material = material;
        this.Width = width;
        this.Height = height;
        this.Depth = depth;
    }

    static InstanceFromObject(obj) {
        return new ProjectPOST(obj.Name, obj.Concept, obj.Material, obj.Width, obj.Height, obj.Depth);
    }

    Validate() {
        if (!this.Name)
            return "Name is required.";
    }
}

export class ProjectGET {
    constructor(id, name, concept, material, width, height, depth, dateCreated, userId, highlightedUploadId) {
        this.Id = id;
        this.Name = name;
        this.Concept = concept;
        this.Material = material;
        this.Width = width;
        this.Height = height;
        this.Depth = depth;
        this.DateCreated = dateCreated;
        this.UserId = userId;
        this.HighlightedUploadId = highlightedUploadId;
    }

    static InstanceFromObject(obj) {
        return new ProjectGET(obj._id, obj.Name, obj.Concept, obj.Material, obj.Width, obj.Height, obj.Depth, obj.DateCreated, obj.UserId, obj.HighlightedUploadId);
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
    constructor(userId, name, concept, material, width, height, depth) {
        this.UserId = userId;
        this.Name = name;
        this.Concept = concept;
        this.Material = material;
        this.Width = width;
        this.Height = height;
        this.Depth = depth;

        this.DateCreated = Date.now();
        this.Likes = 0;
    }

    static InstanceFromObject(userId, obj) {
        return new ProjectCreate(userId, obj.Name, obj.Concept, obj.Material, obj.Width, obj.Height, obj.Depth);
    }
}

export class ProjectUpdate {
    constructor(name, concept, material, width, height, depth) {
        this.Name = name;
        this.Concept = concept;
        this.Material = material;
        this.Width = width;
        this.Height = height;
        this.Depth = depth;
    }

    static InstanceFromObject(obj) {
        return new ProjectUpdate(obj.Name, obj.Concept, obj.Material, obj.Width, obj.Height, obj.Depth);
    }
}