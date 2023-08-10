export class ProjectPOST {
    constructor(name, concept) {
        this.Name = name;
        this.Concept = concept;
        //this.TehnicalInfo = tehnicalInfo;
    }

    Validate() {
        if (!this.Name)
            return "Name is required";
    }
}