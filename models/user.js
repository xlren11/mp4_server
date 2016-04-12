// Load required packages
var mongoose = require('mongoose');

// Define our beer schema
var UserSchema = new mongoose.Schema({
    name: {type:String, default:""},
    email: {type:String, default: ""},
    pendingTasks: {type:[String],index: true,default:[]},
    dateCreated: {type:Date, default:Date.now()}
});

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);