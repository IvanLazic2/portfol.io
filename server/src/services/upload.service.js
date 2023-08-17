import { ObjectId } from "mongodb";
import { db } from "../configs/db.config.js"
import { UploadDL } from "../models/upload/Upload.model.js";

export async function create(projectId, file) {
    const uploadDL = new UploadDL(projectId, file.originalname, file.size, Date.now(), file.mimetype);

    const result = await db
        .collection('uploads')
        .insertOne(uploadDL);

    return result;
}

export async function getAll(projectId) {
    const result = await db
        .collection('uploads')
        .find({ ProjectId: projectId })
        .toArray();

    return result;
}

// TODO: async function get(id)
export async function get(id) {
    const result = await db
        .collection('uploads')
        .findOne({ _id: ObjectId(id) });

    return result;
}

export async function remove(id) {
    const result = await db
        .collection('uploads')
        .deleteOne({ _id: ObjectId(id) });

    return result;
}

export async function removeAll(projectId) {
    const result = await db
        .collection('uploads')
        .deleteMany({ ProjectId: projectId });

    return result;
}