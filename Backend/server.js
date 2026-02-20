import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongoDB.js';

const app = express();
const port = process.env.PORT || 3000;

// wait for DB connection before starting the server
await connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials:true}));

app.get('/', (req,res)=>{
    res.send("Backend App Started");
});

app.listen(port, ()=>{
    console.log(`Server is listening on Port ${port}`); 
});