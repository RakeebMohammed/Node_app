const db = require("../model/connection");

const objectid = require("objectid");

const AllProducts = async (req, res) => {
  let products = await db
    .get()
    .collection("products")
    .find({ status: "Pending" })
    .toArray();
  products.length !== []
    ? res.status(200).json(products)
    : res.status(404).json("No user requests");
};
const Action = (req, res) => {
  const { action } = req.body;

  action == "Reject" || action == "Approve"
    ? db
        .get()
        .collection("products")
        .updateOne(
          { _id: objectid(req.params.id) },
          { $set: { status: action } }
        )
        .then(() => res.status(200).json("Succesfully changed status"))
        .catch(() => res.status(404).json("Error occured"))
    : res.status(404).json("Not a correct action");
};

module.exports = { AllProducts, Action };
