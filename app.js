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
  res.send(["Axel", "Aldana", "Nahuel", "Luis"]);
});

app.get("/api/users/:id", (req, res) => {
  let user = usuarios.find((u) => u.id === parseInt(req.params.id));
  if (!user) res.status(404).send("Usuario no encontrado");
  res.send(user);
});

app.post("/api/users", (req, res) => {
  //insertar nombre y id en el arreglo

  //validacion con joi
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
  });
  const { error, value } = schema.validate({
    name: req.body.name,
  });
  if (!error) {
    const user = {
      id: usuarios.length + 1, //cantidad de elementos + 1
      name: value.name //nombre que viene en el body enviado por postman
    };
    usuarios.push(user); //introduce el user en el arreglo
    res.send(user); //envia el user
  } else {
      res.status(400).send(error.details[0].message);
  }

  // if(!req.body.name || req.body.name.length < 3 ) {
  //     res.status(400).send('Nombre debe tener al menos 3 caracteres');
  //     return; //cuando es vacio sale del metodo
  // }
});

const port = process.env.PORT || 3000; // variable de entorno por si el puerto 3000 está ocupado
app.listen(port, () => {
  console.log(`Escuchando el puerto ${port}`);
});
