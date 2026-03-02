import userModel from "../Models/userModel.js";

export const getUserData = async (req, res) => {
    try {
        // support userId from body (POST) or from middleware `req.user.id` (recommended)
        const userId = (req.body && req.body.userId) || req.userId || (req.user && req.user.id);
        const user = await userModel.findById(userId);

        if (!user) {
           return res.json({ success: false, message: "User not Found" });
        }

        res.json({
            success:true,
            userData:{
                name: user.name,
                isAccountVerified: user.isAccountVerified
            }
        });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
}