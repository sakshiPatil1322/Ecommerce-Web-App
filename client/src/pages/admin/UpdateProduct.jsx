import React, { useState, useEffect } from 'react'
import AdminMenu from '../../components/Layout/AdminMenu'
import Layout from '../../components/Layout/Layout'
import { toast } from "react-toastify";
import axios from 'axios';
import { Select } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateProduct = () => {

    const navigate = useNavigate();
    const params = useParams();
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState("");
    const [photo, setPhoto] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [shipping, setShipping] = useState("");
    const [id, setId] = useState("");

    // get single product
    const getSingleProduct = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/product/single-product/${params.slug}`)
            setName(data.product.name)
            setId(data.product._id);
            setDescription(data.product.description);
            setPrice(data.product.price)
            setQuantity(data.product.quantity)
            setShipping(data.product.shipping);
            setCategory(data.product.category._id);
        } catch (err) {
            console.log(err);
            toast.error("Something went wrong in getting Single Category");
        }
    }

    useEffect(() => {
        getSingleProduct();
    }, [])

    // getting all categories

    const getAllCategories = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/category/get-category`)
            if (data?.success) {
                setCategories(data?.category);
            }
        } catch (err) {
            console.log(err);
            toast.error("Something went wrong in getting Category");
        }
    }

    useEffect(() => {
        getAllCategories();
    }, [])

    // Create Product Function
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const productData = new FormData()
            productData.append("name", name);
            productData.append("description", description);
            productData.append("price", price);
            productData.append("quantity", quantity);
            photo && productData.append("photo", photo);
            productData.append("category", category);
            console.log("Sending Data:", productData.get("name")); // ✅ Correct way to check FormData

            const { data } = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/v1/product/update-product/${id}`, productData);
            if (data?.success) {
                toast.success('Prodect updated successfully')
                navigate('/dashboard/admin/products')
            } else {
                toast.error(data?.message);
            }
        } catch (err) {
            console.log(err);
            toast.error("Something went wrong in Updating Product");
        }
    }

    return (
        <Layout title={"Dashboard - create-product"}>
            <div className="container-fluid m-3 p-3">
                <div className='row'>
                    <div className="col-md-3">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        <h1>Update Product</h1>
                        <div className="m-1 w-75">
                            <Select bordered={false} placeholder="Select a Category"
                                size="large" showSearch className='form-select mb-3' onChange={(value) => {
                                    setCategory(value);
                                }}
                                value={category}>
                                {categories?.map(c => (
                                    <Option key={c._id} value={c._id}>{c.name}</Option>
                                ))}
                            </Select>
                            <div className="mb-3">
                                <label className='btn btn-outline-secondary col-md-12'>
                                    {photo ? photo.name : "Upload Photo"}
                                    <input type='file' name='photo' accept='image/*'
                                        onChange={(e) => setPhoto(e.target.files[0])} hidden />
                                </label>
                            </div>
                            <div className="mb-3">
                                {photo ? (
                                    <div className="text-center">
                                        <img src={URL.createObjectURL(photo)} alt="product photo"
                                            height={'200px'} className='img img-responsive' />
                                    </div>
                                ) :
                                    (
                                        <div className="text-center">
                                            <img src={`${import.meta.env.VITE_API_BASE_URL}/api/v1/product/product-photo/${id}`} alt="product photo"
                                                height={'200px'} className='img img-responsive' />
                                        </div>
                                    )
                                }
                            </div>
                            <div className="mb-3">
                                <input type="text" value={name} placeholder='write a name'
                                    className='form-control'
                                    onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <textarea
                                    value={description}
                                    placeholder="Write a description"
                                    className="form-control"
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                />
                            </div>

                            <div className="mb-3">
                                <input type="number" value={price} placeholder='write a price'
                                    className='form-control'
                                    onChange={(e) => setPrice(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <input type="number" value={quantity} placeholder='write a Quantity'
                                    className='form-control'
                                    onChange={(e) => setQuantity(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <select
                                    placeholder="Select Shipping"
                                    border={false}
                                    size="large"
                                    showSearch
                                    className="form-select mb-3"
                                    onChange={(value) => setShipping(value)}
                                    value={shipping ? "yes" : "No"}
                                >
                                    <option value="1">Yes</option>
                                    <option value="0">No</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <button className='btn btn-primary' onClick={handleUpdate} >Update Product</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default UpdateProduct
