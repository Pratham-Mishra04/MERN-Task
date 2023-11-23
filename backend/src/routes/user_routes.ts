import * as express from 'express';
import { login, resetPassword } from '../controllers/auth_controller';
import { deleteUser, getUser, updatePassword } from '../controllers/user_controller';
import { protect } from '../middlewares/protect';

const userRouter = express.Router();

userRouter.post('/login', login);

// userRouter.post('/signup', userPicUploadParserer, userCreateValidator, resizeUserPic, signup);

userRouter
    .route('/')
    // .get(getAllDocs(User))
    // .patch(protect, userPicUploadParserer, userUpdateValidator, resizeUserPic, updateUser)
    .delete(protect, deleteUser);

userRouter.patch('/updatePassword', protect, updatePassword);

// userRouter.post('/forgotPassword', forgotPassword);

userRouter.post('/resetPassword', resetPassword);

userRouter.get('/:userID', getUser);
