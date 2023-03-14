import User from '../models/user.js'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const secretKey = process.env.SECRET_KEY;

export default class PhotoController {
    verifyToken = (req) => {
        const token = req.headers["x-access-token"];
        try {
            const decoded = jwt.verify(token, secretKey);
            return decoded._id;
        } catch (err) {
            return null;
        }
    };

    deletePhoto(req) {
        return new Promise(async (resolve, reject) => {
            if (!req.params || req.params.photoId === null) {
                return reject({err: "No photo ID found"});
            }

            let userId;
            userId = this.verifyToken(req);
            if (userId === null) return reject("Unauthorized Request");

            let user = await User.updateOne({_id: userId},
                {$pull: {photos: {_id: req.params.photoId}}}
            );
            if (user.modifiedCount === 0) {
                return reject("Unauthorized Request: Photo not found");
            }
            return resolve("Successfully deleted photo");

        });
    }
}

