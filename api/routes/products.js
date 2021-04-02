const express = require('express')
const router = express.Router();
const Product = require('../../models/product');
const mongoose = require('mongoose');
const multer = require('multer');
const auth = require('../middleware/auth');

const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, './uploads');
   },
   filename: function (req, file, cb) {
      cb(null, file.originalname);
   }
})

const fileFilter = (req, file, cb) => {
   //reject a file, use    cb(null,false);

   if (file.mimetype === 'image/jpeg' || 'image/png') {
      //save a file
      cb(null, true);
   }
   else {
      cb(null, false);
   }
};

const upload = multer({
   storage: storage,
   limits: {
      fileSize: 1024 * 1024 * 5 //5 mb
   },
   fileFilter: fileFilter
});

router.get('/', (req, res, next) => {
   //Product.find().limit  this is use when to limit items from databse
   Product.find()
      .select('name price _id productImage') // Only the mentioned fields will return back
      .exec()
      .then(products => {

         const response = {
            count: products.length,
            products: products.map(product => {
               return {
                  name: product.name,
                  price: product.price,
                  _id: product._id,
                  productImage: product.productImage,
                  request: {
                     type: 'GET',
                     url: 'http://localhost:3000/products/' + product._id
                  }
               }
            })
         };

         // if(products.length >= 0){
         res.status(200).json(response);
         // }
         // else{
         //    res.status(404).json({
         //       message: 'Empty list of roducts'
         //    });
         // }
      })
      .catch(err => {
         console.log(err);
         res.status(500).json({
            error: err
         });
      });
});

router.post('/', auth, upload.single('productImage'), (req, res, next) => {

   console.log(req.file);

   const product = new Product({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      price: req.body.price,
      productImage: req.file.path
   });

   //Save method is provided by mongoose, which can only be use with mongoose models
   product.save().then(result => {
      console.log(result);
      res.status(201).json({
         createdProduct: {
            name: result.name,
            price: result.price,
            _id: result._id,
            productImage: result.productImage,
            request: {
               type: 'GET',
               url: 'http://localhost:3000/products/' + result._id
            }
         }
      })
   }).catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
   });

});



router.get('/:productId', (req, res, next) => {
   const id = req.params.productId;
   Product.findById(id)
      .select('name price _id productImage')
      .exec()
      .then(product => {
         console.log(product);
         if (product) {
            res.status(200).json({
               product: {
                  name: product.name,
                  price: product.price,
                  _id: product._id,
                  productImage: product.productImage,
                  request: {
                     type: 'GET',
                     url: 'http://localhost:3000/products'
                  }
               }
            });
         }
         else {
            res.status(404).json({ message: "No Product Found" });
         }
      })
      .catch(err => {
         console.log(err);
         res.status(500).json({ error: err });
      });
});

router.patch('/:productId', auth, (req, res, next) => {
   const id = req.params.productId;
   Product.findByIdAndUpdate(id, { $set: req.body }, { new: true })
      .then(result => res.status(200).json({
         updatedProduct: {
            name: result.name,
            price: result.price,
            _id: result._id,
            productImage: product.productImage,
            request: {
               type: 'GET',
               url: 'http://localhost:3000/products/' + result._id
            }
         }
      }))
      .catch(err => res.status(500).json({ error: err }));
});


router.delete('/:productId', auth, (req, res, next) => {
   const id = req.params.productId;
   Product.findByIdAndDelete(id)
      .exec()
      .then(result => {
         res.status(200).json({
            message: "Product Deleted Successfully"
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