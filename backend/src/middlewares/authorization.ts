import { NextFunction, Request, Response } from 'express';
import AppError from '../config/app_error';
import catchAsync from '../config/catch_async';
import Exhibition from '../models/exhibition_model';

export const exhibitionUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const exhibitionID = req.params.exhibitionID;

    const exhibition = await Exhibition.findById(exhibitionID);
    if (!exhibition) return next(new AppError('No exhibition of this ID found', 400));

    if (String(exhibition.userID) != req.user.id)
        return next(new AppError('You do not have the permission to perform this action.', 403));

    req.exhibition = exhibition;
    next();
});
