import bycript from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../Models/userModel.js';
import transporter from '../config/nodemailer.js';
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from '../config/emailTemplates.js';

export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Missing Important Details" });
    }
    try {

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already Exists" });
        }
        const hashedPassword = await bycript.hash(password, 10);

        const user = new userModel({ name, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.Secret_Key, { expiresIn: '10d' });

        // cookies with SameSite=None require Secure flag; use lax during local development
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 10 * 24 * 60 * 60 * 1000
        };
        res.cookie('token', token, cookieOptions);

        // Sending Welcome Email
        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to Hall Management Website',
            text: `Welcome to RUET mail Hall One Website. Here You can see all the information of the website the account is created with the email: ${email}`,
        }
        await transporter.sendMail(mailOption);

        return res.json({ success: true, message: "User Registration Successful" });


    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ success: false, message: "Email and Password is required" });
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "Invalid email" });
        }
        const isMatch = await bycript.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid password" });
        }

        const token = jwt.sign({ id: user._id }, process.env.Secret_Key, { expiresIn: '10d' });

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 10 * 24 * 60 * 60 * 1000
        };
        res.cookie('token', token, cookieOptions);

        return res.json({ success: true, message: "User Login Successful" });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'none',
        });

        return res.json({ success: true, message: "User Logout Successful" });


    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

// Send Verification otp to user ID

export const sendVerifyOtp = async (req, res) => {
    try {
        // the middleware may populate either req.body.userId or req.user.id
        const userId = (req.body && req.body.userId) || (req.user && req.user.id) || req.userId;

        if (!userId) {
            return res.status(400).json({ success: false, message: "User id missing" });
        }

        const user = await userModel.findById(userId);
        if (user.isAccountVerified) {
            return res.status(400).json({ success: false, message: "Account is already verified" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.verifyOTP = otp;
        user.verifyOTPExpireAt = Date.now() + 24 * 60 * 60 * 1000;

        await user.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Verification OTP',
            // text: `Your OTP is ${otp}`
            html: EMAIL_VERIFY_TEMPLATE.replace("{{email}}",user.email).replace("{{otp}}",otp)
        }

        await transporter.sendMail(mailOption);
        return res.json({ success: true, message: "Verification OTP sent on email" });

    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

//Function to verify a specific user through otp
export const verifyEmail = async (req, res) => {
    // allow both body and middleware-provided userId
    const userId = (req.body && req.body.userId) || (req.user && req.user.id) || req.userId;
    const { otp } = req.body;

    if (!userId || !otp) {
        return res.json({ success: false, message: "Missing details" });
    }
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(400).json({ success: false, message: "User Not Found" });
        }
        if (user.verifyOTP === '' || user.verifyOTP !== otp) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }
        if (user.verifyOTPExpireAt < Date.now()) {
            return res.status(400).json({ success: false, message: "OTP Expired" });
        }
        user.isAccountVerified = true;
        user.verifyOTP = '';
        user.verifyOTPExpireAt = 0;

        await user.save();
        return res.json({ success: true });


    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

// User IS authenticated or not
export const isAuthenticated = (req, res) => {
    try {
    return res.json({ success: true });
    } catch (err) {
    return res.status(400).json({ message: err.message });
    }
}

// Sending email to reset otp
export const sendResetOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.json({ success: false, message: "Email is required" });
    }
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User Not Found" });
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.resetOTP = otp;
        user.resetOTPExpireAt = Date.now() + 15 * 60 * 1000;

        await user.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Reset OTP',
            // text: `Your Reset OTP is ${otp}`
            html: PASSWORD_RESET_TEMPLATE.replace("{{email}}",user.email).replace("{{otp}}",otp)

        }

        await transporter.sendMail(mailOption);
        return res.json({ success: true, message: "Verification OTP sent on email" });

    } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
}

// Reset Password Feature
export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(400).json({ success: false, message: "Fill the required field" });
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User not Found" });
        }
        if (user.resetOTP === '' || user.resetOTP !== otp) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }
        if (user.resetOTPExpireAt < Date.now()) {
            return res.status(400).json({ success: false, message: "OTP Expired" });
        }

        const hashedPassword = await bycript.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOTP = '';
        user.resetOTPExpireAt = 0;

        await user.save();

        return res.status(200).json({ success: true, message: "Password has been updated successfully" });


    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}