import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { Checkbox, Radio } from 'antd'
import { Prices } from "../components/Prices.js";
import { useNavigate } from "react-router-dom";
import {useCart} from '../context/cart.jsx'
import { toast } from "react-toastify";

const HomePage = () => {
  const navigate = useNavigate();
  const [cart,setCart] = useCart();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // get products
  const getAllProduct = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts(data.products);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  }
  useEffect(() => {
    getAllProduct()
  }, [])

  // get all categories
  const getAllCategories = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/category/get-category`)
      if (data?.success) {
        setCategory(data?.category);
      }
    } catch (err) {
      console.log(err);
    }
  }

  // filter by cat
  const handleFilter = (value, id) => {
    let all = [...checked]
    if (value) {
      all.push(id)
    } else {
      all = all.filter(c => c !== id)
    }
    setChecked(all);
  }

  useEffect(() => {
    if (!checked.length || !radio.length) getAllCategories();
  }, [checked.length, radio.length])

  useEffect(() => {
    if (checked.length || radio.length) filterProduct();
  }, [checked, radio])

  // get filtered products
  const filterProduct = async () => {
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/product/product-filter`, { checked, radio })
      setProducts(data?.products)
    } catch (err) {
      console.log(err);
    }
  }

  // get total count

  const getTotal = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/product/product-count`)
      setTotal(data?.total)
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page])

  // load more
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/product/product-list/${page}`)
      setLoading(false);
      setProducts([...products, ...data?.products])
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  }

  useEffect(() => {
    getTotal();
  }, [])

  return (
    <Layout title={'All Product - Besr offers'}>
      <div className="row mt-3">
        <div className="col-md-3">
          {/* {JSON.stringify(radio,null,4)} */}
          <h4 className="ms-5 mt-2">Filter By Price</h4>
          <div className="d-flex flex-column ms-5 mt-4">
            <Radio.Group onChange={e => setRadio(e.target.value)}>
              {Prices?.map(p => (
                <div className="" key={p._id}>
                  <Radio value={p.array}>{p.name}</Radio>
                </div>
              ))}
            </Radio.Group>
          </div>
          <h4 className="ms-5 mt-2">Filter By Category</h4>
          <div className="d-flex flex-column ms-5 mt-4">
            {category?.map(c => (
              <Checkbox key={c._id} onChange={(e) => handleFilter(e.target.checked, c._id)}>
                {c.name}
              </Checkbox>
            ))}
          </div>
          <div className="d-flex flex-column ms-5 mt-4">
            <button className="btn btn-danger me-5" onClick={() => window.location.reload()}>Reset Filters</button>
          </div>
        </div>
        
        <div className="col-md-9">
          <h1>All Products</h1>
          <div className="d-flex flex-wrap">
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
                      <p className="card-text">{p.description.substring(0, 30)}...</p>
                    </div>
                    <div className="button-group">
                      <button className="btn btn-primary" onClick={() => navigate(`/product/${p.slug}`)}>More Details</button>
                      <button className="btn btn-secondary" onClick={() => {setCart([...cart,p])
                      localStorage.setItem('cart',JSON.stringify([...cart,p]))
                        toast.success("Item Added to cart")
                      }}>Add to Cart</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="m-2 p-3">
            {
              products && products.length < total && (
                <button className="btn btn-warning" onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);
                }}>
                  {loading ? "Loading..." : "Lodemore"}
                </button>
              )
            }
          </div>


        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
