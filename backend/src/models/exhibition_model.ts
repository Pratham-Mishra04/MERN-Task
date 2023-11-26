import mongoose from 'mongoose';
import { UserDocument } from './user_model';

export interface ExhibitionDocument extends mongoose.Document {
    _id: mongoose.Schema.Types.ObjectId;
    id: string;
    title: string;
    description: string;
    category: string;
    image: string;
    userID: mongoose.Schema.Types.ObjectId;
    user: UserDocument;
    createdAt: Date;
}

const exhibitionSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            required: true,
        },
        description: {
            type: String,
            trim: true,
        },
        category: {
            type: String,
            trim: true,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now(),
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

const Exhibition = mongoose.model<ExhibitionDocument>('Exhibition', exhibitionSchema);

export default Exhibition;
