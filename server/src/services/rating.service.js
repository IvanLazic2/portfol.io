import { db } from '../configs/db.config.js';

import { RatingCreateOrUpdate } from "../models/rating/Rating.models.js";

export async function createOrUpdateRating(projectId, userId, rating) {
    const ratingCreateOrUpdate = RatingCreateOrUpdate.InstanceFromObject(projectId, userId, rating);

    const result = await db
        .collection('ratings')
        .updateOne(
            { ProjectId: projectId, UserId: userId },
            { $set: ratingCreateOrUpdate },
            { upsert: true }
        );

    return result;
}

export async function removeProjectRating(projectId, userId) {
    const result = await db
        .collection('ratings')
        .deleteOne({ ProjectId: projectId, UserId: userId });

    return result;
}