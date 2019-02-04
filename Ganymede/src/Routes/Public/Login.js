const db = require("../../Db/db");
const config = require("../../config/config");
const jwt = require('jsonwebtoken');

// Logeo de usuario de la aplicacion themisto y creacion y devolucion del token JWT
module.exports = async function Login (ctx, next) {
  const body = JSON.parse(ctx.request.body);
  if (body && body.user) {
    console.log(`Loggin in ${body.user}`)
    const user = await db.userModel.existCredential(body.user, body.password);
    if (user && user.exists) {
      ctx.body = { token: jwt.sign(user, config.secretKey) };
    } else {
      ctx.body = { failed: true };
    }
    console.warn(ctx.body);
    next();
  }
}