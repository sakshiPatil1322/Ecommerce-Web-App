import userModel from "../models/userModel.js"
import {comparePassword, hashPassword} from "../helpers/authHelper.js"
import jsonwebToken from "jsonwebtoken"

export const registerController = async (req,res) => {
    try{
        const {name,email,password,phone,address,question} = req.body;
        if(!name || !email || !password || !phone || !address || !question){
            return res.send({message:"all fields are required"})
        }

        // exisiting user
        const user = await userModel.findOne({email})
        if(user){
            return res.send({success : false,message : "User allready exist"});
        }

        // user registration
        const hashedPassword = await hashPassword(password)
        const newUser = await new userModel({name,email,password:hashedPassword,phone,address,question}).save()
        res.status(201).send({success : true,message: "User created Successfully",newUser})
    }catch(err){
        console.log(`error in registerController ${err}`.bgRed.white)
    }
}


export const loginController = async (req,res) => {
    try{
        const {email,password} = req.body;

        // validation
        if(!email || !password){
            return res.status(404).send({success:false,message:"Invalid email or password"});
        }
        // check user
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(404).send({message:"user not found",success:false})
        }

        const match = await comparePassword(password,user.password)
        if(!match){
            return res.status(400).send({message:"Invalid password",success:false})
        }
        // token generation
        const token = await jsonwebToken.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'});
        res.status(200).send({success:true,message:"login successfully",
            user:{
            _id: user._id,
            name: user.name,
            email:user.email,
            phone:user.phone,
            address:user.address,
            role:user.role,
        },token})
    }catch(err){
        console.log(`error in loginController ${err}`.bgRed.white)  
        return res.send({message:"Something Wrong",success:false})    
    }
}

// Handler for forgo-password

export const forgotPasswordController = async(req,res) => {
    try{
        const {email,question,newPassword} = req.body
        if(!email||!question||!newPassword){
            res.status(400).send({message:'All fields are required'})
        }
        // check
        const user = await userModel.findOne({email,question})
        if(!user){
            return res.status(404).send({
                success:false,
                message:'Wrong Email or Answer'
            })
        }
        const hashed = await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id,{password:hashed})
        res.status(200).send({
            success:true,
            message:"Password Reset Successfully"
        })
    }catch(err){
        console.log(err)
        res.status(500).send({
            success:false,
            message:'Something went wrong',
            err
        })
    }
}

export const updateProfileController = async(req,res) => {
    try{
        const {name,password,address,phone} = req.body
        const user = userModel.findById(req.user._id,)
        // password
        if(password && password.length < 6){
            return res.json({error:"Password is required and 6 character long"})
        }
        const hashedPassword = password ? await hashPassword(password) : undefined
        const updatesUser = await userModel.findByIdAndUpdate(req.user._id,{
            name:name || user.name,
            email:user.email,
            password:hashedPassword ||user.password,
            address:address || user.address,
            phone:phone || user.phone},
            {new:true})
            res.status(200).send({
                success:true,
                message:"Profile Updated Successfully",
                updatesUser
            })
    }catch(err){
        console.log(err)
        res.status(500).send({
            success:false,
            message:'Something wrong in updateProfileController',
            err
        })
    }
}