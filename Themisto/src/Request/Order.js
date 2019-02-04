const fetch = require("node-fetch");
const config = require("../config/config");
const Token = require("./Token");

// Avisa a Genymede que fallo la orden
exports.FailedOrder = (orderId) => {
  return fetch(`${config.publicApi}/private/order/status/failed`, {
    method: 'post',
    body: JSON.stringify({
      token: Token.token,
      orderId: orderId
    })
  }).then(function(response) {
    if (response.status === 200) {
      return Promise.resolve();
    }
    return Promise.reject();
  }).catch(() => {
    console.error("Failed Change Status Order");
    return Promise.reject();
  });
};

// Avisa a Genymede que la orden se esta procesando
exports.ProcessingOrder = (orderId) => {
  return fetch(`${config.privateApi}/order/status/processing`, {
    method: 'post',
    body: JSON.stringify({
      token: Token.token,
      orderId: orderId
    })
  }).then(function(response) {
    if (response.status === 200) {
      return Promise.resolve();
    }
    return Promise.reject();
  }).catch(() => {
    console.error("Failed Change Status Order");
    return Promise.reject();
  });
};

// Envis los productos de la orden
exports.sendProducts = (orderId, products) => {
  return fetch(`${config.privateApi}/order/products`, {
    method: 'post',
    body: JSON.stringify({
      token: Token.token,
      orderId: orderId,
      products: products
    })
  }).then(function(response) {
    if (response.status === 200) {
      return Promise.resolve();
    }
    return Promise.reject();
  }).catch(() => {
    console.error("Failed send products");
    return Promise.reject();
  });
};
