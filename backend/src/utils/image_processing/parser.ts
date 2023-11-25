import * as multer from 'multer';
import { multipleImgFilter, singleImgFilter } from './config/filter';
import { exhibitionPicDiskStorage, multipleImgDiskStorage, userPicDiskStorage } from './config/storage';

const userPicUpload = multer({
    fileFilter: singleImgFilter,
    storage: userPicDiskStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
});

const exhibitionPicUpload = multer({
    fileFilter: singleImgFilter,
    storage: exhibitionPicDiskStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
});

const multipleImgUpload = multer({
    fileFilter: multipleImgFilter,
    storage: multipleImgDiskStorage,
    limits: { fileSize: 25 * 1024 * 1024 },
});

export const userPicParser = userPicUpload.fields([
    {
        name: 'profilePic',
        maxCount: 1,
    },
    {
        name: 'coverPic',
        maxCount: 1,
    },
]);

export const exhibitionPicParser = exhibitionPicUpload.single('image');

export const multipleImgParser = multipleImgUpload.any();
