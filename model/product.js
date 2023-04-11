const mongoose=require('mongoose');

const schema=mongoose.Schema
 const productSchema= new schema({
 title:{
  type:String,
  required:true
 },
 description:{
  type:String,
  required:true
 },
 price:{
  type:Number,
  required:true
 },imagurl:{
  type:String,
  required:true
 },userId:{
    type:schema.Types.ObjectId,
    ref:'User',
    required:true
 }

 })
 module.exports=mongoose.model('Product',productSchema)




// class product {
//  constructor(title,price,description,imagurl,_id,userid){
//   this.title=title;
//   this.description=description;
//   this.imagurl=imagurl;
//   this.price=price;
//   this._id=_id?new mongodb.ObjectId(_id):null
//   this.userid=userid

//  }
//  save(){
//   const db=getDb()
//   let dbop;
//   if(this._id){
//     //update product
//     dbop=db.collection('products').updateOne({_id:(this._id)},{$set:this})
//   }else{
//   return dbop=db
//   .collection('products')
//   .insertOne(this)}
//   return dbop
//   .then(data=>console.log(data))
//   .catch(err=>console.log(err))
  
//  }
//   static fetchAll(){
//     const db=getDb()
//     return db
//     .collection('products')
//     .find()
//     .toArray()
//      .then(data=>{
//         return data
//         console.log(data)})
//      .catch(err=>console.log(err))
//      }
// static findById(prodid){
  
//    const db=getDb();
//     return db.collection('products')
//     .find({_id:  new mongodb.ObjectId(prodid)})
//     .next()
//     .then(data=>{
//       return data
//       console.log(data)})
//     .catch(err=>console.log(err))
// }
// static deleteById(prodId){
//   const db=getDb();
//    return db
//   .collection('products')
//   .deleteOne({_id:new mongodb.ObjectId(prodId)})
//   .then(data=>console.log(data))
//   .catch(err=>console.log(err))
// }




// }
