import mongoose from "mongoose";
const { Schema } = mongoose;


const userSchema = new Schema({
    _id: String,
    email: String,
    passwordHash: String,
    salt: String,
    firstName: String,
    lastName: String,
    isPublic: Boolean,
    photos: [{
        photo_id: {
            type: mongoose.Schema.Types.ObjectId, // Use the ObjectId type for the photo_id field
            default: mongoose.Types.ObjectId // Generate a new ObjectId by default
        },
        created: Date,
        img: {
            data: Buffer,
            contentType: String
        }
    }]
});

const User = new mongoose.model('User', userSchema);

export default User;