const path = require('path');
const mongoose =require('mongoose')
const express = require('express');
const bodyParser = require('body-parser');
const session=require('express-session')
const csrf=require('csurf')
const multer=require('multer')
const mongodbStore=require('connect-mongodb-session')(session)
const { v4: uuidv4 } = require('uuid');
//const cookie=require('cookie-parser')
const flash=require('connect-flash')


const errorController = require('./controller/error');
//app-pass     ="vkeilndvszawverj"


const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');
const mongo_uri='mongodb+srv://rajajaiswal:raja7484%40@cluster0.m7matrs.mongodb.net/test'


const store=new mongodbStore({
  uri:mongo_uri,
  collection:'sessions'
})

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes=require('./routes/auth')
const User=require('./model/user')
const csrfprotection=csrf()




const fileStorage=multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null,'images'); 
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + '-' + file.originalname);
  },
});


// const fileFilter = (request, file, callback) => {
//   const acceptableMimeTypes = ['image/png', 'image/jpg', 'image/jpeg'];

//   if (acceptableMimeTypes.includes(file.mimetype)) {
//       callback(null, true); // We want to accept that file
//   } else {
//       callback(null, false); // We don't want to accept that file
//   }
// };

const filefilter=(req,file,cb)=>{
  if(
    file.mimetype==='image/png'|| file.mimetype==='image/jpg'|| file.mimetype==='image/jpeg'
  ){
    cb(null,true)
  }else{
    cb(null,false)
  }}



app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({storage:fileStorage,fileFilter:filefilter}).single('Image'))
//app.use(express.static(path.join(__dirname, 'public')));
app.use("/public",express.static('public'))
app.use("/images",express.static('images'))
//app.use(cookie("cookie-parser-secret"))

app.use(session({secret:'my secret',resave:true,saveuninitailized:true,store:store}))

app.use(csrfprotection)
app.use(flash())





  


app.use((req, res, next) => {
  if(!req.session.user){
    return next()
  }
  User.findById(req.session.user._id)
  .then(user=>{
    req.user=user
    next()
  })
  .catch(err=>{
    next (new Error(err))
  })

})




app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes)

app.get("500",errorController.err500)
app.use(errorController.err404);

app.use((error,req,res,next)=>{
  console.log(error)
  res.render('500',
  {pagetitle:"server issue",
  path:'/500',
  isAuthenticated:  req.session.isLoggedin,
  csrfToken:req.csrfToken()

}
  
  )
})

mongoose.connect('mongodb+srv://rajajaiswal:raja7484%40@cluster0.m7matrs.mongodb.net/test')
.then(result=>{
  app.listen(3000)
}).catch(err=>console.log(err))
