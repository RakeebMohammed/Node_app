const express = require("express");
const {
  Signup,
  Login,
  AllProducts,
  NewProduct,
  DeleteProduct,
} = require("../controller/userController");
const validateToken = require("../middleware/validateToken");
const router = express.Router();
//route for signup
router.post("/signup", Signup);
//route for login
router.post("/login", Login);
//request a new product 
router.post("/newProduct", validateToken, NewProduct);
//get all the requested products by the user
router.get("/allProducts", validateToken, AllProducts);
//delete a product in which status is pending
router.delete("/deleteProduct/:id", validateToken, DeleteProduct);
module.exports = router;
