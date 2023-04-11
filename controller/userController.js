const bcrypt = require("bcrypt");
const db = require("../model/connection");
const jwt = require("jsonwebtoken");
const objectid = require("objectid");

const Signup = async (req, res) => {
  try{
  let { name, password, cpassword, email, role } = req.body;
  console.log(req.body);
//check for empty requests
  if (!name || !password || !cpassword || !email || !role)
    res.status(404).json("Please provide all credintials");
  //check for valid name
    if(!(/^[A-Za-z]+$/.test(name)))return  res.status(404).json('Not a valid name')
  let EmailRegex = /^[a-zA-Z0-9_.+]*[a-zA-Z][a-zA-Z0-9_.+]*@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  //validating email   
  if(!(EmailRegex.test(email)))return res.status(400).json('Email validation failed')
  let PasswordRegex=/^[A-Za-z\d]{8,}$/
   //check for valid password
    if(!(PasswordRegex.test(password)))return res.status(400).json('Password Should contain atleast 8 characters')
  //check whether both password is same
    if (password !== cpassword) return res.status(404).json("Password mismatch");
  if (role!== ("user"||'admin') )
    return res.status(404).json("Role can only be user/admin");
  else {
    let EmailExists = await db
      .get()
      .collection("users")
      .findOne({ email: email });
      //check for if the email exists in the database
      if (EmailExists) return res.status(404).json("Already have Same email id ");
    //hashing the password to store in the database
    password = await bcrypt.hash(password, 10);
    console.log(password);
     //store details to the database
    await db
      .get()
      .collection("users")
      .insertOne({ name, email, password, role });
    res.status(200).json("Signup Success");
  }
}
catch(err){
 // internal error response
  res.status(500).json({error:err.message})}
};

const Login = async (req, res) => {
  try{
  const { email, password } = req.body;
  console.log(req.body);
   //check for empty requests
  if (!email || !password)
    return res.status(404).json("Please enter valid credintials");
    //finding an email exitsts in the database
  let EmailExists = await db
    .get()
    .collection("users")
    .findOne({ email: email });

  console.log(EmailExists);
  //comparing the hashed password with the password
  if (EmailExists && (await bcrypt.compare(password, EmailExists.password))) {
    //creating token with the secret key
    const token = jwt.sign({ EmailExists }, process.env.SECRET, {
      expiresIn: "2h",
    });
    console.log(token);
    res.status(200).json(token);
  } else res.status(404).json("Error occured");
  }
  catch(err){
     // internal error response
    res.status(500).json({error:err.message})}
};
const NewProduct = async (req, res) => {
  try{
  let { product, quantity } = req.body;
  //validting the requests
  if (!product || !quantity || !isNaN(product) || isNaN(quantity))
    return res.status(404).json("Please enter correctly");
 
    let newData = {
    product,
    quantity,
    status: "Pending",
    userid: req.id,
  };
  //inserting products into the database
  await db
    .get()
    .collection("products")
    .insertOne(newData)
    .then((result) => res.status(200).json(result.insertedId))
    .catch(() => res.status(404).json("Not inserted"));
}
catch(err){
 // internal error response
  res.status(500).json({error:err.message})}
};
const AllProducts = async (req, res) => {
  try{
  console.log("he", req.id);
  //getting all the products requested by the user
  let products = await db
    .get()
    .collection("products")
    .find({ userid: req.id })
    .toArray();
  res.status(200).json(products);
  }
  catch(err){
    // internal error response
    res.status(500).json({error:err.message})}
};
const DeleteProduct = async (req, res) => {
  try{
//finding the single product using the request id and user id
    let product = await db
    .get()
    .collection("products")
    .find({ $and: [{ userid: req.id, _id: objectid(req.params.id) }] })
    .toArray();
  console.log(product);
  //check whether the status is  pending or not
  if (product[0].status !== "Pending") {
    return res.status(404).json("Cannot delete approved or rejected product");
  }
//changing the status of product only to which status is pending
  db.get()
    .collection("products")
    .deleteOne({ $and: [{ userid: req.id, _id: objectid(req.params.id) }] })
    .then(() => res.status(200).json("Deleted succesfully"))
    .catch(() => res.status(404).json("Cannot delete"));
}
catch(err){
  // internal error response
  res.status(500).json({error:err.message})}
};
module.exports = { Signup, Login, NewProduct, AllProducts, DeleteProduct };
