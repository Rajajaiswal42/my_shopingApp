const mongoose=require('mongoose')
const schema=mongoose.Schema
 
const userSchema=new schema({

email:{
  type:String,
  required:true
},
resetToken:String,
resetTokenExp:Date,

password:{
type:String,
required:true
},
cart:{
  items:[{productid:{type:schema.Types.ObjectId,ref:'Product',required:true},quantity:{type:Number,required:true}}]
}




})
userSchema.methods.addToCart=function(product){
  const cartProductIndex=this.cart.items.findIndex(cp=>{
        return cp.productid.toString()===product._id.toString()
       })
       let newQuantity=1;
       const updatedCartitems=[...this.cart.items]
       if (cartProductIndex >=0){
         newQuantity=this.cart.items[cartProductIndex].quantity + 1
         updatedCartitems[cartProductIndex].quantity=newQuantity
    
       }else{
        updatedCartitems.push({
          productid:product._id,
          quantity:newQuantity
        })
       }
         
        const updatedCart={items:updatedCartitems}
        this.cart=updatedCart;
         return this.save()





}
  userSchema.methods.deleteFromCart=function(productid){
    const updatedCartItems=this.cart.items.filter(items=>{
          return items._id.toString()!==productid.toString()
           })
             this.cart.items=updatedCartItems
             return this.save()


  }
  userSchema.methods.clearCart=function(){
    this.cart={items:[]}
    return this.save()
  }
 module.exports=mongoose.model('User',userSchema)
//   save(){
//     const db=getDB()
//      return db.collection('USERS').insertOne(this)
//   }

//   addToCart(product){
//    
  
//   }
//   getCart(){
//     const db=getDB()
//     const productsids=this.cart.items.map(i=>{
//       return i.productid;
//     })

//     return db
//     .collection('products')
//     .find({_id:{$in:productsids}})
//     .toArray()
//     .then(data=>{
//       return data.map(p=>{
//         return {...p,quantity:this.cart.items.find(i=>{
//           return i.productid.toString()===p._id.toString()
//         }).quantity}
//       })

//     })
//   }
//   deleteCartItems(productId){
//     const updatedCartItems=this.cart.items.filter(items=>{
//       return items.productid.toString()!==productId.toString()
//     })
//     const db=getDB();
//    return db.collection("USERS").updateOne({_id:new mongodb.ObjectId(this._id)}
//     ,{$set:{cart:{items:updatedCartItems}}}
//     )

//   }
//   addOrders(){
//     const db=getDB()
//    return  this.getCart()
//     .then(products=>{
//       const Orders={
//         items:products,
//         user:{
//           _id:new mongodb.ObjectId(this._id),
//           name:this.name
//         }
//       }
//       return db.collection('orders').insertOne(Orders)
//     }).then(result=>{
//       this.cart={items:[]};
//       return db.collection('USERS')
//       .updateOne({
//         _id:new mongodb.ObjectId(this._id)},{
//           $set:{cart:{items:[]}}
//         })
//     })
//   }
//   getOrders(){
//     const db=getDB();
//    return                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 9./  db.collection('orders').find({'user._id':new mongodb.ObjectId(this._id)}).toArray()
//   }


//   static findById(userid){
//     const db=getDB()
//      return db.collection('USERS').findOne({_id:new mongodb.ObjectId(userid)})
//      .then(data=>{console.log(data)
//       return data;
//     })
//      .catch(err=>console.log(err))
//   }

// }
// module.exports=USER