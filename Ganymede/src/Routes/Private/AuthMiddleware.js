const config = require("../../config/config");
const jwt = require('jsonwebtoken');

// Valida el Token
module.exports = async function AuthMiddleware (ctx, next) {
  const body = JSON.parse(ctx.request.body);
  if (body && body.token) {
    jwt.verify(body.token, config.secretKey, function(err, decoded) {
      if (err) {
        console.error("Error: Failed Token");
      } else {
        next();
      }
    });
  }
}