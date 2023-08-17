import fs from 'fs/promises';
import { uploadDirectory } from '../configs/upload.config.js';
import * as UploadService from '../services/upload.service.js';

export async function getAll(req, res, next) {
    try {

        const getAllUploadsResult = await UploadService.getAll(req.params.projectId);

        const thumbnails = [];
        for (const upload of getAllUploadsResult) {
            try {
                const image = await fs.readFile(uploadDirectory + req.params.projectId + '/thumbnail_' + upload._id + '.jpg', 'base64');
                thumbnails.push({ UploadId: upload._id, Data: image });
            } catch (error) {
                console.error(`Error reading image ${upload._id}: ${error}`);
                //thumbnails.push({ UploadId: upload._id, Data: "" });
            }
        }

        res.status(200).json(thumbnails);

    } catch (err) {
        console.error("Error in upload controller: getFiles: ", err);
        next(err);
    }
}