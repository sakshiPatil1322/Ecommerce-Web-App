import React, { useState, useEffect } from 'react'
import Layout from '../../components/Layout/Layout'
import AdminMenu from '../../components/Layout/AdminMenu'
import { toast } from "react-toastify";
import axios from 'axios';
import CategoryForm from '../../components/form/CategoryForm';
import { Modal } from 'antd'

const CreateCategory = () => {
  const [category, setCategory] = useState([])
  const [name, setName] = useState("");
  const [visible,setVisible] = useState(false)
  const [selected,setSelected] = useState(null)
  const [updatedName,setUpdatedName] = useState(" ");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/category/create-category`, { name })
      if (data?.success) {
        toast.success('Category Created Successfully')
        getAllCategories();
        setName("");
      } else {
        toast.err(data.message)
      }
    } catch (err) {
      console.log(err);
      toast.error('Something went wrong in input form')
    }
  }
  // get all categories
  const getAllCategories = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/category/get-category`)
      if (data?.success) {
        setCategory(data?.category);
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong in getting Category");
    }
  }

  useEffect(() => {
    getAllCategories();
  }, [])

  // Update Category
  const handleUpdate = async(e) => {
    e.preventDefault();
    try{
      const { data } = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/v1/category/update-category/${selected._id}`,{name:updatedName})
      if(data.success){
        toast.success(data.message)
        setSelected(null);
        setUpdatedName("");
        setVisible(false);
        getAllCategories();
      }else{
        toast.error(data.message)
      }
    }catch(err){
      console.log(err);
      toast.error('Something went wrong in Update Category')
    }
  }

  // delete category
  const handleDelete = async(id) => {
    try{
      const { data } = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/v1/category/delete-category/${id}`)
      if(data.success){
        toast.success(data.message);
        getAllCategories();
      }else{
        toast.error(data.message)
      }
    }catch(err){
      console.log(err);
      toast.error('Something went wrong in Delete Category')
    }
  }

  return (
    <Layout title={"Dashboard - create-category"}>
      <div className="container-fluid m-3 p-3">
        <div className='row'>
          <div className="col-md-3 ml-20">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Manage Category</h1>
            <div className="p-3 w-50">
              <CategoryForm handleSubmit={handleSubmit} value={name} setValue={setName} />
            </div>

            <div className='w-75'>
              <table className="table table-striped w-100">
                <thead>
                  <tr>
                    <th scope="col"> <h3>All Categories</h3> </th>
                  </tr>
                </thead>
                <tbody>
                  {category.map(c => (
                    <tr key={c._id}>
                      <td>{c.name}</td>
                      <td className="d-flex justify-content-end pe-4 gap-2">
                        <button className='btn btn-primary me-3' onClick={() =>{ setVisible(true); setUpdatedName(c.name);setSelected(c)}}>Edit</button>
                        <button className='btn btn-danger me-5' onClick={() => {handleDelete(c._id)}} >Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          <Modal onCancel={() => setVisible(false)} footer={null} visible={visible} >
                  <CategoryForm value={updatedName} setValue={setUpdatedName} handleSubmit={handleUpdate} />
          </Modal>

          </div>
        </div>
      </div>
    </Layout>
  )
}

export default CreateCategory
