import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from "../../images/logo.png";
import { useAuth } from '../../context/auth';
import { toast } from "react-toastify";
import SearchInput from '../form/SearchInput';
import { useCart } from '../../context/cart';

const Header = () => {
  const [auth, setAuth] = useAuth();
  const [cart] = useCart();
  const handleLogout = () => {
    setAuth({ user: null, token: "" });
    toast.success("You are logged out");
    localStorage.removeItem("auth");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-body-tertiary px-3">
      <div className="container-fluid">
        <NavLink to="/" className="navbar-brand d-flex align-items-center">
          <img src={logo} alt="Logo" style={{ height: "50px" }} className="me-2" />
          <h3 className="mb-0"><b>Timely</b></h3>
        </NavLink>


        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <SearchInput />
            <li className="nav-item">
              <NavLink to="/" className="nav-link">Home</NavLink>
            </li>
            {!auth.user ? (
              <>
                <li className="nav-item">
                  <NavLink to="/register" className="nav-link">Register</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/login" className="nav-link">Login</NavLink>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item dropdown">
                  <NavLink className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    {auth?.user?.name}
                  </NavLink>
                  <ul className="dropdown-menu">
                    <li><NavLink to={`/dashboard/${auth?.user?.role === 1 ? 'admin' : 'user'}`} className="dropdown-item">Dashboard</NavLink></li>
                    <li>
                      <NavLink onClick={handleLogout} to="/login" className="dropdown-item">Logout</NavLink>
                    </li>
                  </ul>
                </li>
              </>

            )}
            <li className="nav-item">
              <NavLink to="/cart" className="nav-link">Cart ({cart?.length})</NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
