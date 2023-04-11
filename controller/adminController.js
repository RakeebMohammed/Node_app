const db = require("../model/connection");

const objectid = require("objectid");

const AllProducts = async (req, res) => {
  try{
    //getting all the user requested products which is pending
  let products = await db
    .get()
    .collection("products")
    .find({ status: "Pending" })
    .toArray();
    //checking whether it is empty or not
  products.length !== []
    ? res.status(200).json(products)
    : res.status(404).json("No user requests");
  }
  catch(err){
    // internal error response
  res.status(500).json({error:err.message})}
  
};
const Action = (req, res) => {
  try{
    //destructoring request
  const { action } = req.body;
  console.log(req.body);
  console.log(req.params.id);
//check for the action 
  action == "Reject" || action == "Approve"
    ? 
    //changing the status of the product
    db
        .get()
        .collection("products")
        .updateOne(
          { _id: objectid(req.params.id) },
          { $set: { status: action } }
        )
        .then(() => res.status(200).json("Succesfully changed status"))
        .catch(() => res.status(404).json("Error occured"))
    : res.status(404).json("Not a correct action");
        }
        catch(err){
          // internal error response
          res.status(500).json({error:err.message})}
  };

module.exports = { AllProducts, Action };
