const express = require("express");
const app = express();
const dotenv = require ("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./auth/auth");
const userRoute = require("./routes/user.routes")
const postRoute = require("./routes/post.routes")
const categoryRoute = require("./routes/category.routes");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

dotenv.config();
app.use(express.json());

app.use(cors()); // Use cors middleware

app.use("/images", express.static(path.join(__dirname, "/images")));

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

  // image upload
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "images");
    },filename:(req,file,cb) => {
      cb(null, req.body.name);
    }
  }); 

  const upload = multer({ storage: storage });
  app.post("/api/upload", upload.single("file"), (req, res) => {
    res.status(200).json("File has been uploaded");
  });

  app.use("/api/auth", authRoute);
  app.use("/api/post", postRoute);
  app.use("/api/user", userRoute);
  app.use("/api/category", categoryRoute);

app.listen(5000, () => {
    console.log("Connected to the Backend");
})

