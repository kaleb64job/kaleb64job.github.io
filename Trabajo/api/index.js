const express = require('express');
const app = express();
const port = 3000;
const mysql = require('mysql');
const cors = require('cors');

app.use(cors());
app.use(express.json());

// Middleware de autenticación
function Pase(req, res, next) {
  const us = req.headers.auth;
  if (us === "1111") {
    next();
  } else {
    res.status(401).send("No autorizado");
  }
}

// Conexión a base de datos
let datos = [];

let con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "usuarios_fpf"
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Conexión exitosa a MySQL");

  con.query("SELECT * FROM jugadores", function (err, result) {
    if (err) {
      console.error("Error al obtener datos:", err);
    } else {
      datos = result;
      console.log("Datos cargados:", result);
    }
  });
});

// Rutas
app.get('/', Pase, (req, res) => {
  res.send(datos);
});

app.get('/algo', (req, res) => {
  res.send(datos);
});

app.post('/datos', Pase, (req, res) => {
  const data = req.body.nombre;
  console.log('Datos recibidos: ' + data);
  res.json({ message: 'Datos recibidos exitosamente' });
});

// Rutas protegidas con autenticación Pase:
app.post('/insertar', Pase, (req, res) => {
  const { nombre, edad, nombre_usuario } = req.body;

  let sql = "INSERT INTO jugadores (id, nombre, edad, nombre_usuario) VALUES (null, ?, ?, ?)";
  con.query(sql, [nombre, edad, nombre_usuario], function (err, result) {
    if (err) {
      console.error("Error al insertar:", err);
      res.status(500).json({ message: "Error al insertar" });
    } else {
      console.log("Insert exitoso, ID:", result.insertId);
      res.json({ message: 'Datos insertados exitosamente', id: result.insertId });
    }
  });
});

app.delete('/eliminar/:id', Pase, (req, res) => {
  const id = req.params.id;

  const sql = "DELETE FROM jugadores WHERE id = ?";
  con.query(sql, [id], function (err, result) {
    if (err) {
      console.error("Error al eliminar:", err);
      return res.status(500).json({ message: "Error al eliminar" });
    }

    console.log(`Jugador con ID ${id} eliminado`);
    res.json({ message: `Jugador con ID ${id} eliminado` });
  });
});

app.put('/editar/:id', Pase, (req, res) => {
  const { id } = req.params;
  const { nombre, edad, nombre_usuario } = req.body;

  const sql = "UPDATE jugadores SET nombre = ?, edad = ?, nombre_usuario = ? WHERE id = ?";
  con.query(sql, [nombre, edad, nombre_usuario, id], (err, result) => {
    if (err) {
      console.error("Error al editar:", err);
      return res.status(500).json({ message: "Error al editar" });
    }
    console.log(`Jugador con ID ${id} actualizado`);
    res.json({ message: `Jugador actualizado correctamente` });
  });
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
});