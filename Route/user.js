const User = require("../Model/user");
const mongoose = require("mongoose");

module.exports = function (app) {
  // @desc /api/users
  app.post("/api/users", async (req, res) => {
    const { body } = req;
    try {
      let user = await User.findOne({ email: body.email });
      if (user) {
        res
          .status(400)
          .json({ message: "User with this email already exists!" });
      } else {
        user = new User({
          name: body.name,
          email: body.email,
          phone: body.phone,
          userCode: body.usercode,
        });

        let newUser = await user.save();
        res
          .status(201)
          .json({ message: "User creation successfull.", user: newUser });
      }
    } catch (err) {
      res
        .status(400)
        .json({ message: "Please fill out all of the mandatory field!" });
    }
  });

  // @desc  api/users/:id
  app.delete("/api/users/:id", async (req, res) => {
    const { id } = req.params;
    try {
      if (id) {
        const objId = new mongoose.Types.ObjectId(id);
        console.log(typeof objId);
        const user = await User.findByIdAndDelete(objId);

        if (user) {
          return res
            .status(200)
            .json({ message: "successfully deleted the user." });
        } else {
          return res
            .status(404)
            .json({ message: "User with the given id doesn't exists." });
        }
      } else {
        return res.status(400).json({ message: "Please provide id." });
      }
    } catch (err) {
      return res.status(400).json({ message: "Bad Request" });
    }
  });
};
