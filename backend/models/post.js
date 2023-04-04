const mongoose =require("mongoose");



const postSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true
     },
     body:{
        type:String,
        required:true
     },
     photo:{
        type:String,
        required:true
     },
     likes:[{
      type:mongoose.Schema.ObjectId ,
      ref:"user"

     }],
     comments:[{
      comment:{
         type:String,
      },
      postedBy:{
         type:mongoose.Schema.ObjectId ,
         ref:"user"
      }
     }],
     postedBy:{
        type:mongoose.Schema.ObjectId ,
        ref:"user"

     }
},{timestamps:true})


mongoose.model("post", postSchema);