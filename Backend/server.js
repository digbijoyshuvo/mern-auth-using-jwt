import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongoDB.js';
import authRouter from './routes/authRoutes.js'
import userRouter from './routes/userRoutes.js';

const app = express();
const port = process.env.PORT || 3000;

// wait for DB connection before starting the server
await connectDB();

const allowedOrigins = ['http://localhost:5173']

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:allowedOrigins, credentials:true}));

app.get('/', (req,res)=>{
    res.send("Backend App Started");
});

app.use('/api/auth',authRouter);
app.use('/api/user',userRouter);
app.listen(port, ()=>{
    console.log(`Server is listening on Port ${port}`); 
});