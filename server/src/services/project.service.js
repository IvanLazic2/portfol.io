export async function get(id) {
    
}

export async function create(project) {
    console.log("creating project:", project.Name, project.Concept);
    return { code: 200, message: "Project create success" };
}

export async function update(id, project) {

}

export async function remove(id) {

}