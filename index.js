const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('API REST - Productos');
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Conexión a MongoDB exitosa');
    app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
  })
  .catch(err => console.error('Error al conectar a MongoDB', err));
