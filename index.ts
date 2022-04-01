(async () => {
  const app = (await import("./app.js")).app;

  const PORT = process.env.PORT || 8082;
  app.listen(PORT, () => {
    console.log(
      `Hello! The container started successfully and is listening for HTTP requests on ${PORT}`
    );
    console.log("Press Ctrl+C to quit.");
  });
})();
