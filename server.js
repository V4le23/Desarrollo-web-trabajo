// Base de datos en memoria (se verá todo en la terminal)
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

// Arrays en memoria (se pierden cuando cierras el servidor)
const usuarios = [];
const compras = [];
let usuarioIdCounter = 1;
let compraIdCounter = 1;

console.log("\n📊 Base de datos en MEMORIA inicializada");
console.log("⚠️  Los datos se perderán cuando cierres el servidor\n");

// RUTA PARA REGISTRAR USUARIO (en memoria)
app.post("/registro", (req, res) => {
  const { nombre, telefono, correo, contraseña, direccion } = req.body;

  console.log("\n📝 REGISTRO SOLICITADO:");
  console.log(`  Nombre: ${nombre}`);
  console.log(`  Correo: ${correo}`);
  console.log(`  Teléfono: ${telefono || "no proporcionado"}`);

  if (!nombre || !correo || !contraseña) {
    console.log("  ERROR: Faltan campos obligatorios");
    return res.status(400).json({ ok: false, error: "Faltan campos obligatorios" });
  }

  // Verificar si el correo ya existe
  if (usuarios.some(u => u.correo === correo)) {
    console.log("  ERROR: El correo ya está registrado");
    return res.status(400).json({ ok: false, error: 'El correo ya está registrado' });
  }

  // Crear nuevo usuario
  const nuevoUsuario = {
    id: usuarioIdCounter++,
    nombre,
    telefono: telefono || null,
    correo,
    contraseña,
    direccion: direccion || null,
    fechaRegistro: new Date().toISOString()
  };

  usuarios.push(nuevoUsuario);
  console.log(`  OK: Usuario registrado. ID: ${nuevoUsuario.id}`);
  console.log(`  Total usuarios: ${usuarios.length}`);

  // Devolver JSON en lugar de redirigir
  res.json({ 
    ok: true, 
    usuario: { 
      id: nuevoUsuario.id,
      nombre: nuevoUsuario.nombre, 
      correo: nuevoUsuario.correo,
      telefono: nuevoUsuario.telefono,
      direccion: nuevoUsuario.direccion
    } 
  });
});


// RUTA PARA INICIAR SESIÓN (en memoria)
app.post('/login', (req, res) => {
  const { correo, contraseña } = req.body;

  console.log("\n🔐 LOGIN SOLICITADO:");
  console.log(`  Correo: ${correo}`);

  if (!correo || !contraseña) {
    console.log("  ERROR: Faltan correo o contraseña");
    return res.status(400).json({ ok: false, error: 'Faltan correo o contraseña' });
  }

  // Buscar usuario por correo
  const usuario = usuarios.find(u => u.correo === correo);

  if (!usuario) {
    console.log("  ERROR: Correo no registrado");
    return res.status(400).json({ 
      ok: false, 
      error: '❌ El correo no está registrado. Por favor, REGÍSTRATE primero en "Crear cuenta"' 
    });
  }

  if (usuario.contraseña !== contraseña) {
    console.log("  ERROR: Contraseña incorrecta");
    return res.status(400).json({ 
      ok: false, 
      error: '❌ Contraseña incorrecta. Intenta de nuevo o recupera tu contraseña.' 
    });
  }

  console.log(`  OK: Login exitoso para: ${usuario.nombre} (ID: ${usuario.id})`);
  res.json({ 
    ok: true, 
    usuario: { 
      id: usuario.id,
      nombre: usuario.nombre, 
      correo: usuario.correo,
      telefono: usuario.telefono,
      direccion: usuario.direccion
    } 
  });
});


// RUTA PARA REGISTRAR UNA COMPRA (en memoria)
app.post('/compra', (req, res) => {
  const { usuarioId, producto, cantidad, precioTotal } = req.body;

  console.log("\n🛒 COMPRA SOLICITADA:");
  console.log(`  Usuario: ${usuarioId}`);
  console.log(`  Producto: ${producto}`);
  console.log(`  Cantidad: ${cantidad || 1}`);
  console.log(`  Precio: $${precioTotal || 0}`);

  if (!usuarioId || !producto) {
    console.log("  ERROR: Datos incompletos");
    return res.status(400).send('Datos de compra incompletos');
  }

  // Buscar usuario por correo
  const usuario = usuarios.find(u => u.correo === usuarioId);

  if (!usuario) {
    console.log(`  ERROR: Usuario no encontrado`);
    console.log(`  Correo buscado: ${usuarioId}`);
    console.log(`  Usuarios registrados: ${usuarios.map(u => u.correo).join(", ") || "ninguno"}`);
    return res.status(400).send('Usuario no encontrado');
  }

  // Crear nueva compra
  const nuevaCompra = {
    id: compraIdCounter++,
    usuarioId: usuario.id,
    correoUsuario: usuario.correo,
    nombreUsuario: usuario.nombre,
    producto,
    cantidad: cantidad || 1,
    precioTotal: precioTotal || 0,
    fecha: new Date().toISOString()
  };

  compras.push(nuevaCompra);
  console.log(`  OK: Compra registrada. ID: ${nuevaCompra.id}`);
  console.log(`  Comprador: ${usuario.nombre}`);
  console.log(`  Total compras en sistema: ${compras.length}`);

  res.send('Compra registrada con exito');
});


app.listen(3000, () => {
  console.log('✅ Servidor funcionando en http://localhost:3000');
  console.log('Visita: http://localhost:3000/index.html\n');
});
