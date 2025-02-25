import { useState } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import { useAuth } from "../../context/auth";
import axios from "axios";
import { toast } from "react-toastify";
import Layout from "../../components/Layout/Layout";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/login`,
        { email, password }
      );

      if (res.data.success) {
        toast.success(res.data.message);

        // Save user and token in state & localStorage
        setAuth({
          user: res.data.user,
          token: res.data.token
        });

        localStorage.setItem("auth", JSON.stringify({
          user: res.data.user,
          token: res.data.token
        }));

        navigate(location.state||"/");
      } else {
        toast.error(res.data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };


  return (
    <Layout title="Login - Timely App">
      <div className="register">
        <h1>Login Page</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Enter Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Enter Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
          <button type="submit" className="btn" onClick={() => {navigate('/forgot-password')}}><b>Forgot Password</b></button>
          </div>
          <button type="submit" className="btn btn-primary">Login</button>
        </form>
      </div>
    </Layout>
  );
};

export default Login;
