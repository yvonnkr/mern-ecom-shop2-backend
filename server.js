const express = require("express");
const cors = require("cors");

const app = express();

//middleware
app.use(express.json({ extended: true }));
app.use(cors());

//routes
app.get("/", (req, res) => {
  res.json({ message: "node server" });
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`server app on port ${port}`);
});
