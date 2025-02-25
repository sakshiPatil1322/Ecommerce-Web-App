import React, { useState, useEffect } from 'react'
import Layout from '../../components/Layout/Layout'
import UserMenu from '../../components/Layout/UserMenu'
import { useAuth } from '../../context/auth'
import axios from 'axios'
import { toast } from 'react-toastify'

const Profile = () => {
    // Context
    const [auth, setAuth] = useAuth()
    // State
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [number, setNumber] = useState("");
    const [address, setAddress] = useState("");

    // get user data
    useEffect(()=>{
        const {email,name,phone,address} = auth.user
        setName(name)
        setEmail(email)
        setNumber(phone)
        setAddress(address)
    },[auth?.user])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const {data} = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/profile`, { name, email, password, phone: number, address });
            if (data?.err) {
                toast.error(res.data.message)
            } else {
                setAuth({...auth,user:data?.updatesUser})
                let ls = localStorage.getItem("auth");
                ls = JSON.parse(ls)
                ls.user = data.updatesUser
                localStorage.setItem('auth',JSON.stringify(ls))
                toast.success("Profile Updated Successfully")
            }
        } catch (err) {
            console.log(err);
            toast.error('Something went wrong')
        }
    }

    return (
        <Layout title={"Your Profile"}>
            <div className="container-fluid m-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <UserMenu />
                    </div>
                    <div className="col-md-9">
                        <div className="register">
                            <h1>User Profile</h1>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <input type="text" className="form-control" id="exampleInputName1" placeholder='Enter Your Name' value={name} onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <input type="email" className="form-control" id="exampleInputEmail1" placeholder='Enter Your Email' value={email} onChange={(e) => setEmail(e.target.value)} disabled />
                                </div>
                                <div className="mb-3">
                                    <input type="password" className="form-control" id="exampleInputPassword1" placeholder='Enter Your Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <input type="text" className="form-control" id="exampleInputPhone1" placeholder='Enter Your Phone Number' value={number} onChange={(e) => setNumber(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <input type="text" className="form-control" id="exampleInputAddress1" placeholder='Enter Your Address' value={address} onChange={(e) => setAddress(e.target.value)} />
                                </div>
                                <button type="submit" className="btn btn-primary">Update</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Profile
