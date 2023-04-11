exports.err404=(req,res,next)=>{
    res.status(404).render('error',{pagetitle:"page not found",path:'error',
    isAuthenticated: req.session.isLoggedin})
  }
  exports.err500=(req,res,next)=>{
    res.status(404).render('500',{pagetitle:"server issue",path:'/500',
    isAuthenticated: req.session.isLoggedin})
  }