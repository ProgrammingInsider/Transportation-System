// MODULES
import 'express-async-errors';
import express from 'express'
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv'
dotenv.config();
const app = express();

// DATABASE
import { Db_connection } from './Db/connection.js';

// ROUTES
import router from './Routes/routes.js';

// SECURITY PACKAGES
import helmet from 'helmet';
import cors from 'cors'
import xss from 'xss-clean'
import rateLimiter from 'express-rate-limit'

// MIDDLEWARE
import notFound from './middleware/not-found.js';
import errorHandlerMiddleware from "./middleware/error-handling.js";
import {profileAuth} from './middleware/Auth.js'
import corsOptions from './Config/corsOptions.js';
import credentials from './middleware/credentials.js';

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials)

// Cross Origin Resource Sharing
app.use(cors(corsOptions))

Db_connection()

// app.use(cors({
//     origin: '*',
//     methods: ['GET', 'POST', 'PUT', 'DELETE','OPTIONS'],
//     allowedHeaders: '*'
// }))
app.use(express.json()); 
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());

app.set('trust proxy',1) //TO enable if we are behind a reverse proxy to use rate Limiter

       app.use(
        rateLimiter({
                windowMs:15*60*1000, //15 Minutes
                max:100 //Limit each Ip to 100 request per windows
            })
        )
        
        app.use(helmet())
        app.use(xss())

    // Middleware to check tokens
        // app.use(profileAuth)
        
        // app.use("/api/v1/transportation_system/",router)
        app.use("/api",router)
        app.use(notFound)
        app.use(errorHandlerMiddleware)
        
        const Port = process.env.PORT || 5000
        
        
        app.listen(Port,()=>{
            console.log(`Server is running on port ${Port}`);
        });    
        