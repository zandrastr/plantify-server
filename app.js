require('dotenv').config()
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index.routes');
const cors = require('cors');

var app = express();

const mongoose = require('mongoose');
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', indexRouter);

const authRoutes = require('./routes/auth.routes');
app.use('/api', authRoutes);

const userRoutes = require('./routes/user.routes');
app.use('/api', userRoutes);

const plantRoutes = require('./routes/plant.routes');
app.use('/api', plantRoutes);

// Connect to MongoDB database
async function init () {
    try {
      await mongoose.connect(MONGO_URI);
      console.log("Connected to database!")    
    } catch (error) {
        console.log("Error connecting to database:", error);    
    }
};
  
init();

module.exports = app;