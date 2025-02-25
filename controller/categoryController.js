import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";

export const createCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(402).send({ message: 'Name is Required' })
        }

        const existingCategory = await categoryModel.findOne({ name });
        if (existingCategory) {
            return res.status(200).send({
                success: true,
                message: 'Category Already Exist'
            })
        }

        const category = await new categoryModel({ name, slug: slugify(name) }).save()
        res.status(201).send({
            success: true,
            message: 'New Category Created',
            category
        })

    } catch (err) {
        console.log("Error in createCategoryController", err)
        res.status(500).send({
            success: false,
            err,
            message: 'Error in Category'
        })
    }
}

export const updateCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        const { id } = req.params;
        const category = await categoryModel.findByIdAndUpdate(id, { name, slug: slugify(name) }, { new: true })
        res.status(200).send({
            success: true,
            messahe: 'Category Updated Successfully',
            category
        })
    } catch (err) {
        console.log("Error in updateCategoryController", err)
        res.status(500).send({
            success: false,
            err,
            message: 'Error in Category'
        })
    }
}

// delete category controller
export const deleteCategoryController = async (req, res) => {
    try {
        const { id } = req.params;
        await categoryModel.findByIdAndDelete(id);
        res.status(200).send({
            success: true,
            message: "Category deleted successfully",
        })
    } catch (err) {
        console.log("Error in deleteCategoryController", err)
        res.status(500).send({
            success: false,
            err,
            message: 'Error in Category'
        })
    }
}

// getting all Categories
export const getAllCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.find({});
        res.status(200).send({
            success: true,
            message: "Getting All Categegory",
            category
        })
    } catch (err) {
        console.log("Error in grtAllCategoryController", err)
        res.status(500).send({
            success: false,
            err,
            message: 'Error in Category'
        })
    }
}

// getting single category
export const getSingleCategoryController = async (req, res) => {
    try {
        const { slug } = req.params;
        const category = await categoryModel.findOne(slug);
        res.status(200).send({
            success:true,
            message:"geteing single category",
            category
        })
    } catch (err) {
        console.log("Error in grtAllCategoryController", err)
        res.status(500).send({
            success: false,
            err,
            message: 'Error in Category'
        })
    }
}
