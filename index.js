/*
Project : NFT-marketplace
FileName : index.js
*/

const express = require("express");
const app = express();
const fs = require("fs");
const https = require("https");
var config = require("./helper/config");
var bodyParser = require("body-parser");
var user = require("./module/user/route/user");

var category = require("./module/category/route/category");
var collection = require("./module/collection/route/collection");
var media = require("./module/media/route/media");
var settings = require("./module/common/route/settings");
var item = require("./module/item/route/item");
var auction = require("./module/auction/route/auction");

var mongoose = require("mongoose");
var cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
global.__basedir = __dirname;
// app.use(express.json({limit: '50mb'}));
// app.use(express.urlencoded({limit: '50mb'}));
app.use(
  bodyParser.json({
    limit: "100mb",
  })
);
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "100mb",
  })
);
app.use(express.static(__dirname + "/media"));
app.use(cors());

// const options = {
//     key: fs.readFileSync("/var/www/html/backend/certificate/_.protomock.com_private_key.key"),
//     cert: fs.readFileSync("/var/www/html/backend/certificate/solved-trust-chain.crt")
// };

/*
 * Below lines used to connect databse moongoose ORM
 */
try {
  mongoose.connect(
    "mongodb+srv://" +
      config.db.username +
      ":" +
      config.db.password +
      "@cluster0.ni99lik.mongodb.net/" +
      config.db.name,
    {
      keepAlive: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  );

  var db = mongoose.connection;
  // Added check for DB connection
  if (!db) {
    console.log("Error connecting db");
  } else {
    console.log("Db connected successfully");
  }
} catch (error) {
  console.log(error);
}

/*
 * Below lines used to define route for the api services
 */
app.get("/", (req, res) => res.send("Welcome to NFT Marketplace API"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/user", user);
app.use("/settings", settings);
app.use("/media", media);
app.use("/category", category);
app.use("/collection", collection);
app.use("/item", item);
app.use("/auction", auction);

/*
 * Below lines used to handle invalid api calls
 */
app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!");
});
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

/*
 * Below lines used to run api service
 */
app.listen(config.app.port, () =>
  console.log(`NFT Marketplace app listening on port ${config.app.port}!`)
);
