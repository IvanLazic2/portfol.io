import { ObjectId } from "mongodb";
import { db } from '../configs/db.config.js';

import { ProjectCreate, ProjectUpdate } from "../models/project/Project.models.js";

export async function get(id) {
    const result = await db
        .collection('projects')
        .findOne({ '_id': ObjectId(id) });

    return result;
}

export async function getAllUserProjects(username) {
    const userId = (await db
        .collection('users')
        .findOne({ 'Username': username }))._id.toString();

    const result = await db
        .collection('projects')
        .find({ 'UserId': userId })
        .toArray();
    return result;
}

export async function create(userId, project) {
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

export async function incrementLike(id) {
    const result = await db
        .collection('projects')
        .updateOne(
            { _id: ObjectId(id) },
            { $inc: { Likes: 1 } }
        );

    return result;
}

export async function decrementLike(id) {
    const result = await db
        .collection('projects')
        .updateOne(
            { _id: ObjectId(id) },
            { $inc: { Likes: -1 } }
        );

    return result;
}