import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import { createCategoryController, updateCategoryController,deleteCategoryController,getAllCategoryController,getSingleCategoryController } from "../controller/categoryController.js";

const router = express.Router();

// routes

// create category
router.post("/create-category", requireSignIn, isAdmin, createCategoryController);

// update category
router.put('/update-category/:id', requireSignIn, isAdmin, updateCategoryController);

// Delete category
router.delete('/delete-category/:id',requireSignIn,isAdmin,deleteCategoryController)

// Get all categorys
router.get('/get-category',getAllCategoryController);

// geting perticular category
router.get('/single-category/:slug',getSingleCategoryController);

export default router;

