import React, { useState } from 'react'
import {useSearch} from "../../context/Search"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SearchInput = () => {
    const [value,setValue] = useSearch();
    const navigate = useNavigate()
    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            const {data} = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/product/search/${value.keyword}`)
            setValue({...value,result:data})
            navigate('/search');
        }catch(err){
            console.log(err)
        }
    }
  return (
    <div>
      <form action="" className="d-flex" role='search' onSubmit={handleSubmit}>
        <input value={value.keyword} 
        type="search" placeholder='Search' 
        aria-label='Search' 
        className="form-control me-2" 
        style={{ width: "100%" }}
        onChange={(e) => setValue({...value,keyword:e.target.value})}
        />
        <button className="btn btn-outline-success" type='submit'>Search</button>
      </form>
    </div>
  )
}

export default SearchInput
