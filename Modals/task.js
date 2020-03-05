const mongoose = require("mongoose");
const schema = mongoose.Schema;

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  ownerid: {
    type: schema.Types.ObjectId,
    ref: "users"
  }
});

const task = mongoose.model("tasks", taskSchema);
module.exports = task;
