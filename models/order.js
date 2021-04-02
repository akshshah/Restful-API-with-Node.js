const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
   _id: mongoose.Schema.Types.ObjectId,
   product: {
      type: mongoose.Schema.Types.ObjectId,  // the id of product
      ref: 'Product', //it will refer to Product Schema
      required: true
   },
   quantity: {
      type: Number,
      default: 1
   }
});

module.exports = mongoose.model('Order', orderSchema);