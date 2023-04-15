const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');

const taskSchema = new Schema({
  title: String,
  description: String,
  completed: Boolean,
});

const userSchema = new Schema({
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    tasks: [taskSchema],
  });
  
  userSchema.methods.validPassword = async function (password) {
    try{
        return await bcrypt.compare(password,this.password);
    } catch (err) {
        throw err;
    }
  };
  
  const User = mongoose.model('Users', userSchema);
  
  module.exports = User;
  