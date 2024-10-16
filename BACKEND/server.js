const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const formRoutes = require('./routes/formRoutes');

// Configuración de dotenv
dotenv.config();

// Conectar a la base de datos
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use('/api', formRoutes);

// Configuración del puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
