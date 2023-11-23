import { NextFunction, Request, Response } from 'express';
import AppError from '../config/app_error';
import catchAsync from '../config/catch_async';
import User from '../models/user_model';
import { createSendToken } from './auth_controller';

export const getUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.userID).populate([
        {
            path: 'following',
            select: {
                id: 1,
                username: 1,
                name: 1,
                profilePic: 1,
                tagline: 1,
            },
        },
    ]);
    if (!user) return next(new AppError('No user of this ID found', 400));

    res.status(200).json({
        status: 'success',
        requestedAt: req.requestedAt,
        user,
    });
});

export const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        status: 'success',
        requestedAt: req.requestedAt,
        user,
    });
});

export const deleteUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });
    res.status(204).json({
        status: 'success',
        requestedAt: req.requestedAt,
        data: null,
    });
});

export const updatePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user.id).select('+password');
    if (!(await user.correctPassword(req.body.password)))
        return next(new AppError('Incorect Password, Please enter the corrent password', 401));

    user.password = req.body.newPassword;
    await user.save();

    createSendToken(user, 200, res);
});
