const router = require("express").Router();
const User = require("../models/User.model");
const Post = require("../models/Post.model");
const bcrypt = require('bcrypt');

// UPDATE

router.put("/:id", async (req, res) => {
    if (req.body.userId === req.params.id) {
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      }
      try {
        const updatedUser = await User.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatedUser);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can update only your account!");
    }
  });

//   DELETE

router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id) {
      try {
        const user = await User.findById(req.params.id);
        try {
          await Post.deleteMany({ username: user.username });
          await User.findByIdAndDelete(req.params.id);
          res.status(200).json("User has been deleted");
        } catch (err) {
          res.status(500).json(err);
        }
      } catch (err) {
        res.status(404).json("User not found!");
      }
    } else {
      res.status(401).json("You can delete only your account!");
    }
  });

//   GET USER

router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...others } = user._doc;
        res.status(200).json(others);
    }catch (err) {
          res.status(500).json(err);
        }
})

// GET ALL USERS

// router.get("/", async (req, res) => {
//   try {
//     const users = await User.find();
//     const sanitizedUsers = users.map((user) => {
//       const { password, ...others } = user._doc;
//       return others;
//     });
//     res.status(200).json(sanitizedUsers);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    const userCount = users.length;

    const sanitizedUsers = users.map((user) => {
      const { password, ...others } = user._doc;
      return others;
    });

    res.status(200).json({ count: userCount, users: sanitizedUsers });
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE (ADMIN)
router.delete("/delete/:id", async (req, res) => {
  try {
    // Find the user by ID
    const user = await User.findById(req.params.id);

    // Check if the user exists
    if (!user) {
      return res.status(404).json("User not found");
    }

    // Delete user
    await User.findByIdAndDelete(req.params.id);

    // Also delete related posts
    await Post.deleteMany({ userId: req.params.id });

    res.status(200).json("User has been deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router
