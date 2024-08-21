const express = require("express");

const app = express();

const bodyParser = require("body-parser")

app.use(bodyParser.json({ limit: "200mb" }));
app.use(bodyParser.urlencoded({ limit: "200mb",  extended: true, parameterLimit: 1000000 }))

app.use(express.text());

let chalk = require("chalk");

const userRoute = require("./server/api/v1.0/User/routes/user");
const taskRoute = require("./server/api/v1.0/Task/routes/task");

const service = "/api";

var cors = require("cors");

const fs = require("fs");

let config = require("./server/config/config");

var originsWhitelist = [
    //config.default.website, //this is my front-end url for development
    "http://localhost:6000"

];
var corsOptions = {
    origin: function (origin, callback) {
        var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
        callback(null, isWhitelisted);
    },
    credentials: true
}
//here is the magic
app.use(cors(corsOptions));
// app.use(cors({
//     origin: '*',
//     credentials: true,
//     allowedHeaders: 'X-Requested-With, Content-Type, x-access-code',
// }));


app.use("" + service + "/users", userRoute);
app.use("" + service + "/tasks", taskRoute);

app.listen(config.port,
    () => {}
);

console.log(
    chalk.green(
        "Server started on port : " +
        config.port +
        " with " +
        process.env.NODE_ENV +
        " mode"
    )
);

module.exports = app;