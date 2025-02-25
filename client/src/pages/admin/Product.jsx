import React, { useState, useEffect } from 'react'
import AdminMenu from '../../components/Layout/AdminMenu'
import Layout from '../../components/Layout/Layout'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


const Product = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    // getting all products

    const getAllProduct = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/product/get-product`);
            setProducts(data.products);
        } catch (err) {
            console.log(err);
            toast.error("Something went wrong in Getting All Products");
        }
    }

    useEffect(() => {
        getAllProduct();
    }, [])

    const handleUpdate = (slug) => {
        navigate(`/dashboard/admin/update-product/${slug}`);
    }

    const handleDelete = async (id) => {
        try {
            let answer = window.prompt("Are you Sure to delete this product ?  if yes type 'yes' otherwise type 'No'");
            if(answer !== "yes") return;
            const { data } = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/v1/product/delete-product/${id}`);
            if (data.success) {
                toast.success(data.message);
                getAllProduct();
            } else {
                toast.error(data.message)
            }
        } catch (err) {
            console.log(err);
            toast.error('Something went wrong in Delete Product')
        }
    }

    return (
        <Layout>
            <div className="container-fluid m-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        <h1 className="text-center">All Product List</h1>
                        <div className="d-flex">

                            <div className="card-container">
                                {products.map((p) => (
                                    <div className="card m-2 product-card" key={p._id}>
                                        <div className="image-container">
                                            <img
                                                src={`${import.meta.env.VITE_API_BASE_URL}/api/v1/product/product-photo/${p._id}`}
                                                className="product-image"
                                                alt={p.name}
                                            />
                                        </div>
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <h5 className="card-title text-purple">{p.name}</h5>
                                                <p className="text-orange price-tag">Rs {p.price}</p>
                                            </div>
                                            <div className="description-box">
                                                <p className="card-text">{p.description}</p>
                                            </div>
                                            <div className="button-group">
                                                <button className="btn btn-warning" onClick={() => handleUpdate(p.slug)}>Update</button>
                                                <button className="btn btn-danger" onClick={() => handleDelete(p._id)}>Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>



                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Product
