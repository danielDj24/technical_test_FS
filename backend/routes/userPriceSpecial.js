const express = require("express");
const router = express.Router();
const UserPriceEspecial = require("../models/userPriceSpecial");

// Obtener un usuario por su usuarioId y popular los productos
router.get("/:usuarioId", async (req, res) => {
    try {
        const usuario = await UserPriceEspecial.findOne({ usuarioId: req.params.usuarioId })
            .populate("productos.productId");
        if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el usuario" });
    }
});

// Crear un nuevo usuario con precios especiales
router.post("/", async (req, res) => {
    try {
        const { name, lastName, usuarioId, productos } = req.body;
        const nuevoUsuario = new UserPriceEspecial({ name, lastName, usuarioId, productos });
        await nuevoUsuario.save();
        res.status(201).json(nuevoUsuario);
    } catch (error) {
        res.status(500).json({ error: "Error al crear el usuario" });
    }
});

// Obtener todos los usuarios con precios especiales
router.get("/", async (req, res) => {
    try {
        const usuarios = await UserPriceEspecial.find({ "productos.precioEspecial": { $exists: true } })
            .populate("productos.productId");
        if (usuarios.length === 0) {
            return res.status(404).json({ message: "No se encontraron usuarios con precios especiales" });
        }
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los usuarios con precios especiales" });
    }
});

// Actualizar el precioEspecial de un producto en un usuario específico
router.put("/:usuarioId/producto/:productoId", async (req, res) => {
    try {
        const { usuarioId, productoId } = req.params;
        const { precioEspecial } = req.body;

        console.log('Usuario ID recibido:', usuarioId); 
        console.log('Producto ID recibido:', productoId);
        const usuario = await UserPriceEspecial.findOne({ usuarioId });
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        console.log('Productos en el usuario:', usuario.productos); 
        const producto = usuario.productos.find((prod) => prod.productId.toString() === productoId.toString());
        if (!producto) {
            return res.status(404).json({ message: "Producto no encontrado en el usuario" });
        }
        producto.precioEspecial = precioEspecial;
        await usuario.save();
        res.json(usuario);
    } catch (error) {
        console.error("Error al actualizar el precio especial del producto:", error); 
        res.status(500).json({ error: "Error al actualizar el precio especial del producto" });
    }
});

// Eliminar un producto de los productos de un usuario
router.delete("/:usuarioId/producto/:productoId", async (req, res) => {
    try {
        const { usuarioId, productoId } = req.params;
        const usuario = await UserPriceEspecial.findOne({ usuarioId });
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        const productosFiltrados = usuario.productos.filter(
            (prod) => prod.productId.toString() !== productoId
        );
        if (productosFiltrados.length === usuario.productos.length) {
            return res.status(404).json({ message: "Producto no encontrado en el usuario" });
        }
        usuario.productos = productosFiltrados;
        await usuario.save();
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el producto" });
    }
});

// Eliminar un usuario completamente por su usuarioId
router.delete("/:usuarioId", async (req, res) => {
    try {
        const { usuarioId } = req.params;
        const usuario = await UserPriceEspecial.findOne({ usuarioId });
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        await UserPriceEspecial.deleteOne({ usuarioId });
        res.json({ message: "Usuario y sus productos eliminados correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el usuario y sus productos" });
    }
});

// Agregar más productos con precios especiales a un usuario existente
router.post("/:usuarioId/productos", async (req, res) => {
    try {
        const { usuarioId } = req.params;
        const { productos } = req.body;
        const usuario = await UserPriceEspecial.findOne({ usuarioId });
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        const productosNuevos = productos.filter(nuevoProd =>
            !usuario.productos.some(existingProd => existingProd.productId.toString() === nuevoProd.productId)
        );
        if (productosNuevos.length === 0) {
            return res.status(400).json({ message: "Todos los productos ya existen en el usuario" });
        }
        usuario.productos.push(...productosNuevos);
        await usuario.save();
        res.status(201).json(usuario);
    } catch (error) {
        console.error("Error al agregar productos con precios especiales:", error);
        res.status(500).json({ error: "Error al agregar productos con precios especiales" });
    }
});


module.exports = router;
