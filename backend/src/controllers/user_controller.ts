import { NextFunction, Request, Response } from 'express';
import * as fs from 'fs';
import AppError from '../config/app_error';
import catchAsync from '../config/catch_async';
import Features from '../helpers/features';
import User from '../models/user_model';
import { createSendToken } from './auth_controller';

export const getUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const features = new Features(User.find(), req.query);
    features.search(0).sort().paginator();

    const users = await features.query;

    res.status(200).json({
        status: 'success',
        requestedAt: req.requestedAt,
        users,
    });
});

export const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    res.status(200).json({
        status: 'success',
        requestedAt: req.requestedAt,
        user,
    });
});

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

export const updateMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const oldProfilePic = req.user.profilePic;
    const oldCoverPic = req.user.coverPic;

    const user = await User.findByIdAndUpdate(req.user.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (req.body.profilePic && req.body.profilePic != '') {
        const picPath = `public/users/profilePics/${oldProfilePic}`;
        fs.unlinkSync(picPath);
    }
    if (req.body.coverPic && req.body.coverPic != '') {
        const picPath = `public/users/coverPics/${oldCoverPic}`;
        fs.unlinkSync(picPath);
    }

    res.status(200).json({
        status: 'success',
        requestedAt: req.requestedAt,
        user,
    });
});

export const deleteMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await req.user.deleteOne();

    if (req.user.profilePic && req.user.profilePic != '') {
        const picPath = `public/users/profilePics/${req.user.profilePic}`;
        fs.unlinkSync(picPath);
    }
    if (req.user.coverPic && req.user.coverPic != '') {
        const picPath = `public/users/coverPics/${req.user.coverPic}`;
        fs.unlinkSync(picPath);
    }

    res.status(204).json({
        status: 'success',
        requestedAt: req.requestedAt,
        data: null,
    });
});

export const updatePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user.id).select('+password');
    if (!(await user.correctPassword(req.body.password))) return next(new AppError('Incorrect Password', 401));

    user.password = req.body.newPassword;
    await user.save();

    createSendToken(user, 200, res);
});
