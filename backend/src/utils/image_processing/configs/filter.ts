import AppError from '../../../config/app_error';

export const userPicFilter = (req, file, cb) => {
    // runs for each file
    if (file.fieldname == 'profilePic' || file.fieldname == 'coverPic') {
        if (file.mimetype.startsWith('image')) cb(null, true);
        else cb(new AppError('Only image files are allowed', 400), false);
    } else cb(new AppError('Invalid input', 400), false);
};

export const multipleImgFilter = (req, file, cb) => {
    if (file.fieldname == 'images') {
        if (file.mimetype.startsWith('image')) cb(null, true);
        else cb(new AppError('Only image files are allowed', 400), false);
    } else cb(new AppError('Invalid input', 400), false);
};
