import slugify from "slugify";
import productModel from "../models/product.js";
import fs from 'fs';

export const createProductController = async (req, res) => {
    try {
        const { name, description, price, category, quantity } = req.fields;
        const { photo } = req.files;

        // validation
        switch (true) {
            case !name: {
                return res.status(500).send({ error: 'Name is required' })
            }
            case !description: {
                return res.status(500).send({ error: 'description is required' })
            }
            case !price: {
                return res.status(500).send({ error: 'price is required' })
            }
            case !category: {
                return res.status(500).send({ error: 'category is required' })
            }
            case !quantity: {
                return res.status(500).send({ error: 'quantity is required' })
            }
            case !photo && photo.size > 1000000: {
                return res.status(500).send({ error: 'photo is required and should be less than 1mb' })
            }
        }

        const product = new productModel({ ...req.fields, slug: slugify(name) })
        if (photo) {
            product.photo.data = fs.readFileSync(photo.path)
            product.photo.contentType = photo.type;
        }
        await product.save();
        res.status(201).send({ success: true, message: "product created successfully", product })
    } catch (err) {
        console.log("Error in createProductController", err)
        res.statue(500).send({
            success: false,
            err,
            message: 'Error in createProductController'
        })
    }
}


export const updateProductController = async (req, res) => {
    try {
        console.log("Received Data:", req.fields, req.files); // ✅ Debugging
        const { name, description, price, category, quantity } = req.fields;
        const { photo } = req.files;

        // validation
        switch (true) {
            case !name: {
                return res.status(500).send({ error: 'Name is required' })
            }
            case !description: {
                return res.status(500).send({ error: 'description is required' })
            }
            case !price: {
                return res.status(500).send({ error: 'price is required' })
            }
            case !category: {
                return res.status(500).send({ error: 'category is required' })
            }
            case !quantity: {
                return res.status(500).send({ error: 'quantity is required' })
            }
            case photo && photo.size > 1000000: {
                return res.status(500).send({ error: 'photo is required and should be less than 1mb' })
            }
        }

        const product = await productModel.findByIdAndUpdate(req.params.id, { ...req.fields, slug: slugify(name) }, { new: true })
        if (!product) {
            return res.status(404).send({ error: "Product not found" });
        }
        if (photo) {
            product.photo.data = fs.readFileSync(photo.path)
            product.photo.contentType = photo.type;
        }
        await product.save();
        res.status(201).send({ success: true, message: "product updated successfully", product })

    } catch (err) {
        console.log("Error in updateProductController", err)
        res.status(500).send({
            success: false,
            err,
            message: 'Error in updateProductController'
        })
    }
}


export const getAllProductController = async (req, res) => {
    try {
        const products = await productModel.find({}).populate('category').select("-photo").limit(12).sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            message: "Letest 12 products are here",
            total: products.length,
            products
        })
    } catch (err) {
        console.log("Error in getAllProductController", err)
        res.statue(500).send({
            success: false,
            err,
            message: 'Error in getAllProductController'
        })
    }
}


export const getSingleProductController = async (req, res) => {
    try {
        const product = await productModel.findOne({ slug: req.params.slug }).select("-photo").populate("category");
        res.status(200).send({
            success: true,
            message: "getting single proguct",
            product
        })

    } catch (err) {
        console.log("Error in getSingleProductController", err)
        res.statue(500).send({
            success: false,
            err,
            message: 'Error in getSingleProductController'
        })
    }
}


export const deleteProductController = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.id).select("-photo")
        res.status(200).send({
            success: true,
            message: "Product Deleted Successfilly"
        })
    } catch (err) {
        console.log("Error in deleteProductController", err)
        res.statue(500).send({
            success: false,
            err,
            message: 'Error in deleteProductController'
        })
    }
}

export const productPhotoController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.pid).select("photo");
        if (product.photo.data) {
            res.set('Content-type', product.photo.contentType)
            return res.status(200).send(product.photo.data)
        }
    } catch (err) {
        console.log("Error in productPhotoController", err)
        res.status(500).send({
            success: false,
            err,
            message: 'Error in productPhotoController'
        })
    }
}

export const productFiltersController = async (req, res) => {
    try {
        const { checked, radio } = req.body;
        let args = {}
        if (checked.length > 0) args.category = checked
        if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] }
        const products = await productModel.find(args)
        res.status(200).send({
            success: true,
            products,
        })
    } catch (err) {
        console.log("Error in productFiltersController", err)
        res.status(500).send({
            success: false,
            err,
            message: 'Error in productFiltersController',
        })
    }
}


// load more controller
export const productCountController = async (req, res) => {
    try {
        const total = await productModel.find({}).estimatedDocumentCount()
        res.status(200).send({
            success: true,
            total
        })
    } catch (err) {
        console.log("Error in productCountController", err)
        res.status(500).send({
            success: false,
            err,
            message: 'Error in productCountController',
        })
    }
}

export const productListController = async (req, res) => {
    try {
        const perPage = 2;
        const page = req.params.page ? req.params.page : 1;
        const products = await productModel.find({})
            .select("-photo")
            .skip((page - 1) * perPage)
            .limit(perPage)
            .sort({ createdAt: -1 });
            res.status(200).send({
                success: true,
                products
            })
    } catch (err) {
        console.log("Error in productListController", err)
        res.status(500).send({
            success: false,
            err,
            message: 'Error in productListController',
        })
    }
}

export const searchProductController = async (req, res) => {
    try {
        const { keyword } = req.params;
        const result = await productModel.find({
            $or: [
                { name: { $regex: keyword, $options: "i" } },  // Fixed $options
                { description: { $regex: keyword, $options: "i" } }
            ]
        }).select("-photo");

        res.json(result);
    } catch (err) {
        console.log("Error in searchProductController", err);
        res.status(500).send({
            success: false,
            err,
            message: "Error in searchProductController",
        });
    }
};


export const relatedProductController = async(req,res) => {
    try{
        const {cid,pid} = req.params;
        const products = await productModel.find({category:cid,
            _id:{$ne:pid}
        }).select("-photo").limit(3).populate("category");
        res.status(200).send({
            success:true,
            message:"Related Product Found Successfully",
            products
        })
    }catch(err){
        console.log("Error in relatedProductController",err);
        res.status(500).send({
            success:false,
            err,
            message:"Error in relatedProductController"
        })
    }
}