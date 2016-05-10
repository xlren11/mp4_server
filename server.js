// Get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var User = require('./models/user');
var Task = require('./models/task');
var bodyParser = require('body-parser');
var router = express.Router();

//replace this with your Mongolab URL
//mongoose.connect('mongodb://localhost/mp4');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    console.log("Database connected");
});
//console.log("mongoose readystate:"+ mongoose.connection.readyState);

// Create our Express application
var app = express();

// Use environment defined port or 4000
var port = process.env.PORT || 4000;

//Allow CORS so that backend and frontend could pe put on different servers
var allowCrossDomain = function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS, DELETE");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
    next();
};
app.use(allowCrossDomain);

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// All our routes will start with /api
app.use('/api', router);

//Default route here
var homeRoute = router.route('/');

homeRoute.get(function(req, res) {
    re
});

//Add more routes here

var userRoute = router.route('/users');
userRoute.get(function(req, res) {
    var where = null;
    var sort = null;
    var select = null;
    var skip = null;
    var limit = null;
    var count = null;
    if (req.query.where != null && req.query.where != "" && req.query.where != undefined) {
        where = JSON.parse(req.query.where.replace(/'/g,'"'));
    }
    if (req.query.sort != null && req.query.sort != "" && req.query.sort != undefined) {
        sort = JSON.parse(req.query.sort);
    }
    if (req.query.select != null && req.query.select != "" && req.query.select != undefined) {
        select = JSON.parse(req.query.select);
    }
    if (req.query.skip != null && req.query.skip != "" && req.query.skip != undefined) {
        skip = req.query.skip;
    }
    if (req.query.limit != null && req.query.limit != "" && req.query.limit != undefined) {
        limit = req.query.limit;
    }
    if (req.query.count != null && req.query.count != "" && req.query.count != undefined) {
        count = req.query.count;
    }
    if (count) {
        User.find(where).sort(sort).select(select).skip(skip).limit(limit).count().exec(function (err, cnt) {
            if (err) {
                res.status(500).json({message: 'Error happened!', data: err});
            }
            else {
                res.status(200).json({message: 'Number of users!!', data: cnt});
            }
        })
    }
    else {
        User.find(where).sort(sort).select(select).skip(skip).limit(limit).exec(function (err, user) {
            if (err) {
                res.status(500).json({message: 'Error happened!', data: err});
            }
            else if (user == "") {
                res.status(404).json({message: 'No data found!!', data: user});
            }
            else {
                res.status(200).json({message: 'Data found!!', data: user});
            }
        })
    }
})
userRoute.post(function(req, res) {
    if (req.body.email == '' || req.body.email == null || req.body.email == undefined || req.body.name == null || req.body.name == '' || req.body.name == undefined) {
        res.status(404).json({message: 'invalid data'});
    }
    else {

        var user = new User();

        if (req.body.name != null && req.body.name != "" && req.body.name != undefined) {
            user.name = req.body.name;
        }
        if (req.body.email != null && req.body.email != "" && req.body.email != undefined) {
            user.email = req.body.email;
        }
        if (req.body.pendingTasks != null && req.body.pendingTasks != "" && req.body.pendingTasks != undefined) {
            user.pendingTasks = req.body.pendingTasks;
        }
        if (req.body.dateCreated != null && req.body.dateCreated != "" && req.body.dateCreated != undefined) {
            user.dateCreated = req.body.dateCreated;
        }
        //
        //if (user.name == "" || user.name == null || user.name == undefined || user.email == "" || user.email == null || user.email == undefined) {
        //    res.status(500).json({message: ' Missing name or email.'});
        //}
        else {
            User.find({email: req.body.email}, function (err, ret) {
                if (err) {
                    res.status(500).json({message: 'Error happened!'});
                }
                else if (ret != "" && ret != null && ret != undefined) {
                    res.status(500).json({message: 'Email already exist!'});
                }
                else {
                    user.save(function (err, user) {
                        if (err) {
                            res.status(500).json({message: 'Error happened!', data: err});
                        }
                        else {
                            res.status(201).json({message: 'User created!', data: user});
                        }
                    });
                }
            });
        }
    }
})
userRoute.options(function(req, res){
    res.writeHead(200);
    res.end();
});

var userIdRoute = router.route('/users/:user_id');
userIdRoute.get(function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
        if (err) {
            res.status(500).json({message: 'Error happened!', data: err});
        }
        else if (user == "" || user == null || user == undefined) {
            res.status(404).json({message: 'No data found!', data: err});
        }
        else {
            res.status(200).json({message: 'Data found!', data: user});
        }
    });
})

userIdRoute.put(function(req, res) {
    if (req.body.email == '' || req.body.email == null || req.body.email == undefined || req.body.name == null || req.body.name == '' || req.body.name == undefined) {
        res.status(404).json({message: 'invalid data'});
    }
    else {
        User.findById(req.params.user_id, function (err, user) {
            if (err) {
                res.status(500).json({message: 'Error happened!', data: err});
            }
            else if (user == "" || user == null || user == undefined) {
                res.status(404).json({message: 'Invalid User', data: err});
            }
            else {
                User.find({email: req.body.email}, function (err, ret) {
                    if (err) {
                        res.status(404).json({message: 'Error happened!', data: err});
                    }
                    else if (ret != "") {
                        if (req.body.name != null && req.body.name != "" && req.body.name != undefined) {
                            user.name = req.body.name;
                        }
                        if (req.body.email != null && req.body.email != "" && req.body.email != undefined) {
                            user.email = req.body.email;
                        }
                        if (req.body.pendingTasks != null && req.body.pendingTasks != undefined) {
                            user.pendingTasks = req.body.pendingTasks;
                        }
                        if (req.body.dateCreated != null && req.body.dateCreated != "" && req.body.dateCreated != undefined) {
                            user.dateCreated = req.body.dateCreated;
                        }
                        user.save(function (err, user) {
                            if (err) {
                                res.status(404).json({message: 'Error happened!', data: err});
                            }
                            else {
                                res.status(200).json({message: 'User updated!', data: user});
                            }
                        })
                    }
                    else {
                        res.status(200).json({message: ' Email already exist!'});
                    }
                });
            }
        });
    }
})
userIdRoute.delete(function(req, res) {
    //console.log("delete userid: "+req.params.user_id+'\n');
    User.findById(req.params.user_id, function(err, user) {
        if (err) {
            res.status(500).json({message: 'Error happened!', data: err});
        }
        else if (user == "" || user == null || user == undefined) {
            res.status(404).json({message: 'Invalid User', data: err});
        }
        else {
            User.remove({_id: req.params.user_id}, function (err) {
                if (err) {
                    res.status(500).json({message: 'Error happened!', data: err});
                }
                else {
                    res.status(200).json({message: 'User deleted!'});
                }
            });
        }
    });
});

var taskRoute = router.route('/tasks');

taskRoute.get(function(req, res) {
    var where = null;
    var sort = null;
    var select = null;
    var skip = null;
    var limit = null;
    var count = null;
    if (req.query.where != null && req.query.where != "" && req.query.where != undefined) {
        where = JSON.parse(req.query.where.replace(/'/g,'"'));
    }
    if (req.query.sort != null && req.query.sort != "" && req.query.sort != undefined) {
        sort = JSON.parse(req.query.sort);
    }
    if (req.query.select != null && req.query.select != "" && req.query.select != undefined) {
        select = JSON.parse(req.query.select);
    }
    if (req.query.skip != null && req.query.skip != "" && req.query.skip != undefined) {
        skip = req.query.skip;
    }
    if (req.query.limit != null && req.query.limit != "" && req.query.limit != undefined) {
        limit = req.query.limit;
    }
    if (req.query.count != null && req.query.count != "" && req.query.count != undefined) {
        count = req.query.count;
    }
    if (count) {
        Task.find(where).sort(sort).select(select).skip(skip).limit(limit).count().exec(function (err, cnt) {
            if (err) {
                res.status(500).json({message: 'Error happened!', data: err});
            }
            else {
                res.status(200).json({message: 'Number of tasks', data: cnt});
            }
        });
    }
    else {
        Task.find(where).sort(sort).select(select).skip(skip).limit(limit).exec(function (err, task) {
            if (err) {
                res.status(500).json({message: 'Error happened!', data: err});
            }
            else if (task == "") {
                res.status(404).json({message: 'No data found!!', data: task});
            }
            else {
                res.status(200).json({message: 'Data found!!', data: task});
            }
        });
    }
})
taskRoute.post(function(req, res) {
    if (req.body.deadline == '' || req.body.deadline == null || req.body.deadline == undefined || req.body.name == null || req.body.name == '' || req.body.name == undefined) {
        res.status(404).json({message: 'invalid data'});
    }
    else {



        var task = new Task();
        if (req.body.name != null && req.body.name != "" && req.body.name != undefined) {
            task.name = req.body.name;
        }
        if (req.body.description != null && req.body.description != "" && req.body.description != undefined) {
            task.description = req.body.description;
        }
        if (req.body.deadline != null && req.body.deadline != "" && req.body.deadline != undefined) {
            task.deadline = req.body.deadline;
        }

        task.completed = false;
        //if (req.body.completed != null && req.body.completed != "" && req.body.completed != undefined) {
        //    task.completed = req.body.completed;
        //}
        if (req.body.assignedUser != null && req.body.assignedUser != "" && req.body.assignedUser != undefined) {
            task.assignedUser = req.body.assignedUser;
        }
        if (req.body.assignedUserName != null && req.body.assignedUserName != "" && req.body.assignedUserName != undefined) {
            task.assignedUserName = req.body.assignedUserName;
        }
        if (req.body.dateCreated != null && req.body.dateCreated != "" && req.body.dateCreated != undefined) {
            task.dateCreated = req.body.dateCreated;
        }
        //if (task.name == "" || task.name == null || task.name == undefined || task.deadline == "" || task.deadline == null || task.deadline == undefined) {
        //    res.status(500).json({message: ' Missing name or deadline.'});
        //}
        else {
            task.save(function (err) {
                if (err) {
                    res.status(500).json({message: 'Error happened!', data: err});
                }
                else {
                    res.status(201).json({message: 'Task created!', data: task});
                }
            });
        }
    }
})



taskRoute.options(function(req, res){
  res.writeHead(200);
  res.end();
});

var taskIdRoute = router.route('/tasks/:task_id');

taskIdRoute.get(function(req, res) {
    Task.findById(req.params.task_id, function (err, task) {
        if (err) {
            res.status(500).json({message: 'Error happened!', data: err});
        }
        else if (task == "" || task == null || task == undefined) {
            res.status(404).json({message: 'Task not found!', data: err});
        }
        else {
            res.json({message: 'Task found!', data: task});
        }
    });
})

taskIdRoute.put(function(req, res) {
    if (req.body.deadline == '' || req.body.deadline == null || req.body.deadline == undefined || req.body.name == null || req.body.name == '' || req.body.name == undefined) {
        res.status(404).json({message: 'invalid data'});
    }
    else {
        Task.findById(req.params.task_id, function (err, task) {
            if (err) {
                res.status(500).json({message: 'Error happened!', data: err});
            }
            else if (task == "" || task == null || task == undefined) {
                res.status(404).json({message: 'Invalid Task', data: err});
            }
            else {
                //console.log("put tasks: " + req.body.name + '\n');
                if (req.body.name != null && req.body.name != "" && req.body.name != undefined) {
                    task.name = req.body.name;
                }
                if (req.body.description != null && req.body.description != undefined) {
                    task.description = req.body.description;
                }
                if (req.body.deadline != null && req.body.deadline != "" && req.body.deadline != undefined) {
                    task.deadline = req.body.deadline;
                }
                if (req.body.completed == true || req.body.completed == false) {
                    task.completed = req.body.completed;
                }
                if (req.body.assignedUser != null && req.body.assignedUser != undefined) {
                    task.assignedUser = req.body.assignedUser;
                }
                if (req.body.assignedUserName != null && req.body.assignedUserName != "" && req.body.assignedUserName != undefined) {
                    task.assignedUserName = req.body.assignedUserName;
                }
                if (req.body.dateCreated != null && req.body.dateCreated != "" && req.body.dateCreated != undefined) {
                    task.dateCreated = req.body.dateCreated;
                }

                task.save(function (err, task) {
                    if (err) {
                        res.status(500).json({message: 'Error happened!', data: err});
                    }
                    else {
                        //console.log("user updated");
                        res.status(200).json({message: 'User updated!', data: task});
                    }
                });
            }
        });
    }
})

taskIdRoute.delete(function(req, res) {
    Task.findById(req.params.task_id, function (err, task) {
        if (err) {
            res.status(500).json({message: 'Error happened!', data: err});
        }
        else if (task == '') {
            res.status(404).json({message: 'Invalid Task!', data: err});
        }
        else {
            Task.remove({_id: req.params.task_id}, function (err) {
                if (err) {
                    res.status(404).json({message: 'Error happened!', data: err});
                }
                else {
                    res.status(200).json({message: 'Task deleted!'});
                }
            });
        }
    });
});



// Start the server
app.listen(port);
console.log('Server running on port ' + port);
