import * as uploadService from '../services/upload.service.js';

export async function saveFiles(req, res, next) {
    try {
        const projectId = "" //req.body;
        const { code, message } = await uploadService.saveFiles(projectId, req.files);
        return res.status(code).json({ message: message });
    } catch (err) {
        console.error("Error in upload controller: saveFiles: ", err);
        next(err);
    }
}

export async function deleteFile(req, res, next) {
    try {
        const { code, message } = await uploadService.deleteFile(req.params.id);
        res.status(code).json({ message: message });
    } catch (err) {
        console.error("Error in upload controller: deleteFile: ", err);
        next(err);
    }
}

