 const{check,body}=require('express-validator')
 const express= require('express')
const { dirname } = require('path')
 const path=require('path')
 const router=express.Router()
 const admContrl=require('../controller/admin')
 const isAuth=require('../middleware/auth')

// const rootdir= require('../util/path')

  router.get('/add-product',isAuth,admContrl.getAddProduct)
 
  router.get('/products',isAuth,admContrl.getproduct)
   router.post('/add-product',[
   body('title','plz enter valid title').isAlphanumeric().isLength({min:4}),
   //body('imagurl','not valid url').isURL(),
   body('price','price not found').isFloat(),
   body('description','optional').isString()
   

   ],isAuth,admContrl.postAddProduct)
   router.get('/edit-product/:productid',isAuth,admContrl.getEditProduct)
   router.post('/edit-product',[
    body('title','plz enter valid title').isAlphanumeric().isLength({min:4}),
  //  body('imagurl','not valid url').isURL(),
   body('price','price not found').isFloat(),
   body('description','optional').isString()


   ],isAuth,admContrl.postEditProduct)
   router.delete('/product/:productid',isAuth,admContrl.Deleteproduct)
   

 module.exports=router


   
  