const express = require('express');
const dotenv = require('dotenv')
const connectDB = require('./config/db')

// ALLOW ACCESS TO CONFIGS
dotenv.config({path: './config/config.env'})

// Connect to DB
connectDB();

// Middleware
const transactions = require('./routes/transactions')
const users = require('./routes/users')

// INIT EXPRESS
const app = express();
app.use(express.json());

// IMPORT ROUTING
app.use('/api/v1/transactions', transactions)
app.use('/api/v1/users', users)

if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'))
}

// SERVER LISTENING ON HOST OR PORT 5000
const PORT = process.env.PORT || 5000; 
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}` ));

app.all('*', function(req, res) {
    res.redirect("/");
  });