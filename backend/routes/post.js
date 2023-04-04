const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const app = express();


const func = () => {

    console.log("hello");
}

app.get("/halwa", func, function(req, res) {

})
require("../models/post")
const post = mongoose.model('post');
const checkloggedin = require("../middleware/checkloggedin.js")







router.get("/allposts", checkloggedin, function(req, res) {
    console.log("inside allposts");

    post.find()
        .populate("postedBy", "_id name userName pic")
        .populate("comments.postedBy", "_id name pic  userName")
        .then((posts) => {
            res.json({ posts })
        })
        .catch((error) => { console.log("allposts error",error); })


})


router.get("/subposts", checkloggedin, function(req, res) {
    console.log("inside get subposts");
    //if postedBy in following
    post.find({
            postedBy: { $in: req.user.following }
        })
        .populate("postedBy", "_id name userName")
        .populate("comments.postedBy", "_id name userName")
        .then((posts) => {
            res.json({ posts })
        })
        .catch((error) => { console.log(error); })


})



router.get("/myposts", checkloggedin, function(req, res) {
    console.log("inside get myposts");
    post.find({ postedBy: req.user._id })
    .then((posts) => {
        console.log("inside myposts",posts)
        res.json({ posts })
    })

})
router.post("/createpost", checkloggedin, function(req, res) {
    const { title, body, photo } = req.body;

    if (!title || !photo) {
        return res.status(422).json({ error: "Please fill all details" })
    }
    const post1 = new post({ title, body, photo, postedBy: req.user });

    post1.save()
        .then(user => (res.json({ post: "saved succesfully " + user })))
        .catch(err => { console.log(err) })
})

router.delete("/deletepost/:postId", checkloggedin, function(req, res) {
   console.log("inside deletepost",req.params.postId );
    post.findOne({ _id: req.params.postId })
    .populate("postedBy","_id name")
        .exec(function(err, post) {
            if (!post || err) {
                return res.status(422).json({ error: err })
            }
            if (post.postedBy._id.toString() === req.user._id.toString()) {
                post.remove()
                    .then(user => (res.json({ message: "Succesfully deleted  the post " + post })))
                    .catch(err => { console.log(err) })
            }

        })



    // post.deleteOne({_id:req.params.postId})
    // .then((err,result)=>{
    //     console.log("deleted post successfully");
    //      return  res.status(200).json(result)
    // }).catch(function (err) { console.log(err);
    //     return res.status(422).json ({error:err})
    // })
})


// router.get("/createpost",function (req,res){

//     res.send("succesSTSJJRY");
// })

router.post("/like", checkloggedin, function(req, res) {
    console.log("inside  like, id",req.body.postId)
    post.findByIdAndUpdate(req.body.postId, {
        //addToSet inorder to add only unique ids only to the list
        $addToSet: { likes: req.user._id }
    }, { new: true }).exec().
    then((result) => {
            console.log(result);
            console.log("liked succes by",req.user._id);
            return res.json(result)
        })
        .catch((err) => {
            console.log("err", err);
            return res.status(422).json({ error: err })
        })
})


router.put("/unlike", checkloggedin, function(req, res) {

        post.findByIdAndUpdate(req.body.postId, {
            $pull: { likes: req.user._id }
        }, { new: true }).exec().
        then((result) => {
                return res.json(result)
            })
            .catch((err) => {
                console.log(err);
                return res.status(422).json({ error: err })
            })
    })
    // .populate("postedBy","_id name")

router.put("/addComment", checkloggedin, function(req, res) {
    console.log("inside add comment");
    post.findByIdAndUpdate(req.body.postId, {
        $push: { comments: { comment: req.body.comment, postedBy: req.user._id } }
    }, { new: true }).populate("comments.postedBy", "_id name userName").exec()

    .then((result) => {
            return res.status(200).json(result)
        })
        .catch((err) => {
            console.log(err);
            return res.status(422).json({ error: err })
        })

})


router.put("/deleteComment", checkloggedin, function(req, res) {
    console.log("inside delete comment");

    post.findById(req.body.postId)
    .populate("postedBy","_id name")
    .exec((error,foundPost)=>{
       console.log("found post func:deleteComment",foundPost);
       if(!error){
          if(foundPost.postedBy._id.toString()===req.user._id.toString()){
            console.log("deleted comment succesfully");
            post.findByIdAndUpdate(req.body.postId, {
                $pull: { comments: { _id: req.body.commentId } }
            }, { new: true })
            .populate("comments.postedBy", "_id name userName").exec()
            .then((result) => {
                return res.status(200).json(result)
            })
            .catch((err) => {
                console.log(err);
                return res.status(422).json({ error: err })
            })
            
          }


       }
    })

})
module.exports = router;