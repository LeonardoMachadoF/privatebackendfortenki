import { randomUUID } from "crypto";
import multer from "multer";

export const upload = multer({
    storage: multer.diskStorage({
        destination: './public/tmp',
        filename: (req, file, cb) => {
            let allowed = ['jpeg', 'jpg', 'png', 'webp', 'avif']
            allowed.includes(file.mimetype.split('/')[1]) === false ? cb(new Error('image not allowd'), '') :
                cb(null, file.originalname + randomUUID() + '.' + file.mimetype.split('/')[1])
        },
    }),
    limits: {
        fileSize: 1000000 * 10 //1mb * 10   
    },
});