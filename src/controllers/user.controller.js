// We have written an helper file(asyncHandler)
import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {

    // Steps to register
    /*
    1. Get user details from frontend
    2. validation - fields not empty, etc.
    3. check if user already exist: username, email
    4. check for images, check for avatar
    5. upload images to cloudinary, avatar
    6. create user object - create entry in DB 
    7. remove password and refresh token field from response sent by DB after creation
    8. check for user successfull creation
    9. return response
    */



    // 1. handling request data(when in json form or from a "form") sent from client side. 
    console.log("Received the data in requestUser", req);
    const { fullName, email, username, password } = req.body;
    console.log("email: ", email);
})

export { registerUser };