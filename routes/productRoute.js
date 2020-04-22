const express = require("express");
const Product = require("../models/productModel");
const { isAuth, isAdmin } = require("../utils/auth");

const router = express.Router();

//@route    POST api/products
//@desc     CREATE new Product
//@access   Private
router.post("/", isAuth, isAdmin, async (req, res) => {
  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    image: req.body.image,
    brand: req.body.brand,
    category: req.body.category,
    countInStock: req.body.countInStock,
    description: req.body.description,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
  });

  try {
    const newProduct = await product.save();

    res.status(201).json({ msg: "New Product Created", data: newProduct });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

//@route    GET api/products
//@desc     GET all Products
//@access   Public
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

//@route    GET api/products/:id
//@desc     GET Product by id
//@access   Public
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id });

    if (!product) {
      return res.status(404).json({ msg: "product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

//@route    POST api/products/:id
//@desc     UPDATE Product
//@access   Private
router.put("/:id", isAuth, isAdmin, async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ msg: "product not found" });
    }

    product.name = req.body.name;
    product.price = req.body.price;
    product.image = req.body.image;
    product.brand = req.body.brand;
    product.category = req.body.category;
    product.countInStock = req.body.countInStock;
    product.description = req.body.description;

    const updatedProduct = await product.save();
    res.json({ msg: "Product Updated", data: updatedProduct });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

//@route    DELETE api/products/:id
//@desc     DELETE Product
//@access   Private
router.delete("/:id", isAuth, isAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: "product not found" });
    }

    await product.remove();

    res.json({ msg: "Product deleted" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

module.exports = router;
