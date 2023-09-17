import { db } from '../configs/db.config.js';

export async function getAll() {
    const result = await db
        .collection('projects')
        .find()
        .toArray();

    return result;
}