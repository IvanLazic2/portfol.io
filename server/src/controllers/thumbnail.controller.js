import fs from 'fs/promises';
import { uploadDirectory } from '../configs/upload.config.js';
import * as UploadService from '../services/upload.service.js';

export async function getAll(req, res, next) {
    try {

        const getAllUploadsResult = await UploadService.getAll(req.params.projectId);

        const images = [];
        for (const upload of getAllUploadsResult) {
            try {
                const image = await fs.readFile(uploadDirectory + req.params.projectId + '/thumbnail_' + upload._id + '.jpg', 'base64');
                images.push(image);
            } catch (error) {
                console.error(`Error reading image ${upload._id}: ${error}`);
                images.push('');
            }
        }

        res.status(200).json(images);

    } catch (err) {
        console.error("Error in upload controller: getFiles: ", err);
        next(err);
    }
}
