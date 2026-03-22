import express from 'express';//express is a framwork for building backend API
import mongoose from 'mongoose';//translates between javaScript and mongoDB
import cors from 'cors';//allow front end(react) to talk to backend
import dotenv from 'dotenv';//loads environment variables form .env file

import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

const mongoURI = process.env.MONGO_URI || '';

if(!mongoURI)
{
    console.error("Cannot retrieve mongoURI from .env file");
    process.exit(1);
}

mongoose.connect(mongoURI)
.then(()=>{console.log("Connected to mongodb atlas");})
.catch((error)=>{console.error("Error connecting to mongodb atlas : ",error.message);});

app.get('/',(req,res)=>{
    res.send('Campus kernel API is running');
});

const PORT=process.env.PORT;
if(!PORT)
{
    console.log("Unable to retrieve port number form .env variables");
}
app.listen(PORT,()=>{console.log(`server is running on http://localhost:${PORT}`)});