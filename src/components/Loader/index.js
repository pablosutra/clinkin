import React from 'react';
import './loader.css';
import Loader from "react-loader-spinner";

const Spinner = () => (
    <div className="container spinner">
        <Loader type="Circles" color="#00d1b2" height={500} width={500} />
    </div>
)

export default Spinner;