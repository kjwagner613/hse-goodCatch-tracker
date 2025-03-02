const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');

const authController = require('./controllers/auth.js');

const port = process.env.PORT ? process.env.PORT : '3000';

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

const companySites = [
  {
    id: 1,
    siteName: 'Baldwin Park',
  },
  {
    id: 2,
    siteName: 'Carpinteria',
  },
  {
    id: 3, 
    siteName: 'Boston',
  }]


  const eventCategories = [
    {
      id: 1,
      eventName: 'slip and fall',
    },
    {
      id: 2,
      eventName: 'hazardous materials',
    },
    {
      id: 3, 
      eventName: 'improper weight dispersion',
    },
    {
      id: 4,
      eventName: 'PPE defective or missing',
  }]

  const corpDepartments = [
    {
      id: 1,
      departmentName: 'Warehouse',
    },
    {
      id: 2,
      departmentName: 'Manufacturing',
    },
    {
      id: 3, 
      departmentName: 'HR',
    },
    {
      id: 4,
      departmentName: 'Customer Service',
  }]


app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
// app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.get('/', (req, res) => {
  res.render('index.ejs', {
    user: req.session.user,
  });
});

app.get('/vip-lounge', (req, res) => {
  if (req.session.user) {
    res.send(`Welcome to the party ${req.session.user.username}.`);
  } else {
    res.send('Sorry, no guests allowed.');
  }
});

app.use('/auth', authController);

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
