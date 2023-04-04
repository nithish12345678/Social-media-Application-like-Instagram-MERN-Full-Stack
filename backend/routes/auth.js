const express=require("express");
const mongoose =require("mongoose");
const router=express.Router();

require("../models/model")
require("../models/post")
const user=mongoose.model("user");

//env to access keys
require('dotenv').config()
const checkloggedin=require("../middleware/checkloggedin.js")
const post=mongoose.model("post");
const bcrypt=require("bcrypt");
const saltRounds = 12;
const jwt=require("jsonwebtoken");



router.get("/",function(req,res){
res.send("hello");
})
router.get("/protected",checkloggedin,function (req,res){

    res.json({message:"success"});
})




router.post("/signup",function(req,res){

    console.log("inside signup");

    const {name,userName,email,password} =req.body;
    if(!name || !userName || !email || !password){ return res.status(422).json({error:"Please fill all details"})
    }
 
    user.findOne({$or: [{email: email},{userName: userName}]}).then((foundUser) => {

        if(foundUser){
            return res.status(422).json({error:"user already exists with same username or email"})
        }

        bcrypt.hash(password,saltRounds).then((hashedPassword,err) =>{
            if(!err){


                const newuser= new user({
                    name,
                    userName,
                    email,
                    password:hashedPassword
                })
                newuser.save()
                    .then(user =>(res.json({message:"saved succesfully"})))
                    .catch(err => {console.log(err)})
            }

        })
    })
})

router.post("/signin",function(req,res){
    const {email,password} =req.body;
    if( !email || !password){res.status(422).json({error:"Please fill all details"})
    }

    user.findOne({email: email}).then((foundUser) => {

        if(foundUser){
            bcrypt.compare(password, foundUser.password, function(err, result) {
                // result == true
                if(result){

                    const token=jwt.sign({_id:foundUser._id},process.env.JWT_SECRET)

                    const{_id,name,pic,userName,email,followers,following}=foundUser;
                    res.json({token,user:{_id,name,pic,userName,email,followers,following}})
                    console.log("signed in");
                    // res.json({message:"Signin success"})
                }
                else{
                    res.status(422).json({error:"Invalid password"})
                }
            })
        }
        else{
            return res.status(422).json({error:"Invalid email"})
        }
    })

})

module.exports=router;