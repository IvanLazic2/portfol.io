import { ObjectId } from "mongodb";
import { db } from '../configs/db.config.js';

export async function get(res, id) {
    db
        .collection("projects")
        .findOne({ "_id": ObjectId(id) })
        .then(dbProject => {
            if (!dbProject)
                res.status(400).json({ message: "Cannot find project." });

            const project = ProjectGET.InstanceFromObject(dbProject);

            if (!project) {
                console.error("Error in project service: get: ", "Cannot cast dbProject");
                res.status(500).json({ message: "Something went wrong." })
            }

            res.status(200).json({ project: project });
        })
        .catch(error => {
            console.error("Error in project service: get: ", error);
            res.status(500).json({ message: "Failed getting project." });
        });
}

export async function create(res, project) {
    db
        .collection('projects')
        .insertOne(project)
        .then(result => {
            res.status(200).json({ message: "Project created.", projectId: result.insertedId.toString() });
        })
        .catch(error => {
            console.error("Error in project service: create: ", error);
            res.status(500).json({ message: "Failed creating project." });
        });
}

export async function update(res, id, project) {
    /* temp */ res.status(200).json({ message: "Project update called." });
}

export async function remove(res, id) {
    /* temp */ res.status(200).json({ message: "Project remove called." });
}