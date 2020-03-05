const Task = require("../Modals/task");

const {ObjectId} = require('mongodb');

exports.createTask = async (req,res,next) => {
  // const task = await new Task({
  //   title : req.body.new_task_title,
  //   description : req.body.new_task_description,
  //   ownerid : req.body.user_id,
  // });
  // await task.save();
  // res.status(200).json({
  //   message: "Signup success! Please login."
  // });

  Task.create({
    title : req.body.new_task_title,
    description : req.body.new_task_description,
    ownerid : req.body.user_id,
  },
  (error,result) => {
    if(error) {
      return res.status(500).json({
        error: "Internal Server Error",
      });
    }
    else {
      req.body.new_task_id = result._id;
      next();
    }
  })

};

exports.updateTask = (req,res) => {
  Task.updateOne(
    {
      _id: ObjectId(req.body.task_id)
    },
    {
      $set: {
        title: req.body.task_title_new,
        description: req.body.task_description_new
      }
    },
    (error, result) => {
      if(error) {
        return res.status(500).json({
          error: 'Internal Server Error',
        });
      }
      else {
        console.log(result);
        res.status(200).json({
          message : 'Task Updated SuccessFully'
        });
      }
    }
  );
};
