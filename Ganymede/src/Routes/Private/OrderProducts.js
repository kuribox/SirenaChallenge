const db = require("../../Db/db");
const config = require("../../config/config");
const fetch = require("node-fetch");

// Cambia el estado de la orden
module.exports = async function OrderProducts (ctx, next) {
  const body = JSON.parse(ctx.request.body);
  if (body && body.orderId && body.products) {
    ctx.body = "ok";
    next();

    await db.searchOrderModel.setOrderProducts(body.orderId, body.products).catch(() => {});
    await db.searchOrderModel.setOrderStatus(body.orderId, "processed").catch(() => {});

    console.log(`[${body.orderId}] Updating products`);
    await db.productsModel.updateProducts(body.products).catch(() => {});

    db.searchOrderModel.getById(body.orderId).then((order) => {
      // Le manda la orden a themisto
      fetch(order.searchData.callbackUrl, {
        method: 'post',
        body: JSON.stringify({
          status: order.status,
          url: `${config.host}:${config.port}/api/product/search-order/${order._id}`
        })
      }).then(function(response) {
        if (response.status === 200) {
          return;
        }
        return Promise.reject();
      }).catch(() => {
        console.error(`[${order._id}] Failed Callback`);
      });
    }).catch(() => {});
  }
}