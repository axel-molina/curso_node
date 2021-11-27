function authentication (req, res, next) { //funcion middleware
    console.log("Autenticando...");
    next();
  }

module.exports = authentication;