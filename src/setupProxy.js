const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/dev",
    createProxyMiddleware({
      target: "https://81y8fheo1k.execute-api.us-east-2.amazonaws.com",
      changeOrigin: true,
    })
  );
};
