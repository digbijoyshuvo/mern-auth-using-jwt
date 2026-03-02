import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next)=>{
    const {token} = req.cookies;

    if(!token){
        return res.status(400).json({ success: false, message: "Not Authorized. Login Again" });
    }
    try{
       const decodedToken = jwt.verify(token, process.env.Secret_Key);
        if (decodedToken.id) {
            // attach authenticated user info to `req.user` instead of mutating `req.body`
            if (!req.user) req.user = {};
            req.user.id = decodedToken.id;
        } else {
            return res.status(400).json({ success: false, message: "Not Authorized. Login Again" });
        }
        next();

    }catch (err) {
        console.log(err.message);
        
        return res.status(400).json({ message: err.message });
    }
}

export default userAuth;