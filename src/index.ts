(async () => {
    const app = (await import("./app")).app;
    const MongoDbController = (await import("./services/mongoDbController.js")).MongoDbController;
    const UserStore = (await import("./services/userStore.js")).UserStore;

    const mongoDbController = await MongoDbController.create();
    app.userStore = new UserStore(mongoDbController);

    const PORT = process.env.PORT || 8082;
    app.listen(PORT, () => {
        console.log(
            `Successfully started server at: http://127.0.0.1:${PORT}`
        );
        console.log("Press Ctrl+C to quit.");
    });
})();
