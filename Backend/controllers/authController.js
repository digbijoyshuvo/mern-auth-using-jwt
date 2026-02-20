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

        const user = new userModel({ name, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.Secret_Key, { expiresIn: '10d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 10 * 24 * 60 * 60 * 1000
        });

        return res.json({ success: true, message: "User Registration Successful" });


    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.json({ success: false, message: "Email and Password is required" });
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            res.json({ success: false, message: "Invalid email" });
        }
        const isMatch = await bycript.compare(password, user.password);
        if (!isMatch) {
            res.json({ success: false, message: "Invalid password" });
        }

        const token = jwt.sign({ id: user._id }, process.env.Secret_Key, { expiresIn: '10d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 10 * 24 * 60 * 60 * 1000
        });

        return res.json({ success: true, message: "User Login Successful" });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

export const logout = async (req, res) =>{
    try{
        res.clearCookie('token',{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });

        return res.json({ success: true, message: "User Logout Successful" });


    }catch (err) {
        return res.status(400).json({ message: err.message });
    }
}