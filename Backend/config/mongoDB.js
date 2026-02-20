import mongoose from "mongoose";

const connectDB = async () =>{

    mongoose.connection.on('connected' ,()=>{
        console.log('Database Connected'); 
    });

    const mongoUrl = process.env.MongoDB_URL;
    if (!mongoUrl) {
        console.error('MongoDB connection string `process.env.MongoDB_URL` is not set.');
        process.exit(1);
    }

    try {
        await mongoose.connect(`${mongoUrl}/mern-auth`);
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err.message || err);
        process.exit(1);
    }

}

export default connectDB;