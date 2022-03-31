(async () => {
    const app = (await import("./app.js")).app;

    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
        console.log(
            `Successfully started server at http://127.0.0.1:${PORT}`
        );
        console.log("Press Ctrl+C to quit.");
    });
})();
