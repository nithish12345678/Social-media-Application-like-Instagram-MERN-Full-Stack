import React,{useState,useContext,} from 'react'
import {Link,useNavigate} from 'react-router-dom'
import {UserContext} from '../../App'
import materialize from 'materialize-css'
const Signin  = ()=>{
    const {state,dispatch} = useContext(UserContext)
    const history = useNavigate()
    const [password,setPasword] = useState("")
    const [email,setEmail] = useState("")
    const PostData = ()=>{

        console.log("signing in");
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            materialize.toast({html: "invalid email",classes:"#c62828 red darken-3"})
            return
        }
        fetch("http://localhost:5000/signin",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                password,
                email
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data)
           if(data.error){
            materialize.toast({html: data.error,classes:"#c62828 red darken-3"})
           }
           else{
            //storing data in localStorage
               localStorage.setItem("jwt",data.token)
               localStorage.setItem("user",JSON.stringify(data.user))
               console.log("user:",data.user)
               //updating the state using reducer
               dispatch({type:"USER",payload:data.user})
               materialize.toast({html:"signedin success",classes:"#43a047 green darken-1"})
               history('/')
           }
        }).catch(err=>{
            console.log(err)
        })
    }
   return (
      <div className="mycard">
          <div className="card auth-card input-field">
            <h2>Mediashare</h2>
            <input
            type="text"
            placeholder="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            />
            <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e)=>setPasword(e.target.value)}
            />
            <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
            onClick={()=>PostData()}
            >
                Login
            </button>
            <h5>
                <Link to="/signup">Dont have an account ?</Link>
            </h5>
            {/* <h6>
                <Link to="/reset">Forgot password ?</Link>
            </h6> */}
    
        </div>
      </div>
   )
}


export default Signin