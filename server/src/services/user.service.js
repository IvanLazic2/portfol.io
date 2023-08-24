import { ObjectId } from 'mongodb';
import { db } from '../configs/db.config.js';

export async function get(id) {
    const result = await db
        .collection('users')
        .findOne({ _id: ObjectId(id) });

    return result;
}

export async function update(id, user) {
    const result = await db
        .collection('users')
        .updateOne(
            { _id: ObjectId(id) },
            { $set: user }
        );

    return result;
}

export async function ChangeUsername(id, username) {
    const result = await db
        .collection('users')
        .updateOne(
            { _id: ObjectId(id) },
            { $set: { Username: username } }
        );
        
    return result;
}

export async function ChangeEmail(id, email) {
    const result = await db
        .collection('users')
        .updateOne(
            { _id: ObjectId(id) },
            { $set: { Email: email } }
        );
        
    return result;
}