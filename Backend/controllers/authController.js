import bycript from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../Models/userModel.js';

export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Missing Important Details" });
    }
    try {

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            res.json({ success: false, message: "User already Exists" });
        }
        const hashedPassword = await bycript.hash(password, 10);

        const user = new userModel({name, email, password:hashedPassword});
        await user.save();

        const token = jwt.sign({id: user._id}, process.env.Secret_Key,{expiresIn:'10d'});

        res.cookie('token', token, {
            httpOnly:true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production'? 'none' : 'strict',
            maxAge: 10*24*60*60*1000
        });

    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}