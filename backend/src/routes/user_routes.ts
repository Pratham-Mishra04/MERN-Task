import * as express from 'express';
import { deleteMe, getMe, getUser, getUsers, updateMe } from '../controllers/user_controller';
import { protect } from '../middlewares/protect';
import { userPicParser } from '../utils/image_processing/parser';
import { resizeUserPic } from '../utils/image_processing/resize';
import { userUpdateValidator } from '../validators/user_validator';

const userRouter = express.Router();

userRouter.get('/', protect, getUsers);

userRouter
    .route('/me')
    .get(protect, getMe)
    .patch(protect, userPicParser, userUpdateValidator, resizeUserPic, updateMe)
    .delete(protect, deleteMe);

userRouter.get('/:userID', getUser);

export default userRouter;
