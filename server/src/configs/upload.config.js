import multer from "multer";

const uploadDirectory = './uploads/';
const maxUploadCount = 10;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export { uploadDirectory, maxUploadCount, storage, upload };