const EasyCrawling = require("../../Crawling/Easy");
const OrderRequest = require("../../Request/Order");

module.exports = async function Order (ctx, next) {
  console.log("Recived new Order", ctx.request.body);
  const body = JSON.parse(ctx.request.body);
  if (body && body.order && body.id && body.order.searchQuery && body.order.provider) {
    ctx.body = "ok";
    next();

    const orderId = body.id;

    console.log("Procesing new Order", orderId);

    OrderRequest.ProcessingOrder(orderId).then(async () => {
      // Procesa el tipo de orden
      switch(body.order.provider) {
        case 'easy': 
          const easy = new EasyCrawling(orderId, body.order.searchQuery);
          await easy.initCrawling(); // Inicia el crawling
          if (body.order.options && body.order.options.user && body.order.options.password) {
            // Logea el usuario
            easy.login(body.order.options.user, body.order.options.password).then(async () => {
              // Empieza la busqueda
              await easy.crawling();
              if (easy.elements !== null) {
                console.log(`${easy.requestName} - Search Done`);
                console.log(`${easy.requestName} - Sending Products`);
                OrderRequest.sendProducts(orderId, easy.elements).catch(() => {});
              }
            }).catch((err) => {
              // El login fallo
              console.error(`[${orderId}] Error: ${err}`);
              OrderRequest.FailedOrder(orderId).catch(() => {});
            });
          } else {
            // sin informacion de login
            console.error(`[${orderId}] Error: Not Exist login information`);
            OrderRequest.FailedOrder(orderId).catch(() => {}).catch(() => {});
          }
          break;
        default: 
          console.error(`[${orderId}] Error: Not Exist Provider`);
          OrderRequest.FailedOrder(orderId).catch(() => {}).catch(() => {});
      }
    }).catch(() => {});
  }
}