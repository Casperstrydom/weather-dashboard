module.exports = {
    // Other Webpack configuration options
  
    devServer: {
      // Replacing deprecated options with setupMiddlewares
      setupMiddlewares: (middlewares, devServer) => {
        // Replace the old onBeforeSetupMiddleware functionality
        devServer.app.get('/some-path', (req, res) => {
          res.json({ message: 'Custom setup for before setup middleware' });
        });
  
        // Replace the old onAfterSetupMiddleware functionality
        devServer.app.use((req, res, next) => {
          console.log('After setup middleware');
          next();
        });
  
        return middlewares;
      },
  
      // You can still add other options like hot reloading, port, etc.
      hot: true,
      port: 3000,
      // Additional devServer options...
    },
  };
  