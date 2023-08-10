// https://github.com/geshan/expressjs-structure/tree/master

import express from "express";
import mongodb, { GridFSBucket, ObjectId } from "mongodb";
import multer from "multer";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import util from "util";
import jwt from "jsonwebtoken";
import { UserDL, UserSignupPOST, UserSigninPOST, UserSigninGET, UserGET, FileDL } from "./models.mjs";

import { router as projectRouter } from './src/routers/project.router.js';
import { router as uploadRouter } from './src/routers/upload.router.js';

const randomBytesAsync = util.promisify(crypto.randomBytes);
const pbkdf2Async = util.promisify(crypto.pbkdf2);

const secret = "4fsd4f6s54f6d5s46";
const __dirname = path.resolve();
const port = 3000;
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });







const connectToDB = async () => {
    const url = "mongodb://127.0.0.1:27017";
    const client = new mongodb.MongoClient(url);
    const dbName = "portfolio";

    try {
        await client.connect();
        console.log("MongoDB connected");
    }
    catch (exc) {
        console.log(exc);
    }

    let db = client.db(dbName);
    let bucket = new mongodb.GridFSBucket(db);

    return { db, bucket };
}

(
    async () => {
        



        const jwtProtection = (req, res, next) => {
            try {
                const token = req.headers["authorization"];

                jwt.verify(token, secret, (err, decodedToken) => {
                    if (err)
                        console.log(token);

                    req.id = decodedToken.id;

                    return;
                });

                next();

            }
            catch (err) {
                return res.status(401).json({ message: "Unauthenticated." });
            }
        }

        async function generateToken(res, id, username, message) {
            const exp = Math.floor(Date.now() / 1000) + 60 * 60;
            jwt.sign({ id, username, exp }, secret, (err, token) => {
                if (err)
                    return res.status(500).json({ message: err });

                const user = new UserSigninGET(username, token);

                return res.status(200).json({ message, user });
            });
        }

        const app = express();

        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        // routers
        app.use('/api/project', projectRouter);
        app.use('/api/upload', uploadRouter);






        let { db, bucket } = await connectToDB();

        //app.use(express.static('../client/dist/client'));











        app.get("/api/test", jwtProtection, (req, res) => {
            res.send("aaa");
        });

        /*app.get('/files', (req, res) => {
            res.sendFile(path.join(__dirname, "../client/dist/client/index.html"));
        });

        app.get('/newfile', (req, res) => {
            res.sendFile(path.join(__dirname, "../client/dist/client/index.html"));
        });

        app.get('/signin', (req, res) => {
            res.sendFile(path.join(__dirname, "../client/dist/client/index.html"));
        });

        app.get('/signup', (req, res) => {
            res.sendFile(path.join(__dirname, "../client/dist/client/index.html"));
        });*/

        app.get("/api/user", jwtProtection, async (req, res) => {
            db
                .collection("users")
                .findOne({ "_id": ObjectId(req.id) })
                .then(dbUser => {
                    if (!dbUser)
                        res.status(400).json({ message: "User does not exist." });

                    const user = new UserGET(dbUser.Username);
                    res.status(200).json({ user });
                })
                .catch(err => {
                    res.status(500).json({ message: err });
                });
        });

        app.get("/api/files", jwtProtection, async (req, res) => {
            const files = await db.collection("files").find({ "Owner": ObjectId(req.id) }).toArray();
            return res.status(200).jsonp(files);
        });

        app.get("/api/users", async (req, res) => {
            res.jsonp(await db.collection("users").find({}).toArray());
        });
        app.get("/api/deleteusers", async (req, res) => {
            try {
                db.collection("users").drop();
            }
            catch (err) { }

            res.jsonp(await db.collection("users").find({}).toArray());
        });

        app.get("/api/files/download/:_id", (req, res) => {
            db
                .collection("files")
                .findOne({ "_id": ObjectId(req.params._id) })
                .then(dbFile => {
                    res.status(200).sendFile
                    return res.status(200).download(path.join(__dirname + "/files/" + dbFile._id.toString()), dbFile.Name);
                })
                .catch(err => {
                    return res.status(500).json({ message: err });
                });
        });




        app.get("/api/getImage/:_id", (req, res) => {
            db
                .collection("files")
                .findOne({ "_id": ObjectId(req.params._id) })
                .then(dbFile => {
                    return res.status(200).sendFile(path.join(__dirname + "/files/" + dbFile._id.toString()));
                })
                .catch(err => {
                    return res.status(500).json({ message: err });
                });
        })




        /*app.post("/api/project", jwtProtection, async (req, res) => {
            console.log(req.body);
        });

        app.post("/api/upload", jwtProtection, )*/




        app.post("/api/files", jwtProtection, upload.single("file"), async (req, res) => {
            const fileDL = new FileDL(req.file.originalname, req.file.size, Date.now(), ObjectId(req.id));

            let fileId = "";

            await db
                .collection("files")
                .insertOne(fileDL)
                .then(result => {
                    fileId = result.insertedId.toString();
                })
                .catch(err => {
                    if (err)
                        return res.status(500).json({ message: err });
                });

            try {
                if (!fs.existsSync('./files'))
                    fs.mkdirSync('./files');

                fs.writeFileSync(`./files/${fileId}`, req.file.buffer);

                return res.status(200).json({ message: "Successfully uploaded." });
            }
            catch (err) {
                return res.status(500).json({ message: err })
            }
        });

        app.post("/api/signup", async (req, res) => {
            let user = new UserSignupPOST(req.body.username, req.body.email, req.body.password);

            let errorMessage = user.Validate();

            if (errorMessage)
                return res.status(400).json({ message: errorMessage });

            const salt = (await randomBytesAsync(16)).toString("hex");
            const hash = (await pbkdf2Async(user.Password, salt, 1000, 64, "sha512")).toString("hex");

            let userDL = new UserDL(user.Username, user.Email, salt, hash);

            db
                .collection("users")
                .insertOne(userDL)
                .then(result => {
                    generateToken(res, result.insertedId.toString(), user.Username, "Successfully signed up.");
                })
                .catch(err => {
                    return res.status(500).json({ message: "Error in insert." });
                });
        });

        app.post("/api/signin", async (req, res) => {
            let user = new UserSigninPOST(req.body.username, req.body.password);

            let errorMessage = user.Validate();

            if (errorMessage)
                return res.status(400).json({ message: errorMessage });

            await db
                .collection("users")
                .findOne({ Username: user.Username })
                .then(async dbUser => {
                    if (!dbUser)
                        return res.status(401).json({ message: "Wrong credentials." });

                    const signinHash = (await pbkdf2Async(user.Password, dbUser.Salt, 1000, 64, "sha512")).toString("hex");

                    if (signinHash == dbUser.Hash)
                        generateToken(res, dbUser._id.toString(), dbUser.Username, "Successfully signed in.");
                    else
                        return res.status(401).json({ message: "Wrong credentials." });
                })
                .catch(err => {
                    return res.status(500).json({ message: err });
                });
        });

        app.delete("/api/files/:_id", jwtProtection, async (req, res) => {
            try {
                db
                    .collection("files")
                    .deleteOne({ "_id": ObjectId(req.params._id), "Owner": ObjectId(req.id) })
                    .then(() => {
                        fs.unlink(`./files/${req.params._id}`, (err) => { if (err) throw err });
                        return res.status(200).json({ message: "Successfully deleted." })
                    })
                    .catch(err => {
                        return res.status(500).json({ message: err });
                    });
            }
            catch (err) {
                return res.status(500).json({ message: err });
            }
        });

        app.listen(port, () => {
            console.log(`Server is listening at ${port}`);
        });
    }
)();



