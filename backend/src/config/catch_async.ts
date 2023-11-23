import { NextFunction, Request, Response } from 'express';
import logger from '../utils/logger';

type asyncFunction = (req: Request, res: Response, next: NextFunction) => any;

const catchAsync = (fn: asyncFunction) => (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((err: Error) => {
        logger.error(err.message);
        next(err);
    });
};

export default catchAsync;
