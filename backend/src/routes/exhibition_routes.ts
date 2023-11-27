import * as express from 'express';
import {
    deleteExhibition,
    getExhibition,
    getExhibitions,
    newExhibition,
    updateExhibition,
} from '../controllers/exhibition_controller';
import { exhibitionUser } from '../middlewares/authorization';
import { protect } from '../middlewares/protect';
import { exhibitionPicParser } from '../utils/image_processing/parser';
import { resizeExhibitionPic } from '../utils/image_processing/resize';
import { exhibitionCreateValidator, exhibitionUpdateValidator } from '../validators/exhibition_validator';

const exhibitionRouter = express.Router();

exhibitionRouter
    .route('/')
    .get(getExhibitions)
    .post(protect, exhibitionPicParser, exhibitionCreateValidator, resizeExhibitionPic, newExhibition);

exhibitionRouter
    .route('/:exhibitionID')
    .get(protect, getExhibition)
    .patch(protect, exhibitionUser, exhibitionUpdateValidator, updateExhibition)
    .delete(protect, exhibitionUser, deleteExhibition);

export default exhibitionRouter;
