import React from "react";
import { Link } from "react-router-dom";
import './topBar.css'; 

//componente de menu o navegacion entre paginas y elementos
const Navbar = () => {
return (
    <nav className="navbar">
    <ul className="nav-list">
        <li className="nav-item">
        <Link to="/" className="nav-link">Artículos</Link>
        </li>
        <li className="nav-item">
        <Link to="/subida" className="nav-link">Subida</Link>
        </li>
    </ul>
    </nav>
);
};

export default Navbar;
