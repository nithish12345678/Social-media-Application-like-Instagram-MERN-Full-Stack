import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../App'
import { Link } from "react-router-dom";
import M from 'materialize-css'
import { IconButton } from '@material-ui/core';
import { Favorite } from '@material-ui/icons';
import DeleteIcon from '@material-ui/icons/Delete';
import CommentIcon from '@material-ui/icons/Comment';




const SubscribedUserPosts=()=>{
    const [data, setData] = useState([])
    const [postId, setPostId] = useState("");

    const { state, dispatch } = useContext(UserContext)
    // useEffect(() => {
    //     const {name, _id} =data.postedBy
    // }, [data])





    useEffect(() => {
        fetch('http://localhost:5000/subposts', {
            method:"get",
            headers: {
                    "authentication":localStorage.getItem("jwt")
                }
            }).then(res => res.json())
            .then(result => {
                console.log("post :",result.posts);
                setData(result.posts.reverse())
            })
    }, [])

    //comment button
    const [showComment, setShowComment] = useState(false);
    function handleCommentClick() {
        setShowComment(!showComment);
      }

    const likePost = (postId) => {
        console.log('like post',postId);
        fetch('http://localhost:5000/like', {
            method: "post",
            headers: {
                "Content-Type":"application/json",
                "authentication": localStorage.getItem("jwt")
            },
            body :JSON.stringify({
                postId:postId
            })
        }).then((response) => response.json()).then((result) => {
            console.log(result);
            var toastHTML = '<span>Post liked succesfully</span><button class="btn-flat toast-action">Undo</button>';
            M.toast({ html: toastHTML });


            const newData=data.map(post=>{
                if(post._id==result._id){
                    return result;
                }
                else{
                    return post;
                }
            })
            setData(newData)


        })
      };

      const addComment = (postId,com) => {
        console.log('Function :addComment');
        fetch('http://localhost:5000/addComment', {
            method: "put",
            headers: {
                "Content-Type":"application/json",
                "authentication": localStorage.getItem("jwt")
            },
            body :JSON.stringify({
                postId:postId,
                comment:com
            })
        }).then((response) => response.json()).then((result) => {
            console.log(result);
            var toastHTML = '<span>comment added succesfully</span><button class="btn-flat toast-action">Undo</button>';
            M.toast({ html: toastHTML });
            
            //to update the posts array with liked post array 
            const newData=data.map(post=>{
                if(post._id==result._id){
                    return result;
                }
                else{
                    return post;
                }
            })
            setData(newData)
        })
      };
      const deleteComment = (postId,com) => {
        console.log('delete comment',postId);
        fetch('http://localhost:5000/deleteComment', {
            method: "put",
            headers: {
                "Content-Type":"application/json",
                "authentication": localStorage.getItem("jwt")
            },
            body :JSON.stringify({
                postId:postId,
                commentId:com
            })
        }).then((response) => response.json()).then((result) => {
            // console.log(result);
            var toastHTML = '<span>comment deleted succesfully</span><button class="btn-flat toast-action">Undo</button>';
            M.toast({ html: toastHTML });
            
            //to update the posts array with liked post array 
            const newData=data.map(post=>{
                if(post._id==result._id){
                    return result;
                }
                else{
                    return post;
                }
            })
            setData(newData)
        })
      };


    
      const unlikePost = (id) => {
        console.log('Function 2');
        fetch('http://localhost:5000/unlike', {
            method: "put",
            headers: {
                "Content-Type":"application/json",
                "authentication": localStorage.getItem("jwt")
            },
            body :JSON.stringify({
                postId:id
            })
        }).then((response) => response.json()).then((result) => {
            console.log(result);
            var toastHTML = '<span>Post unliked succesfully</span><button class="btn-flat toast-action">Undo</button>';
            M.toast({ html: toastHTML });
            
            //to update the posts array with liked post array 
            const newData=data.map(post=>{
                if(post._id==result._id){
                    return result;
                }
                else{
                    return post;
                }
            })
            setData(newData)
        })
      };

    

  


    const deletePost = (postid) => {

         console.log("hello",postid);
        fetch(`http://localhost:5000/deletepost/${postid}`, {
            method: "delete",
            headers: {
                "authentication": localStorage.getItem("jwt")
            }
        }).then((response) => response.json()).then((result) => {
            console.log(result);
            var toastHTML = '<span>Post deleted succesfully</span><button class="btn-flat toast-action">Undo</button>';
            M.toast({ html: toastHTML });
            const newData=data.map(post=>{
                if(post._id==result._id){
                    return result;
                }
                else{
                    return post;
                }
            })
            setData(newData)
        })
    }
        return ( 
            <div style={{margin:"20px 20px"}}className = "home " >
            {
                data.map((post)=>{
                    return (
                       <div className="home-card" key={post._id}>
                            <div className="card">
                         
                         <h4 className="card-title">
                         <Link to={ `/profile/${post.postedBy._id}`}>
                         {post.postedBy.userName}
                         </Link>
                         {(post.postedBy._id==state._id) && <IconButton aria-label="delete" onClick={()=>deletePost(post._id)}>
                         <DeleteIcon />
                        </IconButton>}
                        
                         </h4>
                        
                           <div className="home-card-image card-image">
                             <img alt="halwa" src={post.photo}/>
                           </div>
                           <div className="card-content">
                           <div>
                           {post.likes.includes( state._id)?
                            <IconButton onClick={() => { unlikePost(post._id); } }>
                               <Favorite style={{ color: "red" }} />
                            </IconButton>
                               :
                            <IconButton onClick={() => { likePost(post._id); } }>
                               <Favorite style={{ color: "grey" }} />
                            </IconButton>
                           
                           }
                          
                           <IconButton aria-label="comment" onClick={handleCommentClick}>
                             <CommentIcon />
                           </IconButton>
                        
                       
                         </div>
                           
                            <h6>{post.likes.length} likes</h6>
                            {showComment && <div>
                                <h6 style={{fontWeight:"500"}}> Comments</h6>
                                {
                                 post.comments.map(com =>{
                                 return(
                                    <h6 key={com._id}> <span style={{fontWeight:"500"}} >{com.postedBy.name} </span>:  {com.comment}
                                           
                                    {(com.postedBy._id==state._id) && <IconButton aria-label="delete" onClick={()=>deleteComment(post._id,com._id)}>
                                    <DeleteIcon />
                                   </IconButton>}
                                    </h6>
                                 
                                 )
                                })
                               }
                            </div>}
               
                             <span className="card-title">{post.title}</span>
                             <p>{post.body}</p>
               
               
                             <form onSubmit={(e)=>{
                               e.preventDefault();
                               console.log("comment",e.target[0].value);
                               addComment(post._id,e.target[0].value);
                             }}>
                             <input type="text" name="comment" placeholder="add a comment"/>
                             </form>

                             
                           </div>
                         </div>
                        </div>)
                     
                               })
                           }
</div>
    )

}

export default SubscribedUserPosts;