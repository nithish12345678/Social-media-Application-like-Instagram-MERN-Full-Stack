import React,{useEffect,useState,useContext} from 'react'
import {UserContext} from '../../App'
import {useParams} from 'react-router-dom'


const UserProfile  = ()=>{
    const [showFollow,setShowFollow]=useState(true)
    const {state,dispatch} = useContext(UserContext)

    const [profile,setProfile] = useState(null)
    const {userId} =useParams()
    useEffect(()=>{

        console.log(userId)
       fetch(`http://localhost:5000/user/${userId}`,{
           headers:{
               "authentication":localStorage.getItem("jwt")
           }
       }).then(res=>res.json())
       .then(result=>{
           
           setProfile(result)
           if(result.founduser.followers.includes(state._id)){
            setShowFollow(false)
           }
        //    setUser(result.founduser)
        //    console.log("user:",user)
        //    setPics(result.mypost)
        //    console.log("pics:",mypics)
       })
    },[])
  



    const updatePhoto=()=>{
           
      
    }



    const followUser=()=>{
        fetch(`http://localhost:5000/follow`,{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "authentication":localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                followId:userId
            })
        }).then(res=>res.json())
        .then(result=>{
           dispatch({type:"UPDATE",payload:{following:result.following,followers:result.followers}})
        
           localStorage.setItem("user",JSON.stringify(result))
           setShowFollow(false);
        })
        
    }
    const unfollowUser=()=>{
        fetch(`http://localhost:5000/unfollow`,{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "authentication":localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                followId:userId
            })
        }).then(res=>res.json())
        .then(result=>{
           dispatch({type:"UPDATE",payload:{following:result.following,followers:result.followers}})
        
           localStorage.setItem("user",JSON.stringify(result))
           setShowFollow(true);
        })
        
    }
   return (
        
    <div style={{maxWidth:"550px",margin:"0px auto"}}>



    {profile?
     <div>
     <div style={{
         margin:"18px 0px",
          borderBottom:"1px solid grey"
      }}>
    
    
      <div style={{
          display:"flex",
          justifyContent:"space-around",
         
      }}>
          <div>
              <img style={{width:"160px",height:"160px",borderRadius:"80px"}}
              src={profile.founduser?profile.founduser.pic:"loading"}
              />
            
          </div>
          <div>
              <h4>{profile.founduser?profile.founduser.name:"loading"}</h4>
              <h5>{profile.founduser?profile.founduser.userName:"loading"}</h5>
              <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                  <h6>{profile.posts.length} posts</h6>
                  <h6>{profile.founduser?profile.founduser.followers.length:"0"} followers</h6>
                  <h6>{profile.founduser?profile.founduser.following.length:"0"} following</h6>
              </div>
              {console.log("state:",state)}
              {console.log("follower:",profile.founduser.followers,state._id)}

              {showFollow?
                <div onClick={()=>followUser()} className="btn #64b5f6 blue darken-1">
                <span>Follow</span>
                  </div>
                  :
                  <div onClick={()=>unfollowUser()} className="btn #64b5f6 blue darken-1">
                  <span>UnFollow</span>
                    </div>
              }
            
    
          </div>
      </div>
    
       <div className="file-field input-field" style={{margin:"10px"}}>
       </div>
       </div>      
      <div className="gallery">
          {
            profile.posts.map(item=>{
                  return(
                   <img key={item._id} className="item" src={item.photo} alt={item.title}/>  
                  )
              })
          }
    
      
      </div>
      </div>
    
     :<h1>Loading!</h1>
    
    }
        
    </div>
     


   )

}


export default UserProfile



    

