import fs from 'fs/promises';
import path from 'path';
import { getThumbnailPath } from '../configs/upload.config.js';
import * as UploadService from '../services/upload.service.js';

export async function get(req, res) {
    try {
        const getUploadResult = await UploadService.get(req.params.id);
        res.sendFile(path.resolve(getThumbnailPath(getUploadResult.ProjectId, req.params.id)));
    } catch (error) {
        console.error(error);
    }
}