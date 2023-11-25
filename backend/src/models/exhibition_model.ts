import mongoose from 'mongoose';
import User, { UserDocument } from './user_model';

export interface ExhibitionDocument extends mongoose.Document {
    _id: mongoose.Schema.Types.ObjectId;
    id: string;
    title: string;
    description: string;
    image: string;
    userID: mongoose.Schema.Types.ObjectId;
    user: UserDocument;
}

const exhibitionSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            required: true,
        },
        description: String,
        image: {
            type: String,
            required: true,
        },
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

exhibitionSchema.virtual('user').get(async function async() {
    return await User.findById(this.userID);
});

const Exhibition = mongoose.model<ExhibitionDocument>('Exhibition', exhibitionSchema);

export default Exhibition;
