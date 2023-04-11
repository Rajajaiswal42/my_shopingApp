
const Product = require('../model/product');
const mongoose=require('mongoose')
const {validationResult}=require('express-validator')
const fs=require("fs")
const path=require('path')
const file=require('../util/file')

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
      pagetitle: 'Add Product',
      path: '/admin/add-product',
      editing:false,
      isAuthenticated: req.session.isLoggedin,
      csrfToken:req.csrfToken(),
      flash:null,
      hasError:false
   
    });
  };
  exports.getproduct=(req,res,next)=>{
    Product.find({userId:req.user._id})
     .then(products=>{
     res.render('admin/Products',{
       prods:products,
       path:'/admin/products',
       pagetitle:'admin products',
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
   

  

  
  exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const Image = req.file;
    const price = req.body.price;
    const description = req.body.description;
    console.log(Image)
   
    if(!Image){
     return  res.status(422).render(
        res.render('admin/edit-product', {
          pagetitle: 'Add Product',
          path: '/admin/add-product',
          editing:false,
          isAuthenticated: req.session.isLoggedin,
          csrfToken:req.csrfToken(),
          flash:"attached file is not Image",
          product:{
            title:title,
            price:price,
            description:description,
          },
          hasError:true
       
        })

      )

    }
    const error=validationResult(req)

    if(!error.isEmpty()){
      console.log(error.array())
      res.status(422).render(
        res.render('admin/edit-product', {
          pagetitle: 'Add Product',
          path: '/admin/add-product',
          editing:false,
          isAuthenticated: req.session.isLoggedin,
          csrfToken:req.csrfToken(),
          flash:error.array()[0].msg,
          product:{
            title:title,
            price:price,
            description:description,
          },
          hasError:true
       
        })

      )
    }

   
    const product=new Product({ 
      // _id:mongoose.Types.ObjectId("6408ce2a128dbb99148b0fd2"),
      title:title,
      description:description,
      price:price,
      imagurl:Image.path,
      userId:req.user })
      product.save()
     .then(result => {
       // console.log(result)
        console.log('Created Product');
        res.redirect('/admin/products');
      })
      .catch(err => {
        //console.log(err);
        const error=new Error(err)
        error.httpstatusCode=500
        return next(error)
      });
  };

   exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit
   
    if (!editMode) {
      return res.redirect('/');
    }
    const prodId = req.params.productid;
    Product.findById(prodId)
    .then(products=>{
      if (!products) {
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pagetitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: products,
      isAuthenticated:  req.session.isLoggedin,
      csrfToken:req.csrfToken(),
      flash:null
     

    });

    })  .catch(err => {
      //console.log(err);
      const error=new Error(err)
      error.httpstatusCode=500
      return next(error)
    });
    }


    exports.postEditProduct=(req,res,next)=>{

    const prodId=req.body.productid;
    const udtitle=req.body.title;
    const udprice=req.body.price;
    const image=req.file;
    const uddescription=req.body.description;
    const error=validationResult(req) 
    if(!error.isEmpty()){
      console.log(error.array())
      res.status(422).render(
        res.render('admin/edit-product', {
          pagetitle: 'Add Product',
          path: '/admin/add-product',
          editing:true,
          hasError:true,
          isAuthenticated: req.session.isLoggedin,
          csrfToken:req.csrfToken(),
          flash:error.array()[0].msg,
          product:{
            title:udtitle,
            price:udprice,
            description:uddescription,
          }

       
        })

      )
    }


    Product.findById(prodId).then(product=>{
      if(product.userId.toString()!==req.user._id.toString()){
        return res.redirect('/')
      }
       product.title=udtitle,
       product.price=udprice
       if(image){
        file.deleteFile(product.imagurl)
        product.imagurl=image.path
       }
       product.description=uddescription
       return product.save() 
       .then(result=>
        
        console.log('updated'),
       res.redirect('/admin/products')
       )
    })
   
    .catch(err => {
      //console.log(err);
      const error=new Error(err)
      error.httpstatusCode=500
      return next(error)
    });
   
    }
    
 
  exports.Deleteproduct=(req,res,next)=>{
    const prodId=req.params.productid
    Product.findById(prodId).then(
    product=>{
      if(!product){
        return next(  new Error('no products found'))
      }
      file.deleteFile(product.imagurl)
       return Product.deleteOne({_id:prodId,userId:req.user._id})
    }
    )
    .then(result=>{
       res.status(200).json({message:'success'})
      console.log('deleted product')}
    
  )
    .catch(err => {
      //console.log(err);
      res.status(500).json({message:'failed'})
    });
  
   
  
   

  

  }
  // exports.getinvoice=(req,res,next)=>{
  //   const orderId=req.params.orderId
  //   const invName='invoice'+"_"+orderId+'.pdf'
  //   const inPath=path.join('data','invname')
  //   fs.readFile(inPath,(err,data)=>{
  //     if(err){
  //        return next(err)
  //     } 
  //     res.send(data)

  //   })
  // }
   
