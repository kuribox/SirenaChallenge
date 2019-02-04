const db = require("../../Db/db");
const config = require("../../config/config");
const fetch = require("node-fetch");


module.exports = async function ProductSearch (ctx, next) {
  console.log("Recived new Order", ctx.request.body);
  if (ctx.request.body && ctx.request.body.searchQuery && ctx.request.body.provider) {
    const orderId = await db.searchOrderModel.LoadOrder("recived", ctx.request.body, []); // Carga la SearchOrder y obtiene su id
    if (orderId) {
      ctx.body = {orderId: orderId}; // responde el id de la orden
      console.log(`New Order [${orderId}]`);

      // Le manda la orden a themisto
      fetch(`${config.themistoAPI}/order`, {
        method: 'post',
        body: JSON.stringify({
          id: orderId,
          order: ctx.request.body
        })
      }).then(function(response) {
        if (response.status === 200) {
          return;
        }
        return Promise.reject();
      }).catch(() => {
        console.error("Failed Send Order");
        db.searchOrderModel.setOrderStatus(orderId, "failed").then(() => {});
      });
    } else {
      ctx.status = 404;
    }
  }
}