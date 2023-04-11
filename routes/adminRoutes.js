const express = require("express");
const { AllProducts, Action } = require("../controller/adminController");
const validateToken = require("../middleware/validateToken");
const router = express.Router();

router.get("/allProducts", validateToken, AllProducts);
router.post("/allProducts/:id", validateToken, Action);

module.exports = router;
