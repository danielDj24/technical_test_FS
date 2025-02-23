import React, { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";  
import Swal from 'sweetalert2';
import './createUserSpecial.css'; 

//componente para crear un nuevo usuario con productos
const CreateUserWithSpecialPrices = () => {
    const [productos, setProductos] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        lastName: "",
        usuarioId: uuidv4(),  
        productos: [],
    });

    const API_BASE_URL = process.env.REACT_APP_API_URL;

    // consumo de la api para obtener los productos
    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/productos`)
        .then((response) => {
            setProductos(response.data);
        })
        .catch((error) => {
            console.error("Error al obtener productos:", error);
        });
    }, [API_BASE_URL]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handlePriceChange = (productId, price) => {
        const updatedProducts = formData.productos.map((p) =>
        p.productId === productId ? { ...p, precioEspecial: price } : p
        );
        setFormData({
            ...formData,
            productos: updatedProducts,
        });
    };

    const handleProductSelect = (productId) => {
        const isSelected = formData.productos.some((p) => p.productId === productId);
    
        if (isSelected) {
            setFormData({
                ...formData,
                productos: formData.productos.filter((p) => p.productId !== productId),
            });
        } else {
            setFormData({
                ...formData,
                productos: [
                    ...formData.productos,
                    { productId, precioEspecial: "" },  
                ],
            });
        }
    };
    

    //consumo de la api para crear un usuario con sus productos
    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post(`${API_BASE_URL}/api/precios-especiales`, formData)
            .then((response) => {
                Swal.fire({
                    title: 'Éxito!',
                    text: 'Usuario creado con precios especiales.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    window.location.reload();
                });
            })
            .catch((error) => {
                console.error("Error al crear el usuario:", error);
                Swal.fire({
                    title: 'Error',
                    text: 'No se pudo crear el usuario.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            });
    };

    return (
        <div className="container-create-user">
            <h1>Crear Usuario con Precios Especiales</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nombre:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Apellido:</label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Usuario ID:</label>
                    <input
                        type="text"
                        name="usuarioId"
                        value={formData.usuarioId}
                        readOnly
                    />
                </div>
                <h3>Selecciona los productos con precios especiales:</h3>
                <div className="productos-section">
                {productos.map((producto) => (
                    <div key={producto._id} className="producto-item">
                        {/* Checkbox con el label */}
                        <div className="checkbox-container">
                            <input
                                type="checkbox"
                                id={producto._id}
                                checked={formData.productos.some((p) => p.productId === producto._id)}
                                onChange={() => handleProductSelect(producto._id)}
                            />
                            <label htmlFor={producto._id}>{producto.name}</label>
                        </div>
                        
                        {/* Solo mostrar el precio especial si el producto está seleccionado */}
                        {formData.productos.some((p) => p.productId === producto._id) && (
                            <div className="precio-especial">
                                <label>Precio especial:</label>
                                <input
                                    type="number"
                                    value={formData.productos.find((p) => p.productId === producto._id).precioEspecial}
                                    onChange={(e) => handlePriceChange(producto._id, e.target.value)}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
                <button type="submit">Crear Usuario</button>
            </form>
        </div>
    );
};

export default CreateUserWithSpecialPrices;
