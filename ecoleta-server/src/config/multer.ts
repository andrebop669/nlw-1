import multer from 'multer';
import patth from 'path';
import { request } from 'express';
import crypto from 'crypto';

export default {
    storage: multer.diskStorage({
        destination: patth.resolve(__dirname, '..', '..', 'uploads'),
        filename(request, file, callback) {
            const hash = crypto.randomBytes(6).toString('hex');
            const filename = `${hash}-${file.originalname}`;
            callback(null, filename);
        }
    })

}