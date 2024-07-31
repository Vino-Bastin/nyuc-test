const express = require("express");

const userControllers = require("../controllers/userControllers");

const router = express.Router();

router.get("/email-check/:email", userControllers.userEmailCheck);
router.post("/create-account", userControllers.createUser);

module.exports = router;
