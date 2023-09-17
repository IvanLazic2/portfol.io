import { ObjectId } from 'mongodb';
import { db } from '../configs/db.config.js';
import { UserDL } from '../models/user/User.models.js';

export async function register(username, email, salt, hash) {
    const userDL = new UserDL(username, email, salt, hash);

    const result = await db
        .collection('users')
        .insertOne(userDL);

    return result;
}

export async function getById(id) {
    if (!id) return null;

    const result = await db
        .collection('users')
        .findOne({ _id: ObjectId(id) });

    return result;
}

export async function getByUsername(username) {
    if (!username) return null;

    const result = await db
        .collection('users')
        .findOne({ Username: username });

    return result;
}

export async function getByEmail(email) {
    if (!email) return null;

    const result = await db
        .collection('users')
        .findOne({ Email: email });

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

export async function changeUsername(id, username) {
    const result = await db
        .collection('users')
        .updateOne(
            { _id: ObjectId(id) },
            { $set: { Username: username } }
        );
        
    return result;
}

export async function changeEmail(id, email) {
    const result = await db
        .collection('users')
        .updateOne(
            { _id: ObjectId(id) },
            { $set: { Email: email } }
        );
        
    return result;
}

export async function changeProfilePicture(id, profilePictureId) {
    const result = await db
        .collection('users')
        .updateOne(
            { _id: ObjectId(id) },
            { $set: { ProfilePictureId: profilePictureId } }
        );

    return result;
}

export async function removeProfilePicture(id) {
    const result = await db
        .collection('users')
        .updateOne(
            { _id: ObjectId(id) },
            { $unset: { ProfilePictureId: 1 } }
        );

    return result;
}

export async function setSelfLoveAcheavement(id) {
    const result = await db
        .collection('users')
        .updateOne(
            { _id: ObjectId(id) },
            { $set: { SelfLoveAcheavement: true }}
        );

    return result;
}

export async function remove(id) {
    const result = await db
        .collection('users')
        .deleteOne({ _id: ObjectId(id) });

    return result;
}