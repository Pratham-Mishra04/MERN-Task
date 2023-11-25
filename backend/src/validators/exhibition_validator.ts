import { NextFunction, Request, Response } from 'express';
import * as fs from 'fs';
import * as Joi from 'joi';

const exhibitionCreateSchema = Joi.object({
    title: Joi.string().trim().required(),
    description: Joi.string().trim(),
    category: Joi.string().required(),
    image: Joi.string().required(),
});

const exhibitionUpdateSchema = Joi.object({
    title: Joi.string().trim(),
    description: Joi.string().trim(),
    image: Joi.forbidden(),
    userID: Joi.forbidden(),
});

const removeReqFiles = (req: Request) => {
    if (req.file) {
        const picPath = `${req.file.destination}/${req.file.filename}`;
        fs.unlinkSync(picPath);
    }
};

export const exhibitionCreateValidator = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await exhibitionCreateSchema.validateAsync(req.body);
        req.body.userID = req.user.id;
        next();
    } catch (error) {
        removeReqFiles(req);
        next(error);
    }
};

export const exhibitionUpdateValidator = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await exhibitionUpdateSchema.validateAsync(req.body);
        next();
    } catch (error) {
        next(error);
    }
};
