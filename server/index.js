const express = require("express");
const app = express();
const cors = require('cors');
require("dotenv").config();

app.use(express.json());
app.use(cors());

const db = require("./models");

// Routes
const storeRouter = require("./routes/store")
app.use("/store", storeRouter);
const usersRouter = require("./routes/users")
app.use("/users", usersRouter);
const ordersRouter = require("./routes/orders")
app.use("/orders", ordersRouter);

const port = process.env.PORT || 3001;

db.sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  })
}).catch((err) => {
  console.log(err);
});