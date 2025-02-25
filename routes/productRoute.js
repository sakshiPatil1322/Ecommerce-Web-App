import express from "express";
import {requireSignIn,isAdmin} from "../middlewares/authMiddleware.js";
import {createProductController,
    productCountController,productFiltersController,
    updateProductController,getAllProductController,
    getSingleProductController,deleteProductController,
    productPhotoController,productListController,
    searchProductController,relatedProductController} from '../controller/productController.js'
import formidable from 'express-formidable';

const router = express.Router();

// routes
router.post('/create-product',requireSignIn,isAdmin,formidable(),createProductController);
router.put('/update-product/:id',requireSignIn,isAdmin,formidable(),updateProductController);
router.get('/get-product',getAllProductController);
router.get('/single-product/:slug',getSingleProductController);
router.delete('/delete-product/:id',requireSignIn,isAdmin,deleteProductController);
router.get('/product-photo/:pid',productPhotoController);
router.post('/product-filter',productFiltersController);
router.get('/product-count',productCountController);
router.get('/product-list/:page',productListController);
router.get('/search/:keyword',searchProductController);
router.get('/related-product/:pid/:cid',relatedProductController);


export default router;