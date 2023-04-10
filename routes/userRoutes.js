const express=require('express')
const { Signup, Login, AllProducts, NewProduct, DeleteProduct } = require('../controller/userController')
const validateToken=require('../middleware/validateToken')
const router=express.Router()

router.post('/signup',Signup)
router.post('/login',Login)
router.get('/allProducts',validateToken,AllProducts)
router.post('/newProduct',validateToken,NewProduct)
router.get('/deleteProduct/:id',validateToken,DeleteProduct)
module.exports =router