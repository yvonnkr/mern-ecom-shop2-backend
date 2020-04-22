const { check, validationResult } = require("express-validator");

exports.userInputCheck = [
  check("name", "Name is required").notEmpty(),
  check("email", "Please enter a valid email").isEmail(),
  check("password", "Please enter a valid password min 6 characters").isLength({
    min: 6,
  }),
];

exports.validateResult = (req) => {
  let inputError;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    inputError = { errors: errors.array().map((err) => err.msg) };
  }

  return inputError;
};
