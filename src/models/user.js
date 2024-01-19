/*                  Aula 379 Resolvendo teste de cadastro de usuário  */


/*(1-379) Vou definir o primeiro model - (importando o Mongoose)*/
let mongoose = require("mongoose");

/*(2-379) Para definir um model no mongoose eu vou fazer um mongoose schema */
let user = new mongoose.Schema({
    name: String,
    email: String,
    password: String

});

/**(3-379) Exportando o model */
module.exports = user;