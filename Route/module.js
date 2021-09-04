const Module = require("../Model/module");
const User = require("../Model/user");
const mongoose = require("mongoose");
const _ = require("lodash");
const { parse } = require("json2csv");

const fields = [
  "userCode",
  "name",
  "email",
  "completeModuleName",
  "mark",
  "leaderBoard",
];
const opts = { fields };
const resArr = [];

module.exports = function (app) {
  // @desc /api/modules
  app.post("/api/modules", async (req, res) => {
    const { body } = req;
    try {
      let module = new Module({
        userId: new mongoose.Types.ObjectId(`${body.userid}`),
        completedModuleName: body.modulename,
        totalMark: body.tmark,
        correctMark: body.cmark,
      });

      newModule = await module.save();
      if (newModule) {
        res.status(201).json({ info: newModule });
      }
    } catch (err) {
      res.status(400).json({ message: "Bad Request!" });
    }
  });

  // @desc /api/modules/search
  app.get("/api/modules/search", async (req, res) => {
    let { user_code, modulename, sortOrder } = req.query;
    if (sortOrder === undefined) {
      sortOrder = "asc";
    }

    if (user_code || modulename)
      try {
        if (modulename != null) {
          const module = await Module.find({
            completedModuleName: modulename,
          })
            .populate("userId", "userCode name email")
            .exec();

          const result = makeResponse(module, true, sortOrder);
          // resArr = [...result];
          return res.status(200).json(result);
        } else {
          const user = await User.findOne({ userCode: user_code });
          if (user) {
            const { userCode, name, email } = user;
            const obj1 = { userCode, name, email };
            const module = await Module.find({ userId: user._id });
            const result = makeResponse(module, false, sortOrder, obj1);
            // resArr = [...result];
            return res.status(200).json(result);
          } else {
            return res.status(404).json({ message: "User not Found." });
          }
        }
      } catch (err) {}
    else return res.status(404).json({ message: "Data not found." });
  });

  // @desc /api/modules/report/download
  app.delete("/api/modules/:id", async (req, res) => {
    const { id } = req.params;
    try {
      if (id) {
        const objId = new mongoose.Types.ObjectId(id);
        const module = await Module.findByIdAndDelete(objId);

        if (module) {
          return res
            .status(200)
            .json({ message: "successfully deleted the module." });
        } else {
          return res
            .status(404)
            .json({ message: "Module with the given id doesn't exists." });
        }
      } else {
        return res.status(400).json({ message: "Please provide id." });
      }
    } catch (err) {
      return res.status(400).json({ message: "Bad Request" });
    }
  });

  // @desc /api/modules/report/download
  app.get("/api/modules/report/download", async (req, res) => {
    const csv = parse(
      ["eoiee", "imon", "user@gmail.com", ["reactjs", "mongodb"], "70/100", 2],
      opts
    );
    return res.status(200).json({ message: "Download successfull", csv: csv });
  });
};

function makeResponse(obj, flag, sortOrder, rest) {
  let newArr = [];
  if (_.isArray(obj)) {
    for (let item of obj) {
      const result = `${item.correctMark}/${item.totalMark}`;
      const newObj = _.pick(item, [
        flag && "userId.userCode",
        flag && "userId.name",
        flag && "userId.email",
        "completedModuleName",
      ]);
      let newObj1 = {};
      if (flag) {
        const property = newObj.completedModuleName;
        newObj1 = { ...newObj.userId, property };
      } else {
        newObj1 = { ...rest, ...newObj };
      }
      newObj1.mark = result;
      newArr.push(newObj1);
    }
  } else {
    const result = `${obj.correctMark}/${obj.totalMark}`;
    const newObj = _.pick(obj, [
      flag && "userId.userCode",
      flag && "userId.name",
      flag && "userId.email",
      "completedModuleName",
    ]);
    let newObj1 = {};
    if (flag) {
      const property = newObj.completedModuleName;
      newObj1 = { ...newObj.userId, property };
    } else {
      newObj1 = { ...rest, ...newObj };
    }
    newObj1.mark = result;
    newArr.push(newObj1);
  }
  // return newArr;
  return sortOrderA(newArr, sortOrder);
}

function sortOrderA(arr, order) {
  let sortedArr = [];

  if (order === "asc") {
    sortedArr = [
      ...arr.sort((a, b) =>
        parseInt(a.mark.split("/")[0]) > parseInt(b.mark.split("/")[0]) ? 1 : -1
      ),
    ];
  }
  if (order === "desc") {
    sortedArr = [
      ...arr
        .sort((a, b) =>
          parseInt(a.mark.split("/")[0]) > parseInt(b.mark.split("/")[0])
            ? 1
            : -1
        )
        .reverse(),
    ];
  }

  for (let i = 0; i < sortedArr.length; i++) {
    sortedArr[i].leaderboard = i + 1;
  }
  return sortedArr;
}
