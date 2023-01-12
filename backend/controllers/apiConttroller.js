const fs = require("fs");
const express = require("express");
const ApiRoutes = express.Router();


ApiRoutes.post("/login", (req, res) => {
  const { appId, appSecret } = req.body;
  console.log(appId, appSecret);
  let nextCredential;
  let foundCredential = false;
});
// const fs = require("fs");
// fs.readFile("Credentials.csv", "utf8", function (err, data) {
//   console.log(data);
// });

// const fs = require("fs");
const csv = require("fast-csv");
// const { emitWarning } = require("process");
const Api = require("../models/api.model");
const data = [];

// Api.create({appId:'53432425',appSecret:"fsdfsdfs1",expire:false})
// fs.createReadStream("Credentials1.csv")
//   .pipe(csv.parse({ headers: true }))
//   .on("error", (error) => console.error(error))
//   .on("data", (row) => data.push(row))
//   .on("end", () => {
    //  console.log(data[0].appid),
    // console.log(data[0].appsecret)
    // console.log(data[0].expiration)
    // console.log(data);

    ApiRoutes.get("/getapi", async(req, res) => {
        const apiData=await Api.find({})
        // res.send(apiData)
        // res.send(apiData.expire)
        const FilterData=Api.findOne({expire:false},async(err,result)=>{
              if (err) throw err;
            res.send(result)
        })

    });

    ApiRoutes.post("/apiexpire", async(req, res) => {
      const APIdata = await req.body;
    //   console.log(req.body)
    //  const FilterApi = Api.findOne({ appId: 53432421 }, async (err, result) => {
    //    if (err) throw err;
      //  res.send(result);
Api.updateOne(
  { appId: APIdata.appId },
  { $set: { expire: true } },
  async (err, result) => {
    if (err) throw err;
    //  res.send(result);
    res.json({
      data: APIdata,
      data2: result,
      message: result.expire,
    });
  }
);
    });

      // console.log(req)s
    //   console.log(data);
    //   if (APIdata.expire === true) {
        // const sampledata = Api.findOne({ appid: 123456 });
        // console.log(sampledata)
        // for (i = 0; i <3; i++) {
        //   // data.find({ appid :data[i].appid});
        //   // res.send(data[i].appid);
        //   console.log(data[i].appid);
        // }
    //   }
    
//   });


  module.exports = ApiRoutes;