import * as express from 'express';
import { login, refresh, resetPassword, sendResetURL, signup } from '../controllers/auth_controller';
import { updatePassword } from '../controllers/user_controller';
import { protect } from '../middlewares/protect';
import { userPicParser } from '../utils/image_processing/parser';
import { resizeUserPic } from '../utils/image_processing/resize';
import { userCreateValidator } from '../validators/user_validator';

const authRouter = express.Router();

authRouter.post('/login', login);
authRouter.post('/signup', userPicParser, userCreateValidator, resizeUserPic, signup);
authRouter.post('/refresh', refresh);

authRouter.patch('/updatePassword', protect, updatePassword);
authRouter.post('/recovery', sendResetURL);
authRouter.post('/recovery/verify', resetPassword);

export default authRouter;
