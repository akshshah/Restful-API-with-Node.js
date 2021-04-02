const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();
const productsRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');


//MongoDB Connection

mongoose
   .connect("mongodb+srv://admin:" + process.env.MONGO_ATLAS_PW + "@node-rest-shop.bp0py.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, })
   .then(() => console.log("MongoDB Connected"))
   .catch(err => console.log(err));


app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/uploads', express.static('uploads'));
app.use('/products', productsRoutes);
app.use('/orders', ordersRoutes);
app.use('/user', userRoutes);

//Handling CORS Errors
app.use((req, res, next) => {
   res.header('Access-Control-Allow-Origin', '*');
   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-type, Accept,Authorization');

   if (req.method === 'Options') {
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
      return res.status(200).json({});
   }
   next();
});

//Handling Errors (routes which don't exist), because after checking above routes only
//then it will come to this line.
app.use((req, res, next) => {
   const error = new Error('Not Found');
   error.status = 404
   next(error); // Throwing the error to the below. 
});


//Below is the error Handler
// It will catch any error that is thrown by any part of our application
app.use((error, req, res, next) => {
   res.status(error.status || 500);
   res.json({
      error: {
         message: error.message
      }
   });
});

module.exports = app;