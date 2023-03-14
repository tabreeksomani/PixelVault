import User from '../models/user.js'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import fs from "fs";

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

    addPhoto(req) {
        return new Promise(async (resolve, reject) => {
            let buffer
            if (req.file == null) {
                // If Submit was accidentally clicked with no file selected...
                return reject("No file uploaded")
            } else {
                // read the img file from tmp in-memory location
                const newImg = fs.readFileSync(req.file.path);
                // encode the file as a base64 string.
                const encImg = newImg.toString('base64');
                // define your new document
                buffer = new Buffer(encImg, 'base64')
            }
            const userId = this.verifyToken(req);
            if (userId === null) return reject("Unauthorized Request");
            const newPhoto = {
                created: Date.now(),
                img: {
                    data: buffer,
                    contentType: 'image/jpeg'
                }
            };

            return User.findByIdAndUpdate(userId, {$push: {photos: newPhoto}})
                .then(() => {
                    return resolve('Photo added successfully');
                })
                .catch(err => {
                    return reject('Error adding photo ' + err);
                });

        });
    }

    getPublicPhotos(req) {
        return new Promise(async (resolve, reject) => {
            if (this.verifyToken(req) === null) return reject("Unauthorized Request");
            const users = await User.find();
            let gallery = [];
            for (let user of users) {
                if (user.isPublic) {
                    user.photos.map((photo) => {
                        gallery.push(photo);
                    })
                }
            }

            gallery = gallery.sort(function (a, b) {
                return b.created - a.created;
            });
            return resolve(gallery);

        });
    }
}


