import express from 'express'
import {registerController,updateProfileController,loginController,forgotPasswordController} from '../controller/authController.js'
import {requireSignIn} from '../middlewares/authMiddleware.js'
import { isAdmin } from '../middlewares/authMiddleware.js';
// router object
const router = express.Router();

// routing
// Register || Method POST
router.post('/register',registerController);

// Login
router.post('/login',loginController);

// Forgot Password
router.post('/forgot-password',forgotPasswordController)

// Protected Route for user
router.get('/user-auth' , requireSignIn , (req,res) => {
    res.status(200).send({ok:true})
})

// Protected Route for admin
router.get('/admin-auth' , requireSignIn , isAdmin , (req,res) => {
    res.status(200).send({ok:true})
})

router.put('/profile',requireSignIn,updateProfileController)

// exporting router
export default router;