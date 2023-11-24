import * as multer from 'multer';
import * as path from 'path';

export const userPicDiskStorage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, `./public/users/${file.fieldname}s`); //for both profile and cover pics
    },
    filename(req, file, callback) {
        const name = `${req.user ? req.user.username : req.body.username}-${Date.now()}${path.extname(
            file.originalname
        )}`;
        req.body[`${file.fieldname}`] = name;
        callback(null, name);
    },
});

export const multipleImgDiskStorage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, `./public/${req.baseUrl.replace('/', '')}/`);
    },
    filename(req, file, callback) {
        const name = `${req.user.username}-${req.body.title}-${Date.now()}${path.extname(file.originalname)}`;
        try {
            req.body.images.push(name);
        } catch (err) {
            req.body.images = [];
            req.body.images.push(name);
        }
        callback(null, name);
    },
});
