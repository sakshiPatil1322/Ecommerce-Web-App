import React, { useState, useEffect } from 'react'
import AdminMenu from '../../components/Layout/AdminMenu'
import Layout from '../../components/Layout/Layout'
import { toast } from "react-toastify";
import axios from 'axios';
import { Select } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Option } = Select

const CreateProduct = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState();
    const [photo, setPhoto] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [shipping, setShipping] = useState("");

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
        const handleCreate = async(e) => {
            e.preventDefault();
            try{
                const productData = new FormData()
                productData.append("name",name);
                productData.append("description",description);
                productData.append("price",price);
                productData.append("quantity",quantity);
                productData.append("photo",photo);
                productData.append("category",category);
                const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/product/create-product`,productData);
                if(data?.success){
                    toast.success('Prodect created successfully')
                    navigate('/dashboard/admin/products')
                }else{
                    toast.error(data?.message);
                }
            }catch(err){
                console.log(err);
            toast.error("Something went wrong in Creating Product");
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
                        <h1>Create Product</h1>
                        <div className="m-1 w-75">
                            <Select bordered={false} placeholder="Select a Category"
                                size="large" showSearch className='form-select mb-3' onChange={(value) => {
                                    setCategory(value);
                                }}>
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
                                {photo && (
                                    <div className="text-center">
                                        <img src={URL.createObjectURL(photo)} alt="product photo" 
                                        height={'200px'} className='img img-responsive' />
                                    </div>
                                )}
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
                                >
                                    <option value="1">Yes</option>
                                    <option value="0">No</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <button className='btn btn-primary' onClick={handleCreate} >Create Product</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default CreateProduct
