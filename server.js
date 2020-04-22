const express = require("express");
const cors = require("cors");
const connectDb = require("./db/db-connect");

const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");

const app = express();

//connect-db
connectDb();

//middleware
app.use(express.json({ extended: false }));
app.use(cors());

//routes
app.use("/api", userRoute);
app.use("/api/products", productRoute);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`server app on port ${port}`);
});
