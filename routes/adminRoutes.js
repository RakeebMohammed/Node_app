const express = require("express");
const { AllProducts, Action } = require("../controller/adminController");
const validateToken = require("../middleware/validateToken");
const router = express.Router();
//route for getting all pending products
router.get("/allProducts", validateToken, AllProducts);
//route for making action on a product
router.post("/allProducts/:id", validateToken, Action);

module.exports = router;
