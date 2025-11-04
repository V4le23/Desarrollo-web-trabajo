// simulacion de base de datos
let usuarios = [];
let idAuto = 1;

import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// esta carpeta es donde están tus HTML
app.use(express.static(__dirname));

// para poder leer formularios POST
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// RUTA PARA REGISTRAR USUARIO
app.post("/registro", (req, res) => {
  const { nombre, telefono, correo, contraseña, direccion } = req.body;

  usuarios.push({
    id: idAuto++,
    nombre,
    telefono,
    correo,
    contraseña,
    direccion
  });

  console.log("Usuarios actualmente:");
  console.log(usuarios);

  
  res.redirect("/inicioSesion.html");
});

// RUTA PARA INICIAR SESIÓN
app.post("/login", (req, res) => {
  const { correo, contraseña } = req.body;

  const user = usuarios.find(u => u.correo === correo && u.contraseña === contraseña);

  if (!user) {
    return res.send("Correo o contraseña incorrecta");
  }

  // si es correcto → manda a index.html
  res.redirect("/index.html");
});


app.listen(3000, () => {
  console.log("✅ Servidor funcionando en http://localhost:3000");
});

// RUTA PARA REGISTRAR UNA COMPRA
app.post("/compra", (req, res) => {
  const { usuarioId, producto, cantidad, precioTotal } = req.body;

  // Encontramos al usuario que hizo la compra
  const usuario = usuarios.find(u => u.id === parseInt(usuarioId));

  if (!usuario) {
    return res.status(400).send("Usuario no encontrado");
  }

  // Guardamos la compra en el arreglo de compras
  const compra = {
    usuarioId,
    nombreUsuario: usuario.nombre,
    producto,
    cantidad,
    precioTotal,
    fecha: new Date()
  };

  compras.push(compra);

  console.log("Compras realizadas:");
  console.log(compras);

  res.send("Compra registrada con éxito");
});