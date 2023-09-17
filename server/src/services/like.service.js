import { ObjectId } from "mongodb";
import { db } from '../configs/db.config.js';

export async function likeProject(userId, projectId) {
    const result = await db
        .collection('likes')
        .insertOne({ userId: userId, projectId: projectId });

    return result;
}

export async function unlikeProject(userId, projectId) {
    const result = await db
        .collection('likes')
        .deleteOne({ userId: userId, projectId: projectId });

    return result;
}

export async function isProjectLiked(userId, projectId) {
    const result = await db
        .collection('likes')
        .findOne({ userId: userId, projectId: projectId });

    return (result) ? true : false;
}

export async function getProjectLikeCount(projectId) {
    const result = await db
        .collection('projects')
        .findOne({ _id: ObjectId(projectId) });

    return result.Likes;
}

export async function removeUserLikes(userId) {
    const result = await db
        .collection('likes')
        .deleteMany({ userId: userId });

    return result;
}