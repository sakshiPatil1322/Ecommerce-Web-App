import jwt from "jsonwebtoken"
import userModel from "../models/userModel.js"

// Protected route
export const requireSignIn = async (req,res,next) => {
    try{
        const decode = jwt.verify(req.headers.authorization,process.env.JWT_SECRET);
        req.user = decode;
        next();
    }catch(err){
        console.log(`error in requireSignIn middleware ${err}`.bgRed.white)
    }
}

// admin access
export const isAdmin = async (req,res,next) => {
    try{
        const user = await userModel.findById(req.user._id);
        if(!user){
            return res.send({message:"no user found in isAdmin middleware"})
        }
        if(user.role===1){
            next();
        }
    }catch(err){
        console.log(`error in isAdmin middleware ${err}`.bgRed.white)
    }
}