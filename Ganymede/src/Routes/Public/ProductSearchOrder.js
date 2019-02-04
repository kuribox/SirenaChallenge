const db = require("../../Db/db");

module.exports = async function ProductSearchOrder (ctx, next) {
  ctx.body = await db.searchOrderModel.getById(ctx.params.id);
}