const mongoose =require("mongoose");
const {JWT_SECRET}=require("../keys");
const user=mongoose.model("user");
const jwt=require("jsonwebtoken");



module.exports=(req,res,next) => {
    console.log("middle");
    const {authentication}=req.headers;
    if(!authentication){

        return res.status(402).json({error:"You must be logged in"})
    }
        jwt.verify(authentication,JWT_SECRET,(err,payload) => {
         if(err){
           return res.status(402).json({error:"You must be logged in"})
         }
        const {_id}=payload

        user.findById(_id).then((fuser) => {
            req.user=fuser;
            next();
            // res.json({message:fuser});
        })
        })


   
}
