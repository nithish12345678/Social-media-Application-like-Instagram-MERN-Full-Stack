import React,{useEffect,useState,useContext} from 'react'
import {UserContext} from '../../App'

const Profile  = ()=>{
    const [mypics,setPics] = useState([])
    const {state,dispatch} = useContext(UserContext)
    const [image,setImage] = useState("")
    const [url,setUrl] = useState("")
    useEffect(()=>{
       fetch(`${process.env.React_APP_Base_URL}/myposts`,{
           headers:{
               "authentication":localStorage.getItem("jwt")
           }
       }).then(res=>res.json())
       .then(result=>{
           console.log("profile",result)
           setPics(result.posts)
       })
    },[])


    useEffect(()=>{
       if(url){
        fetch(`${process.env.React_APP_Base_URL}/updatepic`,{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "authentication":localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                pic:url
            })
        })
        .then(res=>res.json())
        .then(result=>{
            console.log("profile updated succesfully",(result))
         
            console.log("result:")
       
            //window.location.reload()
        })
       }
     },[url])
 




    useEffect(()=>{
       if(image){

        console.log("calling update")
        const data = new FormData()
       data.append("file",image)
       data.append("upload_preset",process.env.React_APP_upload_preset)
       data.append("cloud_name",process.env.React_APP_cloud_name)
       fetch(process.env.React_APP_cloudinary_Upload_API,{
            method:"post",
           body:data
       })
       .then(res=>res.json())
       .then(data=>{
        setUrl(data.url);
        localStorage.setItem("user",JSON.stringify({...state,pic:data.pic}))
        dispatch({type:"UPDATEPIC",payload:data.url})
        })
        .catch(err=>{
            console.log("error",err)
        })
       }
        
    },[image])
   return (
       <div style={{maxWidth:"550px",margin:"0px auto"}}>
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
                   alt="Loading" src={state?state.pic:"https://media.istockphoto.com/id/522855255/vector/male-profile-flat-blue-simple-icon-with-long-shadow.jpg?s=612x612&w=0&k=20&c=EQa9pV1fZEGfGCW_aEK5X_Gyob8YuRcOYCYZeuBzztM="}
                   />
                 {console.log("state:",state)}
               </div>
               <div>
                   <h4>{state?state.name:"loading"}</h4>
                   <h5>{state?state.userName:"loading"}</h5>
                   <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                       <h6>{mypics?mypics.length:"0"} posts</h6>
                       <h6>{state?state.followers.length:"0"} followers</h6>
                       <h6>{state?state.following.length:"0"} following</h6>
                   </div>

               </div>
           </div>
        
            <div className="file-field input-field" style={{margin:"10px"}}>
            <div className="btn #64b5f6 blue darken-1">
                <span>Update pic</span>
                <input type="file" onChange={(e)=>setImage(e.target.files[0])} />
            </div>
            <div className="file-path-wrapper">
                <input className="file-path validate" type="text" />
            </div>
            </div>
            </div>  
                
           <div className="gallery">
               {
                   mypics.map(item=>{
                       return(

                        <>
                       {item.type=="text"  ?<h5 className="item">{item.photo}</h5>
 :
 <img key={item._id} className="item" src={item.photo} alt={item.title}/>  

}
                        
                        </>
                       
                       )
                   })
               }

           
           </div>
       </div>
   )
}


export default Profile