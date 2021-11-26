const express = require("express");
const Joi = require("@hapi/joi");
const app = express();

app.use(express.json());

const usuarios = [
  {
    id: 1,
    name: "Luis",
  },
  {
    id: 2,
    name: "Aldana",
  },
  {
    id: 3,
    name: "Axel",
  },
];

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/users", (req, res) => {
  res.send(usuarios);
});

app.get("/api/users/:id", (req, res) => {
  let user = existeUsuario(req.params.id);
  if (!user) res.status(404).send("Usuario no encontrado");
  res.send(user);
});

app.post("/api/users", (req, res) => {  //insertar nombre y id en el arreglo
  const { error, value } = validarNombre(req.body.name);
  if (!error) {
    const user = {
      id: usuarios.length + 1, //cantidad de elementos + 1
      name: value.name //nombre que viene en el body enviado por postman
    };
    usuarios.push(user); //introduce el user en el arreglo
    res.send(user); //envia respuesta al cliente
  } else {
      res.status(400).send(error.details[0].message);
  }
});

app.put("/api/users/:id", (req, res) => {
  let user = existeUsuario(req.params.id);
  if (!user){ 
    res.status(404).send("Usuario no encontrado");
    return;
  }

  const { error, value } = validarNombre(req.body.name);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  user.name = value.name;
  res.send(user);

});

app.delete("/api/users/:id", (req, res) => {
  let user = existeUsuario(req.params.id);
  if (!user){
    res.status(404).send("Usuario no encontrado");
    return;
  }
  const index = usuarios.indexOf(user); //identifica el indice del usuario
  usuarios.splice(index, 1); //eliminar 1 elmento del arreglo
  res.send(usuarios); //enviar respuesta al cliente
});

const port = process.env.PORT || 3000; // variable de entorno por si el puerto 3000 está ocupado
app.listen(port, () => {
  console.log(`Escuchando el puerto ${port}`);
});


//funcion para verificar si el usuario existe
function existeUsuario (id) {
  return usuarios.find((u) => u.id === parseInt(id));
}

//funcion para validar el nombre
function validarNombre (nombre) {
  //validacion con joi
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
  });
  return schema.validate({ name: nombre });
}

