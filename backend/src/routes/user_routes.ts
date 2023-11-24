import * as express from 'express';
import { deleteUser, getUser, getUsers, updateUser } from '../controllers/user_controller';
import { protect } from '../middlewares/protect';
import { userPicParser } from '../utils/image_processing/parser';
import { resizeUserPic } from '../utils/image_processing/resize';
import { userUpdateValidator } from '../validators/user_validator';

const userRouter = express.Router();

userRouter
    .route('/')
    .get(getUsers)
    .patch(protect, userPicParser, userUpdateValidator, resizeUserPic, updateUser)
    .delete(protect, deleteUser);

userRouter.get('/:userID', getUser);

export default userRouter;
