const fetch = require("node-fetch");
const config = require("../config/config");

exports.token = null; // Token para la API privada

// Pedido del token para api privada
exports.getToken = () => {
  return fetch(`${config.publicApi}/login`, {
    method: 'post',
    body: JSON.stringify({
      user: config.username,
      password: config.password
    })
  }).then(function(response) {
    if (response.status === 200) {
      return response.json().then((body) => {
        if (body && body.token) {
          console.log(`Requested Token ${body.token}`);
          exports.token = body.token;
        } else {
          return Promise.reject();
        }
      })
    }
    return Promise.reject();
  }).catch(() => {
    console.error("Failed Token Request");
    process.exit()
  });
};
