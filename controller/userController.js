const bcrypt = require("bcrypt");
const db = require("../model/connection");
const jwt = require("jsonwebtoken");
const objectid = require("objectid");
const Signup = async (req, res) => {
  let { name, password, cpassword, email, role } = req.body;
  console.log(req.body);

  if (!name || !password || !cpassword || !email || !role)
    res.status(404).json("Please provide all credintials");
  let EmailRegex =
    /^[a-zA-Z0-9_.+]*[a-zA-Z][a-zA-Z0-9_.+]*@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  //if(!(/^[a-zA-Z][a-zA-Z0-9_]{5,15}$/i.test(name)))
  //return  res.status(404).json('Not a valid name')
  if (password !== cpassword) return res.status(404).json("Password mismatch");
  else if (role != "user" || role != "admin")
    return res.status(404).json("Role can only be user/admin");
  else {
    let EmailExists = await db
      .get()
      .collection("users")
      .findOne({ email: email });
    if (EmailExists) return res.status(404).json("Already have Same email id ");
    password = await bcrypt.hash(password, 10);
    console.log(password);
    await db
      .get()
      .collection("users")
      .insertOne({ name, email, password, role });
    res.status(200).json("Signup Success");
  }
};

const Login = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  if (!email || !password)
    return res.status(404).json("Please enter valid credintials");

  let EmailExists = await db
    .get()
    .collection("users")
    .findOne({ email: email });

  console.log(EmailExists);
  if (EmailExists && (await bcrypt.compare(password, EmailExists.password))) {
    const token = jwt.sign({ EmailExists }, process.env.SECRET, {
      expiresIn: "2h",
    });
    console.log(token);
    res.status(200).json(token);
  } else res.status(404).json("Error occured");
};
const NewProduct = async (req, res) => {
  let { product, quantity } = req.body;
  if (!product || !quantity || !isNaN(product) || isNaN(quantity))
    return res.status(404).json("Please enter correctly");
  let newData = {
    product,
    quantity,
    status: "Pending",
    userid: req.id,
  };
  await db
    .get()
    .collection("products")
    .insertOne(newData)
    .then((result) => res.status(200).json(result.insertedId))
    .catch(() => res.status(404).json("Not inserted"));
};
const AllProducts = async (req, res) => {
  console.log("he", req.id);
  let products = await db
    .get()
    .collection("products")
    .find({ userid: req.id })
    .toArray();
  res.status(200).json(products);
};
const DeleteProduct = async (req, res) => {
  console.log(req.params.id, "hey");

  let product = await db
    .get()
    .collection("products")
    .find({ $and: [{ userid: req.id, _id: objectid(req.params.id) }] })
    .toArray();
  console.log(product);
  if (product[0].status !== "Pending") {
    console.log("hi");
    return res.status(404).json("Cannot delete approved or rejected product");
  }

  db.get()
    .collection("products")
    .deleteOne({ $and: [{ userid: req.id, _id: objectid(req.params.id) }] })
    .then(() => res.status(200).json("Deleted succesfully"))
    .catch(() => res.status(404).json("Cannot delete"));
};
module.exports = { Signup, Login, NewProduct, AllProducts, DeleteProduct };
