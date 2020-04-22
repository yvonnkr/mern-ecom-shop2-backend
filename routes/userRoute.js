const express = require("express");
const bycrypt = require("bcryptjs");

const User = require("../models/userModel");
const { getToken, isAuth, isAdmin } = require("../utils/auth");
const { userInputCheck, validateResult } = require("../utils/validation");

const router = express.Router();

//@route    POST api/user/register
//@desc     Register/Signup User
//@access   Public
router.post("/user/register", userInputCheck, async (req, res) => {
  //validate inputs
  const inputError = validateResult(req);
  if (inputError) {
    return res.status(422).json(inputError);
  }

  //req.body
  const { name, email, password, isAdmin } = req.body;

  try {
    //check if user exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "user with given email already exists." });
    }

    //encrypt password
    const hashedPassword = await bycrypt.hash(password, 12);

    //create user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isAdmin,
    });

    //save new user
    await newUser.save();

    //generate JWT
    const token = getToken(newUser);

    //response
    res.status(201).json({
      _id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
      token,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

//@route    POST api/user/signin
//@desc     Signin/Login User
//@access   Public
router.post("/user/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    //check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "Invalid credentials" });
    }

    //compare password
    const passwordIsMatch = await bycrypt.compare(password, user.password);
    if (!passwordIsMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    //generate jwt
    const token = getToken(user);

    //response
    res.status(200).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

//@route    GET api/user/me
//@desc     Get authenticated user
//@access   Private
router.get("/user/me", isAuth, async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId, "-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

//@route    PUT api/user/:id
//@desc     Update authenticated user
//@access   Private
router.put("/user/:id", isAuth, isAdmin, async (req, res) => {
  const userId = req.params.id;
  const { name, email, password } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "user not found" });
    }

    //encrypt password
    const hashedPassword = await bycrypt.hash(password, 12);

    (user.name = name || user.name),
      (user.email = email || user.email),
      (user.password = hashedPassword || user.password);

    const updatedUser = await user.save();

    res.send({
      _id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: getToken(updatedUser),
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

module.exports = router;
