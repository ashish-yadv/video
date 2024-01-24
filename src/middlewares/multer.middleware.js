import multer from "multer";


// Creating a middleware to locally store file temporarily on our own server.
// We will be using "disk storage"
const storage = multer.diskStorage({
    // cb -> callback
    destination: function (req, file, cb) {
        cb(null, "./public/temp"); // We are stroring the file in public/temp
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

export const upload = multer({
    storage,
})