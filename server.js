const express = require("express");
const cors = require("cors");

const data = require("./data");

const app = express();

//middleware
app.use(express.json({ extended: true }));
app.use(cors());

//routes
app.get("/api/products", (req, res) => {
  res.json(data.products);
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`server app on port ${port}`);
});
