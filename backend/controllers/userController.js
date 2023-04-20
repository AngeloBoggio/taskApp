const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const router = express.Router();
const User = require('../models/user');
const generateToken = require('../utils/auth').generateToken;
const comparePassword = require('../utils/auth').comparePassword;
const passport = require('passport');
const app = express();

//user bodyparser middleware to parse the request body
app.use(bodyParser.json());

// route for user registration
router.post('/register', async (req, res) => {
    const {username, password} = req.body;
    try{
        // check if user already exists
        let user = await User.findOne({username});
        if(user){
            return res.status(409).json({msg: 'User already exists'});
        }
        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        // create new user
        user = new User({username, password: hashedPassword});
        await user.save();
        res.status(201).json({message: 'User registered successfully'});
    } catch (err) {
        console.error(err.message);
        res.status(500).json({error: 'Server error'});
    }
});

// route for user login
router.post('/login', passport.authenticate('local'), async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      const token = generateToken(user.id);
      res.json({ token });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({error: 'Server error'});
    }
});


//route for adding tasks for users
router.post('/tasks', passport.authenticate('jwt', {session: false}), async (req,res) => {
    const { title, description } = req.body;
    try{
        const user = await User.findById(req.user.id);

        if(!user) {
            return res.status(404).json({ error: 'User not found'});
        }

        const newTask = {
            title,
            description,
            completed: false,
        };

        user.tasks.push(newTask);
        user.totalTasks++;
        await user.save();

        res.status(201).json({ message: 'Task added successfully', task: newTask});
    } catch(err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error'});
    }
});

// route for editing a task
router.put('/tasks/:taskId', passport.authenticate('jwt', {session: false}), async(req,res) => {
    try{
        const user = await User.findById(req.user.id);
        const task = user.tasks.id(req.params.taskId);

        if(!task){
            return res.status(404).json({error: 'Task not found'});
        }

        const { title, description, completed} = req.body;

        task.title = title || task.title;
        task.description = description || task.description;
        task.completed = completed !== undefined ? completed : task.completed;

        await user.save();

        res.status(200).json({ message: 'Task updated successfully', task});
    } catch (err) {
        console.error(err.message);
        res.status(500).json({error: 'Server error'});
    }
});

// route for deleting a task
router.delete('/tasks/:taskId', passport.authenticate('jwt', { session: false}), async (req, res) => {
    try{
        const user = await User.findById(req.user.id);
        const task = user.tasks.id(req.params.taskId);

        if(!task){
            return res.status(404).json({ error: 'Task not found'});
        }

        user.tasks.pull({ _id:req.params.taskId});
        user.totalTasks--;
        if(task.completed){
            user.completedTasks--;
        }
        await user.save();

        res.status(200).json({ message: 'Task deleted successfully'});
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error'});
    }
});

// route for marking a task as complete
router.put('/tasks/:taskId/complete', passport.authenticate('jwt', {session: false}), async(req, res) => {
    try{
        const user = await User.findById(req.user.id);
        const task = user.tasks.id(req.params.taskId);

        if(!task){
            return res.status(404).json({ error: 'Task not found'});
        }

        task.completed = true;
        user.completedTasks++;
        await user.save();

        res.status(200).json({ message: 'Task marked as complete', task});
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error'});
    }
})


// sending the task count to the front end
router.get('/tasks', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try{
        const user = await User.findById(req.user.id);
        const tasks = user.tasks;
        res.status(200).json({ tasks, totalTasks: user.totalTasks, completedTasks: user.completedTasks});
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error'});
    }
});

module.exports = router;