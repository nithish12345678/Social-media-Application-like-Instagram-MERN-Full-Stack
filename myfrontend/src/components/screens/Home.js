import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../App'
import { Link } from "react-router-dom";
import M from 'materialize-css'
import { IconButton } from '@material-ui/core';
import { Favorite } from '@material-ui/icons';
import DeleteIcon from '@material-ui/icons/Delete';
import CommentIcon from '@material-ui/icons/Comment';
import { grey } from '@material-ui/core/colors';
// import { post } from '../../../../backend/routes/post';

const Home = () => {
    const [data, setData] = useState([])
    const [postId, setPostId] = useState("");

    const { state, dispatch } = useContext(UserContext)
    // useEffect(() => {
    //     const {name, _id} =data.postedBy
    // }, [data])



    useEffect(() => {
        fetch(`${process.env.React_APP_Base_URL}/allposts`, {
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
        fetch(`${process.env.React_APP_Base_URL}/like`, {
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
        fetch(`${process.env.React_APP_Base_URL}/addComment`, {
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
        fetch(`${process.env.React_APP_Base_URL}/deleteComment`, {
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
        fetch(`${process.env.React_APP_Base_URL}/unlike`, {
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
        fetch(`${process.env.React_APP_Base_URL}/deletepost/${postid}`, {
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
                        
                         <Link to={ (post.postedBy._id==state._id)? "/profile": `/profile/${post.postedBy._id}`}>
                         <div style={{ display: 'flex', alignItems: 'center', backgroundColor:'#D3D3D3 ', boxShadow:'1px'}}>


                      
                         <img src={ post.postedBy.pic} alt={post.postedBy.userName} style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }} />
                       
                        <span>{post.postedBy.userName}</span>

                        
                         </div>
                        </Link>
                        {(post.postedBy._id==state._id) && <IconButton style={{marginLeft:"auto"}}aria-label="delete" onClick={()=>deletePost(post._id)}>
                         <DeleteIcon />
                        </IconButton>}
                          

                        
                        
                        
                        
                        
                         </h4>

                         {/* showing text or photo */}

                         {post.type=="text"  ?
                         <div style={{marginLeft:"10px"}}className="home-card-image card-image">

                            
                        <h5>{post.photo}</h5>
                       </div>
                         
                         :
                         <div className="home-card-image card-image">

                            
                         <img alt="halwa" src={post.photo}/>
                       </div>
                       }
                        
                           
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
                                    <h6 key={com._id}>
                                    
                                    
                                    <Link to={ (com.postedBy._id==state._id)? "/profile": `/profile/${com.postedBy._id}`}>
                         <div style={{ display: 'flex', alignItems: 'center' }}>
                         <img src={com.postedBy.pic} alt={com.postedBy.userName} style={{ width: '20px', height: '20px', borderRadius: '50%', marginRight: '10px' }} />
                       
                        <span style={{fontWeight:"500"}} >{com.postedBy.userName}</span>
                         </div>
                        </Link>
                                    
                                    <span  >{com.comment} </span>  
                                           
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

export default Home
