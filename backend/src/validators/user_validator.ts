import { Request } from 'express';
import * as fs from 'fs';
import * as Joi from 'joi';
import { isValidNumber } from 'libphonenumber-js';
import AppError from '../config/app_error';
import catchAsync from '../config/catch_async';
import User from '../models/user_model';

const userCreateSchema = Joi.object({
    name: Joi.string()
        .pattern(/^[A-Za-z]+$/, 'alpha')
        .trim()
        .required(),
    email: Joi.string().email().trim().lowercase().required(),
    username: Joi.string().trim().lowercase().required(),
    password: Joi.string().min(8).required(),
    confirmPassword: Joi.ref('password'),
    passwordChangedAt: Joi.forbidden(),
    passwordResetToken: Joi.forbidden(),
    passwordResetTokenExpiresIn: Joi.forbidden(),
});

const userUpdateSchema = Joi.object({
    name: Joi.string()
        .pattern(/^[A-Za-z]+$/, 'alpha')
        .trim(),
    email: Joi.string().email().trim().lowercase(),
    username: Joi.forbidden(),
    profilePic: Joi.string(),
    coverPic: Joi.string(),
    bio: Joi.string(),
    tagline: Joi.string(),
    tags: Joi.array().items(Joi.string()),
    password: Joi.forbidden(),
    confirmPassword: Joi.forbidden(),
    phoneNo: Joi.string().custom((value: string, helper: Joi.CustomHelpers) => {
        if (!isValidNumber(value))
            return helper.error('phoneNo.invalid', {
                message: 'Enter a valid Phone Number',
            });
        return value;
    }),
    passwordChangedAt: Joi.forbidden(),
    passwordResetToken: Joi.forbidden(),
    passwordResetTokenExpiresIn: Joi.forbidden(),
});

export const userCreateValidator = catchAsync(async (req, res, next) => {
    try {
        await userCreateSchema.validateAsync(req.body);

        if (await User.findOne({ email: req.body.email })) throw new AppError('Email already in use', 400);

        if (await User.findOne({ username: req.body.username })) throw new AppError('Username already in use', 400);

        next();
    } catch (error) {
        next(error);
    }
});

const removeReqFiles = (req: Request) => {
    if (req.file) {
        const picPath = `${req.file.destination}/${req.file.filename}`;
        fs.unlinkSync(picPath);
    }
};

export const userUpdateValidator = catchAsync(async (req, res, next) => {
    try {
        await userUpdateSchema.validateAsync(req.body);

        if (req.body.email && (await User.findOne({ email: req.body.email })))
            throw new AppError('Email already in use', 400);

        if (req.body.username && (await User.findOne({ username: req.body.username })))
            throw new AppError('Username already in use', 400);

        if (req.body.phoneNo && (await User.findOne({ phoneNo: req.body.phoneNo })))
            throw new AppError('Phone Number already in use', 400);

        next();
    } catch (error) {
        removeReqFiles(req);
        next(error);
    }
});
