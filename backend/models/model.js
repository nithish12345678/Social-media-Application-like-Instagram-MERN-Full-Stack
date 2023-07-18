const mongoose =require("mongoose");


const userSchema=new mongoose.Schema({
 name:{
    type:String,
    required:true
 },
 userName:{
    type:String,
    required:true
 },
 email:{
    type:String,
    required:true
 },
 password:{
    type:String,
    required:true
 },
 pic:{
   type:String,
   default:"https://moonvillageassociation.org/wp-content/uploads/2018/06/default-profile-picture1.jpg"
},
 followers:[{
   type:mongoose.Schema.ObjectId,
   ref:"user"
}],
following:[{
   type:mongoose.Schema.ObjectId,
   ref:"user"
}]

});


mongoose.model("user",userSchema);