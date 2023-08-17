// https://levelup.gitconnected.com/complete-guide-to-upload-multiple-files-in-node-js-using-middleware-3ac78a0693f3
import fs from "fs/promises";
import sharp from "sharp";
import { exec } from "child_process";
import { uploadDirectory } from "../configs/upload.config.js";
import * as UploadService from '../services/upload.service.js';
import { MessageType } from "../enums/messageType.js";
import { UploadGET } from "../models/upload/Upload.model.js";


async function checkAndCreateDirectory(res, path) {
    try {
        await fs.mkdir(path, { recursive: true });
    } catch (error) {
        console.error(error);
    }
}

async function createImageThumbnail(inputPath, outputPath, width, height) {
    try {
        await sharp(inputPath, { failOnError: false })
            .resize(width, height)
            .toFile(outputPath);
    } catch (error) {
        console.error('Error generating thumbnail:', error);
    }
}

async function createVideoThumbnail(inputPath, outputPath, time) {
    // TODO: implement
}

async function createThumbnail(inputPath, outputPath, width, height) {
    await createImageThumbnail(inputPath, outputPath, width, height);
}

export async function create(req, res, next) {
    try {
        const result = await UploadService.create(req.body.projectId, req.file);

        const uploadId = result.insertedId.toString();

        await checkAndCreateDirectory(res, uploadDirectory + req.body.projectId)

        await fs.writeFile(uploadDirectory + req.body.projectId + '/' + uploadId + '.jpg', req.file.buffer);
        await createThumbnail(uploadDirectory + req.body.projectId + '/' + uploadId + '.jpg', uploadDirectory + req.body.projectId + '/thumbnail_' + uploadId + '.jpg', 100, 100);

        return res.status(200).json({ message: "Files save called: projectId: " + req.body.projectId });

    } catch (err) {
        console.error("Error in upload controller: saveFiles: ", err);
        next(err);
    }
}

export async function get() {

}

/*export async function getThumbnails(req, res, next) {
    try {

        const result = await UploadService.getThumbnails(req.params.projectId);

        const promises = [];
        const uploads = [];

        for (const upload of result) {
            const buffer = await fs.readFile(uploadDirectory + upload._id.toString())
                .catch((error) => {
                    console.error(`Error reading file: ${error}`);
                });

            if (buffer) {
                uploads.push(new UploadGET(upload.Name, upload.Size, upload.UploadDate, buffer));
            }
        }

        console.log(uploads);

        res.status(200).end();

    } catch (err) {
        console.error("Error in upload controller: getFiles: ", err);
        next(err);
    }
}*/

export async function remove(req, res, next) {
    try {

        /* temp */ return res.status(200).json({ message: "File delete called: id: " + req.params.id });

    } catch (err) {
        console.error("Error in upload controller: deleteFile: ", err);
        next(err);
    }
}

