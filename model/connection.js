const mongodb = require("mongodb").MongoClient;
let state = { db: null };
module.exports.connect = () => {
  try{
  let url = "mongodb://localhost:27017";
  let dbname = "Task";
  //connecting to the database
  mongodb.connect(url, (err, data) => {
    if (err) return err;
    state.db = data.db(dbname);
    console.log("connected to database");
  });
  }
  catch(err){
    // internal error response
    console.log(err.message);
  }
};
module.exports.get = () => state.db;
