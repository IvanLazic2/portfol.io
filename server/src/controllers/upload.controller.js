// https://levelup.gitconnected.com/complete-guide-to-upload-multiple-files-in-node-js-using-middleware-3ac78a0693f3
import fs from 'fs/promises';
import sharp from 'sharp';
import path from "path";
import { uploadDirectory, getUploadPath, checkAndCreateDirectory } from "../configs/upload.config.js";
import * as UploadService from '../services/upload.service.js';
import * as ProjectService from '../services/project.service.js';
import * as UserService from '../services/user.service.js';
import { MessageType } from "../enums/messageType.js";
import { UploadGET } from "../models/upload/Upload.model.js";

import { URL } from 'url';

const __filename = new URL('', import.meta.url).pathname;
const __dirname = new URL('.', import.meta.url).pathname;

async function createImageThumbnail(inputPath, outputPath, width, height) {
    try {
        /*await sharp(inputPath, { failOnError: false })
            .resize(width, height)
            .toFile(outputPath);*/

        await sharp(inputPath, { failOnError: false })
            .rotate()
            .resize({ width: 256 })
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
        console.error("Error in upload controller: create: ", err);
        next(err);
    }
}

export async function get(req, res, next) {
    try {
        const getUploadResult = await UploadService.get(req.params.id);
        res.sendFile(path.resolve(getUploadPath(getUploadResult.ProjectId, req.params.id)));
    } catch (error) {
        console.error(error)
    }
}

export async function remove(req, res, next) {
    try {
        const getUploadResult = await UploadService.get(req.params.id);
        const getProjectResult = await ProjectService.get(getUploadResult.ProjectId);
        const getUserResult = await UserService.getById(getProjectResult.UserId);

        if (getUserResult._id.toString() != req.userId) {
            return res.status(401).end();
        }

        await fs.rm(uploadDirectory + getUploadResult.ProjectId + '/' + req.params.id + '.jpg')
        await fs.rm(uploadDirectory + getUploadResult.ProjectId + '/thumbnail_' + req.params.id + '.jpg')

        const removeResult = await UploadService.remove(req.params.id);

        /* temp */ return res.status(200).json({ message: "File delete called: id: " + req.params.id });

    } catch (err) {
        console.error("Error in upload controller: deleteFile: ", err);
        next(err);
    }
}
