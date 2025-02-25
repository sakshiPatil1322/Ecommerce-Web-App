import React from 'react'
import { useState } from 'react'
import Layout from '../../components/Layout/Layout'
import { toast } from 'react-toastify'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

const Register = () => {
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [number,setNumber] = useState("");
    const [address,setAddress] = useState("");
    const [question,setQuestion] = useState("");
    const navigate = useNavigate()

    const handleSubmit = async(e)=> {
        e.preventDefault();
        try{
            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/register`, {name, email, password, phone:number, address,question});
            if (res.data.success){
                toast.success(res.data.message)
                navigate('/login')
            }else{
                toast.error(res.data.message)
            }
        }catch(err){
            console.log(err);
            toast.error('Something went wrong')
        }
    }

    return (
        <Layout title="Register - Timely App">
            <div className="register">
                <h1>Register Page</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input type="text" className="form-control" id="exampleInputName1" placeholder='Enter Your Name' value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <input type="email" className="form-control" id="exampleInputEmail1" placeholder='Enter Your Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <input type="password" className="form-control" id="exampleInputPassword1" placeholder='Enter Your Password' value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <input type="text" className="form-control" id="exampleInputPhone1" placeholder='Enter Your Phone Number' value={number} onChange={(e) => setNumber(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <input type="text" className="form-control" id="exampleInputAddress1" placeholder='Enter Your Address' value={address} onChange={(e) => setAddress(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <input type="text" className="form-control" id="exampleInputQuestion1" placeholder='What is your favorite color' value={question} onChange={(e) => setQuestion(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-primary">Sign up</button>
                </form>
            </div>
        </Layout>
    )
}

export default Register
