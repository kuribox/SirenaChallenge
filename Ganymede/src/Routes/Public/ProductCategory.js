const db = require("../../Db/db");

module.exports = async function ProductCategory (ctx, next) {
  const products = await db.productsModel.getByCategoryId(ctx.params.id).catch(() => {});
  if (products && products.length > 0) {
    ctx.body = products;
  } else {
    ctx.body = "Error Not have products in this category";
  }
}