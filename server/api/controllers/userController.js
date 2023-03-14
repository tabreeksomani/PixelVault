import crypto from "crypto";
import User from '../models/user.js'
import jwt, {verify} from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const secretKey = process.env.SECRET_KEY;

function genRandomString(number) {
    return crypto.randomBytes(Math.ceil(number / 2))
        .toString('hex') /** convert to hexadecimal format */
        .slice(0, number); /** return required number of characters */
}

function encrypt(password, salt) {
    let hash = crypto.createHmac('sha512', salt);
    /** Hashing algorithm sha512 */
    hash.update(password);
    const value = hash.digest('hex');
    return value;
}

export default class UserController {
    verifyToken = (req) => {
        const token = req.headers["x-access-token"];
        try {
            const decoded = jwt.verify(token, secretKey);
            // const user = await User.findOne({_id: decoded._id});
            return decoded._id;
        } catch (err) {
            return null;
        }
    };

    createUser(req) {
        return new Promise(async (resolve, reject) => {
            const requiredFields = ['username', 'email', 'password', 'firstName', 'lastName'];

            for (const field of requiredFields) {
                if (!req.body[field]) {
                    return reject({err: "Required field " + field + " is missing"});
                }
            }
            let salt = genRandomString(16);
            /** Gives us salt of length 16 */
            let hashedPassword = encrypt(req.body.password, salt);
            const user = new User(
                {
                    _id: req.body.username,
                    email: req.body.email,
                    salt: salt,
                    passwordHash: hashedPassword,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    isPublic: true,
                    photos: []
                }
            )

            let result = await User.findOne({email: user.email});
            if (result != null) {
                return reject({err: "User with this email already exists"});
            }
            result = await User.findOne({_id: user._id});
            if (result != null) {
                return reject({err: "User with this username already exists"});
            }
            try {
                user.save();
                return resolve("User saved successfully: ", user.userId);

            } catch (e) {
                return reject({err: "Error saving user"});

            }

        });
    }

    authenticateUser(req) {
        return new Promise(async (resolve, reject) => {
            if (!req.body['username'] || !req.body['password']) {
                return reject({err: "Username or Password field is missing"});
            }
            let password = req.body.password;
            let existingUser = await User.findOne({_id: req.body.username});
            if (existingUser !== null) {
                if (existingUser && existingUser._id === req.body.username) {
                    if (existingUser.passwordHash === encrypt(password, existingUser.salt)) {
                        const payload = {
                            _id: existingUser._id,
                            email: existingUser.email
                        };
                        const token = jwt.sign(payload, secretKey);
                        return resolve(token);
                    }
                }
            }
            return reject({err: "Login failed, incorrect credentials. Please try again."});
        });
    }


    updatePrivacy(req) {
        return new Promise(async (resolve, reject) => {
            if (!req.params || req.params.isPublic === null) {
                return reject({err: "Privacy setting is missing"});
            }
            const isPublic = JSON.parse(req.params.isPublic);
            if (typeof isPublic !== "boolean") {
                return reject({err: "Privacy setting is missing"});

            }
            let userId = this.verifyToken(req);
            if (userId === null) {
                return reject({err: "User does not exist"});
            }
            const query = {_id: userId};
            const update = {$set: {isPublic: req.params.isPublic}};
            let user = await User.findOneAndUpdate(query, update, {
                new: true
            });
            return resolve(user);
        });


    }


    getPhotosByUser(req) {
        return new Promise(async (resolve, reject) => {
            if (!req.params || req.params.userId === null) {
                return reject({err: "No username found"});
            }
            let userId;
            userId = this.verifyToken(req);
            if (userId === null) return reject("Unauthorized Request");
            userId = req.params.userId;
            let user = await User.findById(userId);
            if (user != null) {
                let myGallery = user.photos;
                myGallery = myGallery.sort(function (a, b) {
                    return b.created - a.created;
                })
                return resolve(myGallery);
            }
            return reject("User not found");
        });
    }
}

