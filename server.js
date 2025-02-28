const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Conectar a MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/apiUsuarios', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar con MongoDB:', err));

// Modelo de Usuario
const UsuarioSchema = new mongoose.Schema({
  nombre: String,
  apellidos: String,
  nombreUsuario: String,
  fechaNacimiento: Date,
  password: String
});

const Usuario = mongoose.model('Usuario', UsuarioSchema);

// Ruta para registrar usuario
app.post('/registro', async (req, res) => {
  try {
    const { nombre, apellidos, nombreUsuario, fechaNacimiento, password } = req.body;

    const nuevoUsuario = new Usuario({ nombre, apellidos, nombreUsuario, fechaNacimiento, password });
    await nuevoUsuario.save();

    res.status(201).json({ mensaje: 'Usuario registrado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// Ruta para obtener usuarios
app.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// Ruta para login
app.post('/login', async (req, res) => {
  try {
    const { nombreUsuario, password } = req.body;

    const usuario = await Usuario.findOne({ nombreUsuario, password });
    if (!usuario) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }

    res.json({ mensaje: 'Login exitoso', 
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        nombreUsuario: usuario.nombreUsuario,
        fechaNacimiento: usuario.fechaNacimiento,
        password: usuario.password
     });
  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ error: 'Error en el inicio de sesión' });
  }

});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
