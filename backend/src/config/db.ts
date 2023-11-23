import mongoose from 'mongoose';
import { ENV } from './env';

const URL: string =
    ENV.NODE_ENV == 'development'
        ? 'mongodb://127.0.0.1:27017'
        : ENV.DATABASE_URL.replace('<password>', ENV.DATABASE_PASSWORD);

const connectToDB = () =>
    mongoose
        .connect(URL)
        .then(() => console.log('Connected to Database!'))
        .catch(err => {
            console.error('Cannot connect to Database: ', err);
        });

export default connectToDB;
