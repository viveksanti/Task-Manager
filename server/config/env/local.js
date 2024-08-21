module.exports = {
    port: process.env.PORT || 3001,
    jwt: {
        secret: "TaskManager",
        options: { expiresIn: 365 * 60 * 60 * 24 }, // 365 days
    },
    db: {
        mongo: {
            uri: "mongodb://localhost:27017/TaskManager",
            options: {
                username: "",
                password: "",
            },
        },
    },
    app: {
        host: "http://localhost:3001",
        name: "TM",
        appName: "TM",
        apiUrl: "http://localhost:" + process.env.port || 3001, 
        port: 3001,
    },
    apiUrl: "http://localhost:" + process.env.port || 3001,
    websiteUrl: "http://localhost:4200",
};

