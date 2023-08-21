import multer from 'multer';

export const uploadDirectory = './uploads/';
export const maxUploadCount = 10;

export const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });

export function getUploadPath(projectId, uploadId) {
    return uploadDirectory + projectId + '/' + uploadId + '.jpg';
}

export function getThumbnailPath(projectId, uploadId) {
    return uploadDirectory + projectId + '/thumbnail_' + uploadId + '.jpg';
}
