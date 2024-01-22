// require('dotenv').config({path: './env'});
import dotenv from 'dotenv';
import connectDB from './db/index.js';


// We configure 'dotenv' in main file so that the environment(env) variables are available everwhere.
// configure dotenv:
dotenv.config({
    path: './env'
});


connectDB();


// Connecting database in index.js file is not best practice, and also not modular. So, it becomes difficult to manage code base. Therefore, make connection to database in different folder.
// Important Note:
/*
1. There can always be problems connecting to DataBase. So, always use "try catch OR promises". Handle the errors properly.

2. Database can be anywhere so, always use "async await".
*/
// It's an special type of function which executes immediately:
/* (async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        app.on('error', (error) => {
            console.log('ERRR: ', error);
        })

        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`)
        })

    } catch (error) {
        console.error("Error: ", error);
        throw error;
    }
})()
*/