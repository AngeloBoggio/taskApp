const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
const session = require('express-session');
const {User} = require('./models/user');
const initializePassport = require('./passport-config');
const userController = require('./controllers/userController');

const PORT = process.env.PORT || 3001;


// initialize passport
const app = express();
initializePassport(passport);
app.use(passport.initialize());
app.use(cors());

// adding my mongodb connection string
const dbURI = 'mongodb+srv://gelobogx:vtrKWJYwO3naNcer@myfirstcluster.ohegfcw.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () =>{
            console.log(`Server started on port ${PORT}`);
        });
    })
    .catch((err) => console.log(err));


// setup passport middleware
app.use(express.json());
app.use(session({
    secret: '7432179417743294917508547391028393321469319800285376886682131708131379949611576377659258121094947976',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.session());

// setup user routes
app.use('/users', userController);



