const mongoose = require("mongoose");

//modelo de productos perteneciente a la coleccion de productos en la tabla en Mongodb
const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String },
    stock: { type: Number },
    description: { type: String },
    brand: { type: String },
    sku: { type: String },
    tags: [String],
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Producto", ProductSchema, "productos");
