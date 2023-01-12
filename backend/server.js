//Include ENV
require("dotenv").config();

//Importing Libs
const app = require("./app");
const port = "7070";
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

//Routes
const User = require("./models/user_model");

app.use(cookieParser());

let URI = process.env.DATABASE_URL;
let Password = process.env.DATABASE_PASSWORD;

URI = URI.replace("<password>", Password);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.connect(
  URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
    console.log("Connected to MongoDB!!!");
  }
);

app.post("/getuserinfo", async (req, res) => {
  try {
    let UserInfo = req.body;
    User.findOne({ email: UserInfo.email }).then((user) => {
      if (user) {
        res.json({ msg: "Email already exists" });
      } else {
        let newUser = User.create(UserInfo);

        res.status(200).json({
          // email: UserInfo,
          Message: "email print successful",
          UserInfo: newUser,
        });
      }
    });
  } catch (error) {
    res.status(404).json({
      error: error,
      Message: error.message,
    });
  }
});

// listen on the port
app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});
