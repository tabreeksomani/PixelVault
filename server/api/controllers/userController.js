import crypto from "crypto";
import User from '../models/user.js'
import jwt from 'jsonwebtoken';
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
    verifyToken = async (req) => {
        const token = req.headers["x-access-token"];
        try {
            const decoded = jwt.verify(token, secretKey);
            const user = await User.findOne({_id: decoded._id, email: decoded.email});
            return user;
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
                            userId: existingUser._id,
                            email: existingUser.email
                        };
                        const options = {expiresIn: '6h'};
                        const token = jwt.sign(payload, secretKey, options);
                        return resolve(token);
                    }
                }
            }
            return reject({err: "Login failed, incorrect credentials. Please try again."});
        });
    }


}

