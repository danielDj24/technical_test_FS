const express = require("express");
const router = express.Router();
const Producto = require("../models/product");

//ruta para obtener los productos en la coleccion
router.get("/", async (req, res) => {
    try {
        const productos = await Producto.find();
        res.json(productos);
    } catch (error) {
        console.error("Error obteniendo productos:", error);
        res.status(500).json({ error: "Error obteniendo productos" });
    }
});

//ruta para obtener los productos por Id
router.get("/:id", async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        if (!producto) {
        return res.status(404).json({ message: "Producto no encontrado" });
        }
        res.json(producto);
    } catch (error) {
        console.error("Error obteniendo el producto:", error);
        res.status(500).json({ error: "Error obteniendo el producto" });
    }
});

module.exports = router;
