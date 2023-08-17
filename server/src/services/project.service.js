import { ObjectId } from "mongodb";
import { db } from '../configs/db.config.js';

import { ProjectCreate, ProjectUpdate } from "../models/project/Project.models.js";

export async function get(id) {
    const result = await db
        .collection('projects')
        .findOne({ '_id': ObjectId(id) });

    return result;
}

export async function getAll(userId) {
    const result = await db
        .collection('projects')
        .find({ 'UserId': userId })
        .toArray();

    return result;
}

export async function create(res, userId, project) {
    const projectCreate = ProjectCreate.InstanceFromObject(userId, project);

    const result = await db
        .collection('projects')
        .insertOne(projectCreate);

    return result;
}

export async function update(id, project) {
    const projectUpdate = ProjectUpdate.InstanceFromObject(project);

    const result = await db
        .collection('projects')
        .updateOne(
            { _id: ObjectId(id) },
            { $set: projectUpdate }
        );

    return result;
}

export async function remove(id) {
    const result = await db
        .collection('projects')
        .deleteOne({ _id: ObjectId(id) });

    return result;
}