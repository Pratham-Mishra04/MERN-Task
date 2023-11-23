import * as cors from 'cors';
import * as express from 'express';
import { Express, NextFunction, Request, Response } from 'express';
import * as ExpressMongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import * as morgan from 'morgan';
import * as path from 'path';
import AppError from './config/app_error';
import { ENV, configENV } from './config/env';
import ErrorController from './controllers/error_controller';

const app: Express = express();

configENV();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(ExpressMongoSanitize());
if (ENV.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, '../public')));

// connectToDB();

app.listen(ENV.PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${ENV.PORT}`);
});

app.use((req: Request, res: Response, next: NextFunction) => {
    req.requestedAt = new Date().toISOString();
    next();
});

app.all('*', (req: Request, res: Response, next: NextFunction) => {
    next(new AppError(`Cannot find ${req.originalUrl}`, 404));
});

app.use(ErrorController);

export default app;
