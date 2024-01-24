import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// "bcrypt" library helps to hash password.
// jsonwebtoken(JWT)
// Direct encryption is not possible. So, we need to use "hooks" from "mongoose". We we will be using "pre" middleware. "pre" hook is used to perform some action/operation just before the main operation(e.g. encrypt(action) the password just before saving(main operation) in database).

const userSchema = new Schema(
    {
        // MongoDB itself generates an id so we don't have to create id field
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            // To use optimised searching functionality use "index" field.
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
            // To use optimised searching functionality use "index" field.
            index: true,
        },
        avatar: {
            type: String, // cloudinary url
            required: true,
        },
        coverImage: {
            type: String, // cloudinary url 
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video",
            }
        ],
        password: {
            type: String,
            // Password is required with custom error message.
            required: [true, 'Password is required'],
        },
        refreshToken: {
            type: String,
        }

    }, { timestamps: true }
);

// Don't use "arrow" function in "pre". 
// Use async since, it may take time to perform operation(in this case "save")
// We need to use "next" flag since it's a middleware.
userSchema.pre("save", async function (next) {
    // Whenever we make any change in any field and save it password will be changed everytime. But we want that it should change the passowrd only if there is modification in "password" field.
    if (!this.isModified("password")) return next();

    this.password = bcrypt.hash(this.password, 10); // 10: Number of rounds.
    next();
});

// Adding custom methods inside "methods" object in userSchema.
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function () {
    // "jwt" has "sign" method which generates access token
    return jwt.sign(
        // Payload👇🏼:
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName,
        },
        // Access token
        process.env.ACCESS_TOKEN_SECRET,
        // expiry object
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
}
userSchema.methods.generateRefreshToken = function () {
    // "jwt" has "sign" method which generates refresh token
    return jwt.sign(
        // Payload👇🏼:
        {
            _id: this._id,
        },
        // Access token
        process.env.REFRESH_TOKEN_SECRET,
        // expiry object
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
}

export const User = mongoose.model("User", userSchema);