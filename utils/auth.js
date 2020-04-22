const jwt = require("jsonwebtoken");

exports.getToken = (user) => {
  const token = jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_PRIVATE_KEY,
    { expiresIn: "48h" }
  );

  return token;
};

exports.isAuth = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    return res.status(401).json({ msg: "No token, not authenticated" });
  }

  const token = authorizationHeader.split(" ")[1]; //"Bearer xxxxxxx"
  if (!token) {
    return res.status(401).json({ msg: "No token, not authenticated" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_PRIVATE_KEY);

    //adds user property to request
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).send({ msg: "Invalid Token" });
  }
};

exports.isAdmin = (req, res, next) => {
  try {
    if (req.user && !req.user.isAdmin) {
      return res.status(403).json({ msg: "User not Authorized" });
    }

    next();
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
