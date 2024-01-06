const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const session = require('express-session');
const patientRoute = require('./route/patientRoute');

const app = express();
const port = process.env.PORT || 5000;

mongoose.connect("mongodb+srv://Fiyinfoluwa:Fiyinfoluwa@healthcare-rest-api.s7gthlh.mongodb.net/healthcare?retryWrites=true&w=majority")
    .then(() => app.listen(port, () => console.log(`Server running on port ${port}`)))
    .catch(err => console.log(err));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dotenv.config();

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
}));

app.use('/patients', patientRoute);

app.get('/', (req, res) => res.send('Hello, world!'));
