import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import './userTable.css'

//componente para editar los productos de un usuario o agregar mas 
const UsersTable = () => {
    const [users, setUsers] = useState([]);
    const [productosDisponibles, setProductosDisponibles] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState("");
    const [priceSpecials, setPriceSpecials] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [newProduct, setNewProduct] = useState({ productId: "", precioEspecial: "" });
    const API_BASE_URL = process.env.REACT_APP_API_URL;

    // Obtener usuarios con precios especiales
    useEffect(() => {
        if (API_BASE_URL) {
            axios.get(`${API_BASE_URL}/api/precios-especiales`)
                .then(res => setUsers(res.data))
                .catch(err => {
                    console.error("Error obteniendo usuarios:", err);
                    Swal.fire("Error", "Error al obtener usuarios con precios especiales", "error");
                });
        }
    }, [API_BASE_URL]);

    // Obtener la lista de productos disponibles
    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/productos`)
            .then(res => setProductosDisponibles(res.data))
            .catch(err => {
                console.error("Error obteniendo productos:", err);
                Swal.fire("Error", "Error al obtener los productos disponibles", "error");
            });
    }, []);

    const openModal = (userId, products) => {
        setSelectedUserId(userId);
        setShowModal(true);
    };

    const closeModal = () => {
        const modalOverlay = document.querySelector(".modal-overlay");
        modalOverlay.classList.add("fade-out");
    
        setTimeout(() => {
            setShowModal(false);
            setPriceSpecials({});
        }, 300);
    };

    const handlePriceChange = (productId, value) => {
        setPriceSpecials((prev) => ({
            ...prev,
            [productId]: value
        }));
    };

    //consumo de la api para actualizar el precio especial de un producto
    const updatePriceSpecial = (productId) => {
        const price = priceSpecials[productId];
        if (!price) {
            Swal.fire("¡Atención!", "Por favor, ingrese el precio especial", "warning");
            return;
        }
    
        const payload = { precioEspecial: price };
    
        axios.put(`${API_BASE_URL}/api/precios-especiales/${selectedUserId}/producto/${users.find(user => user.usuarioId === selectedUserId)
            ?.productos.find(product => product._id === productId)?.productId._id}`, payload)
            .then(() => {
                Swal.fire("Éxito", "Precio especial actualizado", "success");
                setUsers(prevUsers =>
                    prevUsers.map(user => {
                        if (user.usuarioId === selectedUserId) {
                            const updatedProducts = user.productos.map(product => {
                                if (product._id === productId) {
                                    return { ...product, precioEspecial: price };
                                }
                                return product;
                            });
                            return { ...user, productos: updatedProducts };
                        }
                        return user;
                    })
                );
                closeModal();
            })
            .catch(err => {
                console.error("Error actualizando el precio especial:", err);
                Swal.fire("Error", "Error al actualizar el precio especial", "error");
            });
    };

    //consumo de la api para eliminar el precio especial de un producto
    const deletePriceSpecial = (productId) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¡Este cambio es irreversible!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`${API_BASE_URL}/api/precios-especiales/${selectedUserId}/producto/${users.find(user => user.usuarioId === selectedUserId)
                    ?.productos.find(product => product._id === productId)?.productId._id}`)
                    .then(() => {
                        Swal.fire("Eliminado", "Precio especial eliminado", "success");
                        setUsers(prevUsers =>
                            prevUsers.map(user => {
                                if (user.usuarioId === selectedUserId) {
                                    const updatedProducts = user.productos.filter(product => product._id !== productId);
                                    return { ...user, productos: updatedProducts };
                                }
                                return user;
                            })
                        );
                        closeModal();
                    })
                    .catch(err => {
                        console.error("Error eliminando el precio especial:", err);
                        Swal.fire("Error", "Error al eliminar el precio especial", "error");
                    });
            }
        });
    };

    //consumo de la api para eliminar un usuario
    const deleteUser = (usuarioId) => {
        Swal.fire({
            title: '¿Eliminar usuario?',
            text: "Se eliminarán todos sus productos y precios especiales.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`${API_BASE_URL}/api/precios-especiales/${usuarioId}`)
                    .then(() => {
                        Swal.fire("Eliminado", "Usuario eliminado correctamente", "success");
                        setUsers(prevUsers => prevUsers.filter(user => user.usuarioId !== usuarioId));
                    })
                    .catch(err => {
                        console.error("Error eliminando usuario:", err);
                        Swal.fire("Error", "Error al eliminar el usuario", "error");
                    });
            }
        });
    };

    //consumo de la api para agregar un nuevo producto a un usuario
    const handleAddProduct = () => {
        if (!newProduct.productId || !newProduct.precioEspecial) {
            Swal.fire("¡Atención!", "Por favor ingrese el producto y el precio especial", "warning");
            return;
        }
        axios.post(`${API_BASE_URL}/api/precios-especiales/${selectedUserId}/productos`, { productos: [newProduct] })
            .then(res => {
                Swal.fire("Éxito", "Producto agregado con éxito", "success");
                setUsers(prevUsers =>
                    prevUsers.map(user => {
                        if (user.usuarioId === selectedUserId) {
                            return { ...user, productos: [...user.productos, res.data.productos[0]] };
                        }
                        return user;
                    })
                );
                setNewProduct({ productId: "", precioEspecial: "" });
            })
            .catch(err => {
                console.error("Error al agregar el producto:", err);
                Swal.fire("Error", "Error al agregar el producto", "error");
            });
    };

    //obtener y filtrar los productos que no se han seleccionado a un usuario
    const getProductosNoAgregados = () => {
        const usuario = users.find(user => user.usuarioId === selectedUserId);
        if (!usuario) return productosDisponibles;
        const productosAgregadosIds = usuario.productos.map(prod => prod.productId._id);
        return productosDisponibles.filter(prod => !productosAgregadosIds.includes(prod._id));
    };

    return (
        <div className="users-table">
            <h3>Usuarios con Precios Especiales</h3>
            <table>
                <thead>
                    <tr>
                        <th>Nombre Usuario</th>
                        <th>Apellido</th>
                        <th>ID Usuario</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length === 0 ? (
                        <tr>
                            <td colSpan="4">No se encontraron usuarios con precios especiales</td>
                        </tr>
                    ) : (
                        users.map(user => (
                            <tr key={user.usuarioId}>
                                <td>{user.name}</td>
                                <td>{user.lastName}</td>
                                <td>{user.usuarioId}</td>
                                <td>
                                    <button className="table-update-btn" onClick={() => openModal(user.usuarioId, user.productos)}>
                                        Actualizar Productos
                                    </button>
                                    <button className="table-delete-btn" onClick={() => deleteUser(user.usuarioId)}>
                                        Eliminar Usuario
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="modal-close-btn" onClick={closeModal}>X</button>
                        <div>
                            <ul>
                                {users.find(user => user.usuarioId === selectedUserId)?.productos.map(product => (
                                    <li key={product._id}>
                                        <span>
                                            {product.productId.name} - ${product.precioEspecial || product.productId.price}
                                        </span>
                                        <input 
                                            type="number" 
                                            placeholder="Nuevo precio especial"
                                            value={priceSpecials[product._id] || product.precioEspecial || ""}
                                            onChange={(e) => handlePriceChange(product._id, e.target.value)}
                                        />
                                        <button className="modal-update-btn" onClick={() => updatePriceSpecial(product._id)}>
                                            Actualizar
                                        </button>
                                        <button className="modal-delete-btn" onClick={() => deletePriceSpecial(product._id)}>
                                            Eliminar
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <div>
                            <select 
                                className="custom-select"
                                value={newProduct.productId} 
                                onChange={(e) => setNewProduct({ ...newProduct, productId: e.target.value })}
                                >
                                    <option value="">Seleccione un producto</option>
                                    {getProductosNoAgregados().map(prod => (
                                        <option key={prod._id} value={prod._id}>
                                            {prod.name} - ${prod.price}
                                        </option>
                                    ))}
                                </select>
                                <input 
                                    type="number" 
                                    placeholder="Precio Especial" 
                                    value={newProduct.precioEspecial} 
                                    onChange={(e) => setNewProduct({ ...newProduct, precioEspecial: e.target.value })} 
                                />
                                <button className="modal-update-btn" onClick={handleAddProduct}>
                                    Agregar Producto
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersTable;
