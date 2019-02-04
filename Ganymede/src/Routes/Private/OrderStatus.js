const db = require("../../Db/db");

// Cambia el estado de la orden
module.exports = async function OrderStatus (ctx, next) {
  const body = JSON.parse(ctx.request.body);
  if (body && body.orderId && ['failed', 'processing'].indexOf(ctx.params.status) >= 0) {
    db.searchOrderModel.setOrderStatus(body.orderId, ctx.params.status).then(() => {});
    ctx.body = "ok";
  }
  next();
}