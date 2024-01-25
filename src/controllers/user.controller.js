// We have written an helper file(asyncHandler)

// Sir's CODE
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res


    // 1. handling request data(when in json form or from a "form") sent from client side. 
    console.log("Received data in requestUser: ", req.body);
    const { fullName, email, username, password } = req.body
    console.log("fullname: ", fullName);


    // validation
    // We can do like this👇🏼(i.e. using if-else-if)
    /* if (fullName === "") {
        throw new ApiError(400, "Full name is required");
    } */

    // More professional way
    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }
    // We can add more validations

    // Check if user already exist
    // Learning: In this 👇🏼 "existedUser" code block "await" was missing. And this process was taking time(since, it was interacting with database). And the next "if" block was dependent on this 👇🏼"existedUser" variable due to which "if" block was getting wrong value in "existedUser".
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }

    // Since, we have used "multer" middleware so we have access to files.
    // Getting the path of the files that we have uloaded on our own server using "multer" temporarily.
    const avatarLocalPath = req.files?.avatar[0]?.path;
    // When "coverImage" is absent
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }


    // Checking if "avatar" is received or not.
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }
    // We are not checking for "coverImage" as it does not matter for for us if it is uploaded or not.


    // Upload to "cloudinary"
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    // From the "response" that we have returned from cloudinary. Checking if the "avatar" is uploaded successfully or not.
    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }

    // Now, entering User in the DataBase
    const user = await User.create({
        fullName,
        avatar: avatar.url,// Storing the url of "avatar" on "cloudinary"
        coverImage: coverImage?.url || "",// Since, "coverImage" is not necessarily required for us. So, we have not not validated the "coverImage". Therefore, it might be possible that "user" have not uploaded the "coverImage". So, This field should be "empty".
        email,
        password,
        username: username.toLowerCase()
    })

    // Checking if the user is created successfully and removing password and refreshToken field using chaining.
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    // Now, checking if user is created or not
    if (!createdUser) {
        console.log("Checking if User is CREATED or NOT!");
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

});

export {
    registerUser,
}





















// MY CODE:

/* import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

let count = 0;
const registerUser = asyncHandler(async (req, res) => {
    // Steps to register
    
    // 1. Get user details from frontend
    // 2. validation - fields not empty, etc.
    // 3. check if user already exist: username, email
    // 4. check for images, check for avatar
    // 5. upload images to cloudinary, avatar
    // 6. create user object - create entry in DB 
    // 7. remove password and refresh token field from response sent by DB after creation
    // 8. check for user successfull creation
    // 9. return response
    


    // 1. handling request data(when in json form or from a "form") sent from client side. 
    if (count === 0) {
        console.log("Received the data in registerUser", req.body);
        const { fullName, email, username, password } = req.body;
        console.log("email: ", email);
        console.log("Count: ", count);
        count = count + 1;
    } else {
        console.log("Count: ", count);
    }
    console.log("Printed count: ", count);

    // validation
    // We can do like this👇🏼(i.e. using if-else-if)
    if (fullName === "") {
        throw new ApiError(400, "Full name is required");
    }

    // More professional way
    console.log("Entered checking fields:")
    if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required!");
    }
    // We can add more validations

    // Check if user already exist
    const existedUser = await User.findOne({ // MongoDB query 
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, `User ${username} already exist`);
    }

    // Since, we have used "multer" middleware so we have access to files.
    // Getting the path of the files that we have uloaded on our own server using "multer" temporarily.
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files.coverImage[0]?.path;

    // Checking if "avatar" is received or not.
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required");
    }
    // We are not checking for "coverImage" as it does not matter for for us if it is uploaded or not.


    // Upload to "cloudinary"
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    // From the "response" that we have returned from cloudinary. Checking if the "avatar" is uploaded successfully or not.
    if (!avatar) {
        throw new ApiError(400, "Avatar is required");
    }

    // Now, entering User in the DataBase
    const user = await User.create({
        fullName,
        avatar: avatar.url, // Storing the url of "avatar" on "cloudinary"
        coverImage: coverImage?.url || "", // Since, "coverImage" is not necessarily required for us. So, we have not not validated the "coverImage". Therefore, it might be possible that "user" have not uploaded the "coverImage". So, This field should be "empty".
        email,
        password,
        username: username.toLowerCase()
    })

    // Checking if the user is created successfully and removing password and refreshToken field using chaining. 
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );
    // Now, checking if user is created or not
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong registering the user");
    }

    console.log(`Count: ${count}\nRegistered successfully`);

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )


})

export { registerUser }; */