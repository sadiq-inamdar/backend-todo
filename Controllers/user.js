const User = require("../Modals/user");
const Task = require("../Modals/task");
const expressJwt = require("express-jwt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const {ObjectId} = require('mongodb');

exports.addUser = async (req, res) => {
  const userExists = await User.findOne({ email: req.body.email });
  if (userExists)
    return res.status(403).json({
      error: "Email is taken!"
    });
  const user = await new User(req.body);
  await user.save();
  res.status(200).json({
    message: "Signup success! Please login."
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        error: "User with that email does no exist. Please Sign Up"
      });
    }
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email and Password do not match"
      });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.cookie("t", token, {
      expires: new Date(Date.now() + 900000)
    });
    const { _id, name, email } = user;
    return res.json({ token, user: { _id, email, name } });
  });
};

exports.getTasks = (req,res) => {
  console.log(req.body);
  let query = [
    {
        path : 'usertasks',
        select : {
            title : 1,
            description : 1
        }
    } 
  ]
  User.findOne({
    _id : ObjectId(req.body.user_id),
  },
  {
      usertasks : {
          $slice : [Number(req.body.skip_count),Number(req.body.tasks_On_One_Page)+1]
      }
  }).populate(query).exec((error,result) => {
      if(error) {
        return res.status(500).json({
          error: "Internal Server Error",
        });
      }
      else {
        console.log(result);
        res.status(200).json({
          tasks : result.usertasks
        });
      }
  })
}

exports.addTask = (req,res) => {
    User.updateOne({
      _id : ObjectId(req.body.user_id)
  },
  {
      $push : {
          usertasks : req.body.new_task_id,
      }
  },
  (error,result) => {
    if(error) {
      return res.status(500).json({
        error: 'Internal Server Error',
      });
    }
    else {
      console.log(result);
      res.status(200).json({
        message : 'Task Added SuccessFully',
        task_id : req.body.new_task_id,
      });
    }
  })
}

exports.deleteTask = (req,res) => {
    User.updateOne({
      _id : ObjectId(req.body.user_id)
  },
  {
      $pull : {
        usertasks : {
            $in : [ObjectId(req.body.task_id)]
        }
  }
  },
  (error,result) => {
    if(error) {
      return res.status(500).json({
        error: 'Internal Server Error',
      });
    }
    else {
      console.log(result);
      res.status(200).json({
        message : 'Task Removed SuccessFully'
      });
    }
  })
}

exports.logout = (req, res) => {
  res.clearCookie("t");
  return res.json({ message: "Signout success" });
};

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  userProperty: "auth"
});
