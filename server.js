const express = require("express");
const app = express();
require("dotenv").config();
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");

const PORT = process.env.PORT || 3501;
connectDB();
app.use(express.json());
app.use(cookieParser());

app.use(require("./routes/root"));

app.use("/register", require("./routes/register"));
app.use("/login", require("./routes/login"));

app.use(
  "/employee",
  require("./middleware/verifyJWT"),
  require("./routes/employees")
);

app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
});
