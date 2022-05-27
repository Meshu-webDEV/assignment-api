const router = require("express").Router();

// Middlewares
const user = require("./user/user.routes");

// API routes
router.use("/users", user);

module.exports = router;
