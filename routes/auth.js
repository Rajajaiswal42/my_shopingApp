const express=require('express')
const User=require('../model/user')

const{check,body}=require('express-validator')
const authController=require('../controller/auth')
const router=express.Router()
router.get('/login',authController.getLogin)
router.post('/login',[check('email','plz enter a valid email').isEmail().normalizeEmail(),
body('password','password has to be valid').isLength({min:5}).isAlphanumeric().trim()

],authController.postLogin)
router.post('/logout',authController.postLogout)
router.get('/signup',authController.getSignup)
router.post('/signup',[check('email','email is not valid').isEmail().custom((value,{req})=>{
  return  User.findOne({email:value})
    .then(userdata=>{
       if(userdata){
          return Promise.reject('email is already exist')
       }
    })
}).normalizeEmail()
,body('password','password must have alphanumeric').isLength({min:5}).isAlphanumeric().trim(),
body('confirmPassword').custom((value,{req})=>{
    if(value!==req.body.password){
        throw new Error('password should have match')
    }
    return true;
}).trim()
],authController.postSignup)
router.get("/reset",authController.getresetpass)
router.post('/reset',authController.postresetpass)
router.get('/reset/:token',authController.getnewpass)
router.post('/new-password',authController.postnewPass)
 
module.exports=router;