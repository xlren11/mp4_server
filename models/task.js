// Load required packages
var mongoose = require('mongoose');

// Define our beer schema
var TaskSchema   = new mongoose.Schema({
    name: {type:String, default:""},
    description: {type: String, default: ""},
    deadline: {type: Date, default: null},
    completed: {type: Boolean, default: false},
    assignedUser: {type:String, default:""},
    assignedUserName:{type:String, default: "unassigned"},
    dateCreated: {type:Date, default:Date.now()}
});

// Export the Mongoose model
module.exports = mongoose.model('Task', TaskSchema);