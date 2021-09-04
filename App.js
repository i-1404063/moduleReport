const express = require("express");
const morgan = require("morgan");

const app = express();

// loading environment variables
require("dotenv").config({ path: "./Configs/.env" });

const Port = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// http logger
app.use(morgan("dev"));

// http route
require("./Route/user")(app);
require("./Route/module")(app);

app.listen(Port, () => {
  console.log(`Server is listening on port: ${Port}`);
  require("./Configs/db")();
});
