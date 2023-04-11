  const  express=require('express')
  const path=require('path')
  const router=express.Router();
  const shopContrl=require('../controller/shop')
  const isAuth=require('../middleware/auth')
// router.use("/public",express.static('public'))
 // const rootdir= require('../util/path')
  //const adminRouter=require('./admin')
  //const prods=adminRouter.products;
   router.get('/',shopContrl.getIndex)
   router.get('/products',shopContrl.getProducts)
   router.get('/products/:productid',shopContrl.getPPt)
  
   router.get('/cart',isAuth,shopContrl.cart)
   router.post('/cart',isAuth,shopContrl.postCart)
     router.get('/orders',isAuth,shopContrl.orders)
    router.post('/cart-delete-item',isAuth,shopContrl.deleteCartprods)
    router.get('/checkout',isAuth,shopContrl.getCheckout)
    router.get('/checkout/cancel',isAuth,shopContrl.getCheckout)
    router.get('/checkout/success',isAuth,shopContrl.getCheckoutSuccess)
    
    

  // router.post('/order-item',isAuth,shopContrl.postOrders)
   router.get("/order/:orderId",isAuth,shopContrl.getinvoice)
 
 
  module.exports=router;
