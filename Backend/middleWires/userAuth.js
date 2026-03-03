import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next)=>{
    const {token} = req.cookies;

    if(!token){
        return res.status(400).json({ success: false, message: "Not Authorized. Login Again" });
    }
    try{
       const decodedToken = jwt.verify(token, process.env.Secret_Key);
        if (decodedToken.id) {
            // Attach authenticated user info to request object in a safe way
            // avoid relying on `req.body` because it may be undefined (e.g. no JSON payload).
            // `req.user` or a dedicated `req.userId` is preferable.
            if (!req.user) req.user = {};
            req.user.id = decodedToken.id;
            // also maintain backwards compatibility for controllers that still expect userId in body
            if (!req.body) req.body = {};
            req.body.userId = decodedToken.id;
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