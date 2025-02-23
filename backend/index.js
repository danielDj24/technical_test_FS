const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

//constante app para exponer las rutas con node.js
const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/productos", require("./routes/product"));
app.use("/api/precios-especiales", require("./routes/userPriceSpecial"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en el puerto ${PORT}`));
