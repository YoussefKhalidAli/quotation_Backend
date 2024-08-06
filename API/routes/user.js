const express = require("express");

const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const genToken = require("../../getToken");

const auth = require("../middleWare/auth");

const User = require("../models/user");

// register an account
router.post(
  "/register",
  [
    check("email", "email is required").not().isEmpty(),
    check("email", "not a valid email").isEmail(),
    check("password", "password must be at least 6 characters/digits").isLength(
      { min: 6 }
    ),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ erros: errors.array() });
    }

    try {
      const { email, password } = req.body;

      const salt = await bcrypt.genSalt(10);

      const user = new User({
        email,
        password: await bcrypt.hash(password, salt),
      });

      await user.save();

      const token = genToken(user);
      res.json({ msg: "success", token });
    } catch (err) {
      res.json(err.message);
    }
  }
);

router.post(
  "/login",
  [
    check("username", "username must be at least 4 characters").isLength({
      min: 4,
    }),
    check("password", "password must be at least 6 characters/digits").isLength(
      { min: 6 }
    ),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ erros: errors.array() });
    }

    try {
      const { username, password } = req.body;
      const userFound = await User.findOne({ username });

      if (!userFound) {
        res.status(404).json("user not found");
      }

      const isMatch = await bcrypt.compare(password, userFound.password);

      if (!isMatch) {
        res.status(401).json([{ msg: "auth denied" }]);
      }

      const token = genToken(userFound);
      res.json({ msg: "success", token });
    } catch (err) {
      res.status(400).json(err.message);
    }
  }
);

router.delete("/:userId", auth, async (req, res) => {
  try {
    User.deleteOne({ _id: req.params.userId });

    res.json("success");
  } catch (err) {
    res.json(err.message);
  }
});

module.exports = router;
