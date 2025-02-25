import Layout from '../components/Layout/Layout'
import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const ProductDetails = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [product, setProduct] = useState({});
    const [relatedProduct, setRelatedProduct] = useState([]);

    const getProduct = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/product/single-product/${params.slug}`)
            setProduct(data?.product);
            getSimilerProduct(data?.product._id, data?.product.category._id)
        } catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        if (params?.slug) getProduct();
    }, [params?.slug])

    // get similler product
    const getSimilerProduct = async (pid, cid) => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/product/related-product/${pid}/${cid}`);
            setRelatedProduct(data?.products);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <Layout>
            <div className="row container mt-5">
                <div className="col-md-6 text-center">
                    <div className="h-75 w-50 text-center">
                        <img
                            src={`${import.meta.env.VITE_API_BASE_URL}/api/v1/product/product-photo/${product._id}`}
                            className="product-image h-100 w-100"
                            alt={product.name}
                        />
                    </div>
                </div>
                <div className="col-md-6">
                    <h1>Product Details</h1>
                    <h6>Name : {product?.name}</h6>
                    <h6>Description : {product?.description}</h6>
                    <h6>Price : {product?.price}</h6>
                    <h6>Category : {product?.category?.name}</h6>
                    <h6>Shipping : {product.shipping ? "True" : "False"}</h6>
                    <button className="btn btn-secondary mt-5" onClick={() => handleDelete(p._id)}>Add to Cart</button>
                </div>
            </div>
            <div className="row container">
                <h1>Similar Product</h1>
                {relatedProduct.length < 1 && (<p className='text-center pt-5'>No Similar product found</p>)}
                <div className="d-flex flex-wrap">
                    <div className="card-container">
                        {relatedProduct.map((p) => (
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
                                        <p className="card-text">{p.description.substring(0, 30)}...</p>
                                    </div>
                                    <div className="button-group">
                                        <button className="btn btn-primary" onClick={() => navigate(`/product/${p.slug}`)}>More Details</button>
                                        <button className="btn btn-secondary" onClick={() => handleDelete(p._id)}>Add to Cart</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </Layout>
    )
}

export default ProductDetails
