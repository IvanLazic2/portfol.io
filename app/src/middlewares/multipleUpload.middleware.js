import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { uploadConfig } from '../configs/upload.config.js'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    req.fileId = uuidv4();
    cb(null, req.fileId + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

export const multipleUploadMiddleware = (req, res, next) => {
  upload.array('files', uploadConfig.maxUploadCount)(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    const files = req.files;
    const errors = [];

    files.forEach((file) => {
      const allowedTypes = ['image/jpeg', 'image/png'];
      const maxSize = uploadConfig.maxUploadCount * 4096 * 4096; // 5 * 1024 * 1024 = 5MB

      if (!allowedTypes.includes(file.mimetype)) {
        errors.push(`Invalid file type: ${file.originalname}`);
      }

      if (file.size > maxSize) {
        errors.push(`File too large: ${file.originalname}`);
      }
    });

    if (errors.length > 0) {
      files.forEach((file) => {
        fs.unlinkSync(file.path);
      });

      return res.status(400).json({ errors });
    }

    req.files = files;
    
    next();
  });
};