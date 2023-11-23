import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import AppError from '../config/app_error';
import catchAsync from '../config/catch_async';
import { ENV } from '../config/env';
import User from '../models/user_model';

const jwtVerifyPromisified = (token: string, secret: string) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, {}, (err, payload) => {
            if (err) {
                reject(err);
            } else {
                resolve(payload);
            }
        });
    });
};

export const protect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let token: string;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
        token = req.headers.authorization.split(' ')[1];
    if (!token) return next(new AppError('You are not Logged in. Please Login to continue', 401));

    const decoded: jwt.JwtPayload = await jwtVerifyPromisified(token, ENV.JWT_KEY);

    const user = await User.findById(decoded.id);

    if (!user) return next(new AppError('User of this token no longer exists', 401));
    if (user.changedPasswordAfter(decoded.iat))
        return next(new AppError('Password was recently changed. Please Login again', 401));

    req.user = user;
    next();
});
