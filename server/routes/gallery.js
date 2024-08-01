const express = require("express");

const galleryControllers = require("../controllers/galleryControllers");

const router = express.Router();

router.get("/check-identifier/:identifier", galleryControllers.checkIdentifier);
router.post("/create", galleryControllers.createGallery);
router.get("/:identifier", galleryControllers.getGallery);

module.exports = router;
