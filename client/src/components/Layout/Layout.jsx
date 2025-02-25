import React from 'react'
import Header from './Header'
import Footer from './Footer'
import {Helmet} from "react-helmet";
import { ToastContainer} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const Layout = (props) => {
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content={props.description} />
        <meta name="keywords" content={props.keywords} />
        <meta name="author" content={props.author} />
        <title>{props.title}</title>
      </Helmet>
      <Header />
        <main style={{minHeight:"77vh"}}>
        <ToastContainer />
        {props.children}
        </main>
      <Footer />
    </div>
  )
}

Layout.defaultProps = {
  title: 'Timely - Shop Now',
  description: 'Ecommerce app',
  keywords: 'mern,react,node,mongodb,watch,clock',
  author: 'Sakshi'
}

export default Layout
