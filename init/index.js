const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");//  extt karega .. se 

main().then(()=>{
    console.log("connect to mongoDB");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDB = async()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({
      ...obj,
      owner:"66925212c6f4e1404b266351",
    }))
    await Listing.insertMany(initData.data)
    console.log("data waws  intialize")
}
initDB();
