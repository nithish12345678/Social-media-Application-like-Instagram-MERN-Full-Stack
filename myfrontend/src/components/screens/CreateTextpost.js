import React,{useState,useEffect} from 'react'
import M from 'materialize-css'


import {useNavigate} from 'react-router-dom'
const CreateTextpost = ()=>{
    const navigate = useNavigate()
    const [title,setTitle] = useState("")
    const [text,setText] = useState("")

    const [url,setUrl] = useState("")
  
  
   const postDetails = ()=>{
    fetch(`${process.env.React_APP_Base_URL}/createpost`,{
            method:"post",
            headers:{
                "Content-Type":"application/json",
                "authentication":localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                title,
                type:"text",
                photo:text
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
           <textarea
            type="text"
             placeholder="Enter text to share"
             value={text}
            onChange={(e)=>setText(e.target.value)}
             />
        
            <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
            onClick={()=>postDetails()}
            
            >
                Submit post
            </button>

       </div>
   )
}


export default CreateTextpost;