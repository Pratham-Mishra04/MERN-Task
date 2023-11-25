import { ExhibitionDocument } from '../models/exhibition_model';
import { UserDocument } from '../models/user_model';

export {};

declare global {
    namespace Express {
        export interface Request {
            requestedAt: string;
            user: UserDocument;
            exhibition: ExhibitionDocument;
        }
    }
}
