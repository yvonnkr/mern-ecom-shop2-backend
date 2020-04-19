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
app.get("/api/products/:id", (req, res) => {
  const product = data.products.find((p) => p._id === req.params.id);
  if (product) res.json(product);
  else res.status(400).json({ msg: "product not found" });
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`server app on port ${port}`);
});
