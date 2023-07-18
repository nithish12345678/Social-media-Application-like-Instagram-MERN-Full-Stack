import React,{useState,useEffect} from 'react'
import M from 'materialize-css'


import {useNavigate} from 'react-router-dom'
const CreatePost = ()=>{
    const navigate = useNavigate()
    const [title,setTitle] = useState("")
    const [body,setBody] = useState("")
    const [image,setImage] = useState("")
    const [url,setUrl] = useState("")
    useEffect(()=>{
       if(url){
        fetch(`${process.env.React_APP_Base_URL}/createpost`,{
            method:"post",
            headers:{
                "Content-Type":"application/json",
                "authentication":localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                title,
                type:"photo",
                body,
                photo:url
            })
        }).then(res=>res.json())
        .then(data=>{
    
           if(data.error){
             console.log("error in post back");
              M.toast({html: data.error,classes:"#c62828 red darken-3"})
           }
           else{
               M.toast({html:"Created post Successfully",classes:"#43a047 green darken-1"})
               navigate('/')
           }
        }).catch(err=>{
            console.log(err)
        })
    }
    },[url])
  
   const postDetails = ()=>{
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
          setUrl(data.secure_url)
       })
       .catch(err=>{
           console.log("error",err)
       })
   }
 

   return(
       <div className="card input-filed"
       style={{
           margin:"30px auto",
           maxWidth:"500px",
           padding:"20px",
           textAlign:"center"
       }}
       >
           <input 
           type="text"
            placeholder="title"
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
            />
           <input
            type="text"
             placeholder="body"
             value={body}
            onChange={(e)=>setBody(e.target.value)}
             />
           <div className="file-field input-field">
            <div className="btn #64b5f6 blue darken-1">
                <span>Uplaod Image</span>
                <input type="file" onChange={(e)=>setImage(e.target.files[0])} />
            </div>
            <div className="file-path-wrapper">
                <input className="file-path validate" type="text" />
            </div>
            </div>
            <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
            onClick={()=>postDetails()}
            
            >
                Submit post
            </button>

       </div>
   )
}


export default CreatePost;