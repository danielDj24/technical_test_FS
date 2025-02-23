const mongoose = require("mongoose");

//modelo para la coleccion creada para completar la prueba tecnica
const PriceProductSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Producto", required: true },
    precioEspecial: { type: Number, required: true }
    });

const UserPriceEspecialSchema = new mongoose.Schema({
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    usuarioId: { type: String, required: true, unique: true },
    productos: [PriceProductSchema]
    }, {
    timestamps: true 
});


module.exports = mongoose.model("UserPriceEspecialSchema", UserPriceEspecialSchema, "preciosEspecialesDuque24");
