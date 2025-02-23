const mongoose = require('mongoose');
require ("dotenv").config();

//constante para conectarme con la base de datos
const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser : true,
            useUnifiedTopology : true
        });
        console.log("MongoDB conectado")
    } catch (error) {
        console.error("error conectando MongoDB:", error);
        process.exit(1);
    }
};

module.exports = connectDB;