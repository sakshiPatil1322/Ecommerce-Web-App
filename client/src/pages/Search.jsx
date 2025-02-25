import Layout from '../components/Layout/Layout' 
import React from 'react'
import { useSearch } from '../context/Search'

const Search = () => {
    const [value, setValue] = useSearch()
    return (
        <Layout title='Search results'>
            <div className="container">
                <div className="text-center">
                    <h1>Search Results</h1>
                    <h6>{value?.result.length < 1 ? 'No Products Found' : `Found ${value?.result.length}`}</h6>

                    <div className="d-flex flex-wrap mt-4">
                        <div className="card-container">
                            {value?.result.map((p) => (
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
                                            <button className="btn btn-primary" onClick={() => handleUpdate(p.slug)}>More Details</button>
                                            <button className="btn btn-secondary" onClick={() => handleDelete(p._id)}>Add to Cart</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>


                </div>
            </div>
        </Layout>
    )
}

export default Search
