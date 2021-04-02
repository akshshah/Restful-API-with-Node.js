const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../../models/order');
const Product = require('../../models/product');
const auth = require('../middleware/auth');


router.get('/', auth, (req, res, next) => {
   Order.find()
      .select('product quantity _id')
      .populate('product', 'name price _id') // To show product Object instead of just productId , the second parameter is same as "select" which parameters to show.
      .exec()
      .then(orders => {
         res.status(200).json({
            count: orders.length,
            orders: orders
         })
      })
      .catch(err => {
         res.status(500).json({
            error: err
         });
      });
});

router.post('/', auth, (req, res, next) => {

   Product.findById(req.body.productId)
      .then(product => {

         if (!product) {
            return res.status(404).json({
               message: 'Product not found'
            });
         }

         const order = new Order({
            _id: mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId
         });

         return order.save()

      })
      .then(result => {
         console.log(result);
         res.status(201).json({
            orderCreated: {
               _id: result._id,
               quantity: result.quantity,
               product: result.product
            }
         })
      }).catch(err => {
         console.log(err);
         res.status(500).json({ error: err });
      });

});


router.get('/:orderId', auth, (req, res, next) => {
   Order.findById(req.params.orderId)
      .populate('product', 'name price _id')
      .exec()
      .then(order => {
         if (order) {
            res.status(200).json({
               order: {
                  _id: order._id,
                  quantity: order.quantity,
                  product: order.product
               }
            });
         }
         else {
            res.status(404).json({ message: "No Order Found" });
         }
      })
      .catch(err => {
         res.status(500).json({ error: err });
      });
});


router.delete('/:orderId', auth, (req, res, next) => {
   const id = req.params.orderId;
   Order.findByIdAndDelete(id)
      .exec()
      .then(result => {
         res.status(200).json({
            message: "Order Deleted Successfully"
         });
      })
      .catch(err => {
         console.log(err);
         res.status(500).json({
            error: err
         });
      });
});




module.exports = router;