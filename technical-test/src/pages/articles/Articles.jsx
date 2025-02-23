import React, { useEffect, useState } from "react";
import axios from "axios";

//componente para actualizar los usuarios 
import UsersTable from "../../components/usersTable/usersTable";

import './Articles.css';


//Pagina para mostrar los articulos, y renderizar el componente para actualizar los usuarios
const Articles = () => {
    const [products, setProducts] = useState([]);
    const [userId, setUserId] = useState("");
    const [priceSpecial, setPriceSpecial] = useState({});
    const [userName, setUserName] = useState(""); 
    
    const API_BASE_URL = process.env.REACT_APP_API_URL;
    console.log("API_BASE_URL:", API_BASE_URL);

    //consumo de la api que contiene los productos para renderizarlos
    useEffect(() => {
        if (API_BASE_URL) {
            axios.get(`${API_BASE_URL}/api/productos`)
            .then(res => setProducts(res.data))
            .catch(err => console.error("Error obteniendo productos:", err));
        }
    }, [API_BASE_URL]);

    //api para buscar usuarios con precios especiales en los productos
    const searchPricesSpecials = () => {
        if (!userId) {
            alert("Por favor, ingresa un Usuario ID");
            return;
        }

        axios.get(`${API_BASE_URL}/api/precios-especiales/${userId}`)
        .then(res => {
            if (!res.data.productos || res.data.productos.length === 0) {
                alert("Este usuario no tiene precios especiales");
            }
            const prices = {};
            setUserName(res.data.name);
            res.data.productos.forEach(p => {
                prices[p.productId._id] = p.precioEspecial;
            });
            setPriceSpecial(prices);
        })
        .catch(err => {
            console.error("Error obteniendo precios especiales:", err);
            alert("Error al obtener precios especiales");
        });
    };

    return (
        <div className="container">
            <input 
                type="text" 
                placeholder="Usuario ID" 
                value={userId} 
                onChange={(e) => setUserId(e.target.value)} 
            />
            <button className="articles-button" onClick={searchPricesSpecials}>Buscar Precios Especiales</button>

            <table>
                <thead>
                    <tr>
                        <th>Nombre Usuario</th> 
                        <th>Nombre Producto</th>
                        <th>Precio Base</th>
                        <th>Precio Especial</th>
                    </tr>
                </thead>
                <tbody>
                    {products
                        .filter(p => !userId || priceSpecial[p._id]) 
                        .map(p => {
                            return (
                                <tr key={p._id}>
                                    <td>{userId && priceSpecial[p._id] ? userName : "N/A"}</td>
                                    <td>{p.name}</td>
                                    <td>${p.price}</td>
                                    <td>{userId && priceSpecial[p._id] ? `$${priceSpecial[p._id]}` : "N/A"}</td> 
                                </tr>
                            );
                        })}
                </tbody>
            </table>
            <UsersTable/>
        </div>
    );
};

export default Articles;
