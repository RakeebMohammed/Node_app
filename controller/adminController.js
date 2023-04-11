const db = require("../model/connection");
const objectid = require("objectid");

const AllProducts = async (req, res) => {
  console.log(req.id);
  try {
    //getting the exact adimin
    let admin = await db
      .get()
      .collection("users")
      .findOne({ $and: [{ _id: objectid(req.id), role: "admin" }] });

    if (admin) {
      //getting all the user requested products which is pending
      let products = await db
        .get()
        .collection("products")
        .find({ status: "Pending" }, { product: 1, userid: 0 })
        .toArray();
      console.log(products);
      //checking whether it is empty or not
      products.length !== []
        ? res.status(200).json(products)
        : res.status(404).json("No user requests");
    } else {
      res.status(404).json(" user cant view all product requests");
    }
  } catch (err) {
    // internal error response
    res.status(500).json({ error: err.message });
  }
};
const Action = async (req, res) => {
  try {
    //destructoring request
    const { action } = req.body;
    console.log(req.body);
    console.log(req.params.id);
    //getting the exact adimin
    let admin = await db
      .get()
      .collection("users")
      .findOne({ $and: [{ _id: objectid(req.id), role: "admin" }] });
    if (admin) {
      //check for the action
      action == "Reject" || action == "Approve"
        ? //changing the status of the product
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
    } else {
      res.status(404).json("user cant make an action on the product");
    }
  } catch (err) {
    // internal error response
    res.status(500).json({ error: err.message });
  }
};

module.exports = { AllProducts, Action };
