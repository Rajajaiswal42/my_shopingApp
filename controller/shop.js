const Product = require('../model/product');
const Order=require('../model/order')
const fs=require('fs')
const path=require('path')
const pdfDoc=require("pdfkit")
// const path = require('../util/path');
const mongoose=require('mongoose')
const stripe=require('stripe')('sk_test_51Mpp1WSFUuqmvbkHyVrPaGCQOcRt5IAgNZzz6HOwMXV8EaJ9k3g1rMNxEhOrdpfbDbaNc5lTcjIFNb7nDIQKH53r008iKvFVxj')
const items_per_page=1

//sk_test_51Mpp1WSFUuqmvbkHyVrPaGCQOcRt5IAgNZzz6HOwMXV8EaJ9k3g1rMNxEhOrdpfbDbaNc5lTcjIFNb7nDIQKH53r008iKvFVxj


exports.getProducts = (req, res, next) => {
  const page=+req.query.page||1
  let  totalItems;
  Product.find()
  .countDocuments()
  .then(numProds => {
    totalItems = numProds;
    return  Product.find()
    .skip((page-1)*items_per_page)
    .limit(items_per_page)})
  .then(products=>{
    res.render('shop/product-list', {
      prods: products,
      pagetitle: 'product-list',
      path: '/products',
      isAuthenticated: req.session.isLoggedin,
      csrfToken:req.csrfToken(),
      currentpage:page,
      hasNextpage:items_per_page*page<totalItems,
      hasPreviouspage:page>1,
      nextpage:page+1,
      previouspage:page-1,
      lastpage:Math.ceil(totalItems/items_per_page)

  })
  })
  .catch(err => {
    //console.log(err);
    const error=new Error(err)
    error.httpstatusCode=500
    return next(error)
  });
  }


    exports.getPPt = (req,res,next)=>{
    const prodId=req.params.productid
    Product.findById(prodId).then(products=>{
      res.render("Shop/product-detail", {
        product:products,
        pagetitle:products.title,
        path:"/products"    ,
        isAuthenticated: req.session.isLoggedin,
        csrfToken:req.csrfToken()
       
    })
    })  .catch(err => {
      //console.log(err);
      const error=new Error(err)
      error.httpstatusCode=500
      return next(error)
    });

    }
    
   
  
  

exports.getIndex = (req, res, next) => {
  const page=+req.query.page||1
  let  totalItems;
  Product.find()
  .countDocuments()
  .then(numProds => {
    totalItems = numProds;
    return  Product.find()
    .skip((page-1)*items_per_page)
    .limit(items_per_page)})

    .then(products=>{
      res.render('shop/index', {
        prods: products,
        pagetitle: 'Shop',
        path: '/',
        isAuthenticated:  req.session.isLoggedin,
        csrfToken:req.csrfToken() ,
        currentpage:page,
        hasNextpage:items_per_page*page<totalItems,
        hasPreviouspage:page>1,
        nextpage:page+1,
        previouspage:page-1,
        lastpage:Math.ceil(totalItems/items_per_page)

      })}

    ) 

  .catch(err => {
    //console.log(err);
    const error=new Error(err)
    error.httpstatusCode=500
    return next(error)
  });
}


exports.postCart = (req, res, next) => {
  const prodId = req.body.productid;
  Product.findById(prodId)
  .then(products=>{
    req.user.addToCart(products)
   // console.log(products)
  }).then(Data=>{
    res.redirect('/cart')
  })
  .catch(err => {
    //console.log(err);
    const error=new Error(err)
    error.httpstatusCode=500
    return next(error)
  });

}
exports.cart=(req,res,next)=>{
req.user
   .populate('cart.items.productid')
   .then(data=>{
    const products=data.cart.items
    //console.log(products)
     res.render('./shop/cart', {
  path:'/cart',
  pagetitle:' your cart',
  products:products,
  isAuthenticated: req.session.isLoggedin,
  csrfToken:req.csrfToken()

 

  })

}
)  .catch(err => {
  //console.log(err);
  const error=new Error(err)
  error.httpstatusCode=500
  return next(error)
});

}


exports.deleteCartprods=(req,res,next)=>{
  const prodId=req.body.productid;
 req.user
 .deleteFromCart(prodId)
 .then(()=>res.redirect('/cart'))
 .catch(err => {
  //console.log(err);
  const error=new Error(err)
  error.httpstatusCode=500
  return next(error)
});
}
exports.getCheckout=(req,res,next)=>{
 let products;
 let total=0;
  req.user
   .populate('cart.items.productid')
   .then(data=>{
     products=data.cart.items
     products.forEach(p=>{
      total+=p.quantity*p.productid.price
     })
    //console.log(products)
    return stripe.checkout.sessions.create({
      payment_method_types:['card'],
      mode:"payment",
      line_items:products.map(p=>{
        return{
          price_data: {
          //  # The currency parameter determines which
            // # payment methods are used in the Checkout Session.
              currency: 'INR',
                product_data: {
                  name: p.productid.title,
                },
                unit_amount: p.productid.price,
              },
              quantity: p.quantity,
      }
    
    }),
       success_url:req.protocol + '://'+req.get('host') + '/checkout/success',
       cancel_url:req.protocol + '://'+req.get('host') + '/checkout/cancel'
    })
   
})
.then(session=>{
  res.render('./shop/checkout', {
    path:'/checkout',
    pagetitle:' order Now',
    products:products,
    isAuthenticated: req.session.isLoggedin,
    csrfToken:req.csrfToken(),
    total:total,
    sessionId:session.id
  
    })
  
}) 

.catch(err => {
  //console.log(err);
  const error=new Error(err)
  error.httpstatusCode=500
  return next(error)
});


}

exports.orders=(req,res,next)=>{
   Order.find({'user.userId':req.user._id})
  .then(orders=>{
    res.render('shop/orders',{
      path:'/orders',
      pagetitle:'your orders',
      orders:orders,
      isAuthenticated: req.session.isLoggedin,
      csrfToken:req.csrfToken()
      
      })
    
 })}
 exports.getCheckoutSuccess = (req, res, next) => {
  req.user
    .populate('cart.items.productid')
    //.execPopulate()
    .then(userdata => {
      const products = userdata.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productid._doc } };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user
        },
        products: products

      });
      return order.save();
    })
    .then(result => {
       req.user.clearCart();
     })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => {
      //console.log(err);
      const error=new Error(err)
      error.httpstatusCode=500
      return next(error)
    });
};
exports.getinvoice=(req,res,next)=>{
  const orderId=req.params.orderId
  Order.findById(orderId)
  .then(order=>{
      if(!order){
        return next( new Error('no orders found'))
      }
      if(order.user.userId.toString()!==req.user._id.toString()){
        return new Error('no aurthorise order')
      }
      const invName='invoice'+'-'+ orderId +'.pdf'
      const inPath=path.join('data',invName)
      const pdf=new pdfDoc()
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="' + invName + '"'
      )
      pdf.pipe(fs.createWriteStream(inPath))
      pdf.pipe(res)
      pdf.fontSize(30).text('invoice',{
        underline:true
      })
      pdf.text('..................')
      let totalPrice=0;
      order.products.forEach(prods=>{
        totalPrice+=prods.quantity*prods.product.price
      pdf.fontSize(20).text(`
                  ${prods.product.title}
      -quant      ${prods.quantity}
      *$          ${prods.product.price}`)
          pdf.text('................')
                  pdf.text(totalPrice)

      })
      pdf.end()

      })
      .catch(err=>next(err))
  }
  
  
 
 

 

  // exports.postOrders=(req,res,next)=>{
  //   req.user.populate('cart.items.productid')
  //   .then(user=>{
  //     const products=user.cart.items.map(i=>{
  //       return {quantity:i.quantity,product:{...i.productid._doc}}
  //     })
  //      const order=new Order({
  //       user:{
  //         name:req.user.name,
  //         email:req.user.email
         
          
  //       },
  //       userId:req.user._id,
  //       product:products
       
        
  //      })
  //     return  order.save()
  //   }).then(result=>res.redirect('/orders'))
  //   .catch(err=>console.log(err))
  // }

 /*
  let fetchedCart;
  let newQuantity = 1;


  
exports.postCart=(req,res,next)=>{
  const prodId=req.body.productid;
  let fetchedCart;
  
  let newQuantity=1
  req.user.getCart()
  .then(data=>{
    fetchedCart=data;
     return data.getProducts({where:{id:prodId}})}
    )
    .then(products=>{
      let product;
      if(products.length>0){
        product=products[0]
      }
      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return product.findByPk(prodId)
    }).then(data=>{
      return fetchedCart.addProduct(product,{through:{quantity:newQuantity}})}
    ).then(()=>res.render('/cart'))
  .catch(err=>console.log(err))
}
     
  




}*/





