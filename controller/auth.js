const User=require('../model/user')
const bcrypt=require('bcryptjs')
const nodemailer=require('nodemailer')
const crypto=require('crypto')
const{validationResult}=require('express-validator')
//const sendgridTransport=require('nodemailer-sendgrid-transport')

const transporter=nodemailer.createTransport({
   service:"gmail",
   auth:{
      user:'rajajaiswal42@gmail.com',
      pass:"vkeilndvszawverj"
   }
})


exports.getLogin= (req,res,next)=>{
   // const isLoggedin=(req.get('cookie').trim().split('=')[1])
   // console.log(isLoggedin)
   let message=req.flash('error')
   if (message.length>0){
       message=message[0]
   }else{
      message=null
   }
   console.log(req.session.isLoggedin)
   res.render('auth/login',{
    path:'/login',
    pagetitle:'login',
    isAuthenticated: false,
    csrfToken:req.csrfToken(),
    flash:message,
    oldInput:{
      email:'',
      password:''
    },
    validationError:[]
    
 
    
   })
}
exports.postLogin= (req,res,next)=>{
   const email=req.body.email
   const password=req.body.password
   const error=validationResult(req)
   
   const token=req.csrfToken()
   if(!error.isEmpty()){
      console.log(error.array())
       return res.status(422).render('auth/login',{
         path:'/login',
         pagetitle:'login',
         isAuthenticated: false,
         csrfToken:token,
         flash:error.array()[0].msg,
         oldInput:{
            email:email,
            password:password,
          },
          validationError:error.array()
         
     }  )
   } 
   User.findOne({email:email})
   .then(user=>{
      if(!user){
      return res.status(422).render(
         'auth/login',{
            path:'/login',
            pagetitle:'login',
            isAuthenticated: false,
            csrfToken:token,
            flash:('error','user not found'),
            oldInput:{
               email:email,
               password:password,
             }
            
            }
       )
      }
     
      validationError=[]
      bcrypt.compare(password,user.password).then(domatch=>{
         if (domatch){
       req.session.user=user
       req.session.isLoggedin=true
       return  req.session.save(err=>{
         res.redirect('/')
       })}
       return res.status(422).render('auth/login',{
         path:'/login',
         pagetitle:'login',
         isAuthenticated: false,
         csrfToken:token,
         flash:('error','password should be match'),
         oldInput:{
            email:email,
            password:password,
          },
          validationResult:[]
          
          
          ,})



      }).catch(err=>{
         res.redirect('/login')  
      })
      
   })
   .catch(err => {
      //console.log(err);
      const error=new Error(err)
      error.httpstatusCode=500
      return next(error)
    });
 

}

exports.postLogout=(req,res,next)=>{
   req.session.destroy(err=>{
      console.log(err)
      res.redirect('/')
   })

}
exports.getSignup=(req,res,next)=>{
   
   let message=req.flash('invalid')
   if (message.length>0){
       message=message[0]
   }else{
      message=null
   }
   res.render('auth/signup',{
      path:'/signup',
      pagetitle:"signup",
      isAuthenticated:false,
      csrfToken:req.csrfToken(),
      flash:message,
      oldInput:{
         email:'',
         password:'',
         confirmPassword:''
      },
      validationError:[]
 


   })
}
exports.postSignup=(req,res,next)=>{
   const email=req.body.email
   const password=req.body.password
   const confirmPassword=req.body.confirmPassword
   const errors = validationResult(req);
   const token=req.csrfToken()
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pagetitle: 'Signup',
      isAuthenticated:false,
      csrfToken:token,
      flash: errors.array()[0].msg,
      oldInput:{
         email:email,
         password:password,
         confirmPassword:confirmPassword
      },
      validationError:errors.array()

    });
  }
    
      bcrypt.hash(password,12)
      .then(hashedpass=>{
      const user=new User({
         email:email,
         password:hashedpass,
         cart:{items:[]}
      })
      return  user.save()
      })
        
     .then(data=>{
       res.redirect('/login')
       return transporter.sendMail({
         to:email,
         from:'rajajaiswal42@gmail.com',
         subject:"signup_Succeeded",
         html:"<h1>ka re chirkut </h1>"

      })  .catch(err => {
         //console.log(err);
         const error=new Error(err)
         error.httpstatusCode=500
         return next(error)
       });
   })
  
   
   
}
 exports.getresetpass=(req,res,next)=>{
   let message=req.flash('error')
   if (message.length>0){
       message=message[0]
   }else{
      message=null
   }
   res.render('auth/reset',{
      path:"/reset",
      pagetitle:'reset',
      isAuthenticated:req.session.isLoggedin,
      csrfToken:req.csrfToken(),
      flash:message

   })
 }
 exports.postresetpass=(req,res,next)=>{
   crypto.randomBytes(32,(err,buffer)=>{
      if(err){
          console.log(err)
          return res.redirect('/reset')
      }
      const token=buffer.toString('hex')
      User.findOne({email:req.body.email})
      .then(user=>{
         if(!user){
            req.flash('error',"user not found")
           return  res.redirect('/reset')
         }
         user.resetToken=token,
         user.resetTokenExp=Date.now() +360000
         return user.save()

      }).then(data=>{
         res.redirect('/')
         return transporter.sendMail({
            to:req.body.email,
            from:'rajajaiswal42@gmail.com',
            subject:"password reset",
            html:`<p>password reset site</p>
               <P>to reset your password click this link ,<a href="http://localhost:3000/reset/${token}"`
   

      })
      .catch(err => {
         //console.log(err);
         const error=new Error(err)
         error.httpstatusCode=500
         return next(error)
       });
   })

 })}
 exports.getnewpass=(req,res,next)=>{
 const token=req.params.token
 User.findOne({resetToken:token,resetTokenExp:{$gt:Date.now()}})
 .then(user=>{

   let message=req.flash('error')
   if (message.length>0){
       message=message[0]
   }else{
      message=null
   }
   res.render('auth/new-password',{
      path:"/new-password",
      pagetitle:'update password',
      isAuthenticated:req.session.isLoggedin,
      csrfToken:req.csrfToken(),
      flash:message,
      userid:user._id,
      passToken:token,

   })


 })
 .catch(err => {
   //console.log(err);
   const error=new Error(err)
   error.httpstatusCode=500
   return next(error)
 });
 }
 exports.postnewPass=(req,res,next)=>{
   const newpassword=req.body.password
   const userid=req.body.userid
   const passToken=req.body.passToken
   let resetuser;
    User.findOne({resetToken:passToken,resetTokenExp:{$gt:Date.now()},_id:userid})
    .then(user=>{
      resetuser=user
      return bcrypt.hash(newpassword,12)
      .then(hashedpass=>{
         resetuser.password=hashedpass
         resetuser.resetToken=undefined
         resetuser.resetTokenExp=undefined
         return resetuser.save()
        
      }).then(data=>{
         res.redirect('/login')
      })
      .catch(err=>console.log(err))
    })
    .catch(err => {
      //console.log(err);
      const error=new Error(err)
      error.httpstatusCode=500
      return next(error)
    });


 }