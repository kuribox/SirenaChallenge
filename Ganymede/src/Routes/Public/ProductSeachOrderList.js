const db = require("../../Db/db");

module.exports = async function ProductSearchOrderList (ctx, next) {
  ctx.body = await db.searchOrderModel.getAll();
}