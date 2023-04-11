const mongodb = require("mongodb").MongoClient;
let state = { db: null };
module.exports.connect = () => {
  let url = "mongodb://localhost:27017";
  let dbname = "Task";
  mongodb.connect(url, (err, data) => {
    if (err) return err;
    state.db = data.db(dbname);
    console.log("connected");
  });
};
module.exports.get = () => state.db;
