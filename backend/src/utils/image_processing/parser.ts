import * as multer from 'multer';
import { multipleImgFilter, userPicFilter } from './configs/filter';
import { multipleImgDiskStorage, userPicDiskStorage } from './configs/storage';

const userPicUpload = multer({
    fileFilter: userPicFilter,
    storage: userPicDiskStorage,
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

export const multipleImgParser = multipleImgUpload.any();
