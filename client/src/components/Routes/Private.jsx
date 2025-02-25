import React from 'react'
import { useEffect,useState } from 'react'
import {useAuth} from "../../context/auth"
import {Outlet} from "react-router-dom";
import axios from 'axios'
import Spinner from '../Spinner';

const Private = () => {
    const [ok,setOk] = useState(false);
    const [auth,setAuth] = useAuth();
    useEffect(() => {
        const authCheck = async() => {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/user-auth`)
            console.log(res.data.ok)
            if(res.data.ok){
                setOk(true)
            }else{
                setOk(false)
            }
        }
        if(auth?.token) authCheck();
    },[auth?.token]);
  return (
    ok ? <Outlet /> : <Spinner path=' '/>
  )
}

export default Private
