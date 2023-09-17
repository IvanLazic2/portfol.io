import mongodb, { GridFSBucket, ObjectId } from "mongodb";

const url = "mongodb://127.0.0.1:27017";
const client = new mongodb.MongoClient(url);
const dbName = "portfolio";

const connectToDB = async () => {
    try {
        await client.connect();
        console.log("MongoDB connected");
    }
    catch (exc) {
        console.log(exc);
    }

    const db = client.db(dbName);
    const bucket = new mongodb.GridFSBucket(db);

    return { db, bucket };
}

export const { db, bucket } = await connectToDB();