let local = require("./env/local");
let dev = require("./env/dev");
let uat = require("./env/uat");
let prod = require("./env/prod");

if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = "dev";
    module.exports = dev;
} else if (process.env.NODE_ENV == "dev") {
    module.exports = dev;
} else if (process.env.NODE_ENV == "uat") {
    module.exports = uat;
} else if (process.env.NODE_ENV == "prod") {
    module.exports = prod;
} else {
    module.exports = local;
}

// console.log("process.env.NODE_ENV", process.env.NODE_ENV);