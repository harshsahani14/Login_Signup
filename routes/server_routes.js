const express = require("express");
const router = express.Router();

const auth = require("../controllers/Auth");
const { authenticate, isStudent, isAdmin } = require("../middlewares/auth");

router.post("/login", auth.login);
router.post("/signup", auth.signup);

router.get("/student", authenticate, isStudent, (req, res) => {
  res.json({
    sucess: true,
    message: "Student page",
  });
});

router.get("/admin", authenticate, isAdmin, (req, res) => {
  res.json({
    sucess: true,
    message: "Admin page",
  });
});

module.exports = router;
