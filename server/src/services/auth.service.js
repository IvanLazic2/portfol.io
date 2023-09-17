import { UserDL } from '../models/user/User.models.js';

export async function register(username, email, salt, hash) {
    const userDL = new UserDL(username, email, salt, hash);

    const result = await db
        .collection('users')
        .insertOne(userDL);
    
    

    return result;
}