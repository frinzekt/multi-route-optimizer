import React, { Fragment } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const _app = ({ Component, pageProps }) => {
  return (
    <Fragment>
      <body>
        <Navbar></Navbar>
        <Component {...pageProps}></Component>
        <Footer></Footer>
      </body>
    </Fragment>
  );
};

export default _app;
