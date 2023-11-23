import * as express from 'express';
import { login, resetPassword, signup } from '../controllers/auth_controller';
import { deleteUser, getUser, getUsers, updatePassword, updateUser } from '../controllers/user_controller';
import { protect } from '../middlewares/protect';
import { userPicParser } from '../utils/image_processing/parser';
import { resizeUserPic } from '../utils/image_processing/resize';
import { userCreateValidator, userUpdateValidator } from '../validators/user_validator';

const userRouter = express.Router();

userRouter.post('/login', login);

userRouter.post('/signup', userPicParser, userCreateValidator, resizeUserPic, signup);

userRouter
    .route('/')
    .get(getUsers)
    .patch(protect, userPicParser, userUpdateValidator, resizeUserPic, updateUser)
    .delete(protect, deleteUser);

userRouter.patch('/updatePassword', protect, updatePassword);

// userRouter.post('/forgotPassword', forgotPassword);

userRouter.post('/resetPassword', resetPassword);

userRouter.get('/:userID', getUser);
