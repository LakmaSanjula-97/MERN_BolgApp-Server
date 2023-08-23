const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");

// REGISTER

router.post("/register", async (req, res) => {
    try{
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        const newUser = new User({
          username: req.body.username,
          email: req.body.email,
          role: req.body.role,
          password: hashPassword,
        });

        const user = await newUser.save();
        res.status(200).json(user);
    }catch (err) {
        res.status(500).json(err);
    }
});

// router.post("/register", async (req, res) => {
//   try {
//     const salt = await bcrypt.genSalt(10);
//     const hashPassword = await bcrypt.hash(req.body.password, salt);
//     const newUser = new User({
//       username: req.body.username,
//       email: req.body.email,
//       password: hashPassword,
//     });

//     const user = await newUser.save();
//     console.log("User registered:", user);

//     // Sending email after successful registration
//     const transporter = nodemailer.createTransport({
//       service: "Gmail",
//       auth: {
//         user: "@gmail.com", // Replace with your Gmail email
//         pass: "7", // Replace with your Gmail password
//       },
//     });


//     const mailOptions = {
//       from: "@gmail.com",
//       to: user.email,
//       subject: "Welcome to Our App",
//       text: "Thank you for registering with us!",
//     };


//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.log(error);
//         return res.status(500).json({ error: "Email sending failed." });
//       } else {
//         console.log("Email sent: " + info.response);
//         return res
//           .status(200)
//           .json({ message: "Registration successful. Email sent." });
//       }
//     });

//     res.status(200).json(user);


//   } catch (err) {
//     res.status(500).json({err});
//   }
// });


// LOGIN


router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      return res.status(400).json("Wrong credentials!");
    }

    const validated = await bcrypt.compare(req.body.password, user.password);

    if (!validated) {
      return res.status(400).json("Wrong credentials!");
    }

    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json(err);
  }
});


module.exports = router 