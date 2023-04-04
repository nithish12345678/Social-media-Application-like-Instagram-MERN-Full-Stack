
const express=require('express');
const mongoose=require('mongoose');
const router=express.Router();
const user=mongoose.model("user")
const post=mongoose.model("post")
const checkloggedin=require("../middleware/checkloggedin")

router.get("/user/:id",checkloggedin, function(req,res){
console.log("inside user")
user.findOne({_id:req.params.id})
.select({password:0})
.exec(function(error,founduser){


if(error){
  return res.status(404).json({err:"user not found"});
}
   post.find({postedBy:req.params.id})
   .populate("postedBy","_id name")
   .exec(function(err,posts){

    if(err){
      console.log("hi")
        return res.status(422).json({error:err})
    }
    // console.log(founduser,posts)
    res.json({founduser,posts})
  })
})

})



router.put("/follow",checkloggedin,function(req,res){
  console.log("inside follow method ",req.body.followId)
  user.findByIdAndUpdate(req.body.followId,{
    $addToSet: ({followers:req.user._id})
  },{new:true}).exec(function(err,result){
    if(err){
      return res.status(422).json({error:err});
    }
   
    console.log("inside follow method result:",result)
    user.findByIdAndUpdate(req.user._id,{
      $addToSet: ({following:req.body.followId})
    },{new:true})
    .exec(function(err,result){

      if(err){
        return res.status(422).json({error:err});
      }
      res.status(200).json({result});
     
    })
  }
  )

})

router.put("/unfollow",checkloggedin,function(req,res){
  console.log("inside follow method ",req.body.followId)
  user.findByIdAndUpdate(req.body.followId,{
    $pull: ({followers:req.user._id})
  },{new:true}).exec(function(err,result){
    if(err){
      return res.status(422).json({error:err});
    }
   
    console.log("inside follow method result:",result)
    user.findByIdAndUpdate(req.user._id,{
      $pull: ({following:req.body.followId})
    },{new:true})
    .exec(function(err,result){

      if(err){
        return res.status(422).json({error:err});
      }
      res.status(200).json({result});
     
    })
  }
  )



})




router.put("/updatepic",checkloggedin,function(req,res){

  user.findByIdAndUpdate({_id:req.user._id} ,{$set:{pic:req.body.pic}},{new:true},function(err,result){
    if(err){
      return res.status(422).json({error:"profile picture is not updated"})
    }
    res.json({result});
  })
})


router.get("/halwa ", checkloggedin, function(req, res) {
  console.log("inside halwa raj");
  

})

module.exports=router;