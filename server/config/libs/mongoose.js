let mongoose = require("mongoose");
let config = require("./../config");
const chalk = require("chalk");

mongoose.connect(
  config.db.mongo.uri,
 // { zipcode: config.db.mongo.options.zipcode, pass: config.db.mongo.options.pass },
  function(err) {
    if (err) {
      console.log(chalk.red("Error while connecting to mongo : " + err));
    } else {
      console.log("connected to mongodb : " + config.db.mongo.uri);
    }
  }
);

module.exports = mongoose;
