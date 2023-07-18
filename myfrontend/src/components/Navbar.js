import React,{useContext,useRef,useEffect,useState} from 'react'
import {Link ,useNavigate} from 'react-router-dom'
import {UserContext} from '../App'
import M from 'materialize-css'

const NavBar = ()=>{
    const  searchModal = useRef(null)
    const [search,setSearch] = useState('')
    const [userDetails,setUserDetails] = useState([])
     const {state,dispatch} = useContext(UserContext)
     const navigate = useNavigate()
     useEffect(()=>{
         M.Modal.init(searchModal.current)
     },[])
     const renderList = ()=>{
       if(state){
           return [
            <li key="0"><i  data-target="modal1" className="large material-icons modal-trigger" style={{color:"black"}}>search</i></li>,
            <li key="1"><Link to="/">Home</Link></li>,
           
            <li key="2"><Link to="/profile">Profile</Link></li>,
            <li key="3"><Link to="/create">Create Post</Link></li>,
            <li key="4"><Link to="/createtext">Share Text </Link></li>,
            <li key="5"><Link to="/myfollowingpost">My following Posts</Link></li>,
            <li  key="6">
             <button className="btn #c62828 red darken-3"
            onClick={()=>{
              localStorage.clear()
              dispatch({type:"CLEAR"})
              navigate('/signin')
            }}
            >
                Logout
            </button>
            </li>
         
            
           ]
       }else{
         return [
          <li  key="6"><Link to="/signin">Signin</Link></li>,
          <li  key="7"><Link to="/signup">Signup</Link></li>
         
         ]
       }
     }


     const fetchUsers = (query)=>{
        setSearch(query)
        fetch('http://localhost:5000/search-users',{
          method:"post",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({
            query
          })
        }).then(res=>res.json())
        .then(results=>{

          console.log(results);
          setUserDetails(results.users)
        })
     }
    return(
        <nav>
        <div className="nav-wrapper white">
        
          <Link to={state?"/":"/signin"} className=" brand-logo left">Mediachat</Link>
          <ul id="nav-mobile" className="right">
             {renderList()}
  
          </ul>
        </div>
        <div id="modal1" class="modal" ref={searchModal} style={{color:"black"}}>
          <div className="modal-content">
          <input
            type="text"
            placeholder="search users"
            value={search}
            onChange={(e)=>fetchUsers(e.target.value)}
            />
             <ul className="collection">
               {userDetails ?userDetails.map(item=>{
                 return <>      
                  <h4 className="card-title">
                        
                        <Link className="modal-close waves-effect btn-flat" onClick={()=>setSearch('')} to={ (item._id==state._id)? "/profile": `/profile/${item._id}`}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>


                     
                        <img src={item.pic} alt={item.userName} style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }} />
                      
                       <span>{item.userName}</span>

                       
                        </div>
                       </Link>
                       </h4>          
                 </>
                 
                 
                 
                //  <Link to={item._id !== state._id ? "/profile/"+item._id:'/profile'} onClick={()=>{
                //    M.Modal.getInstance(searchModal.current).close()
                //    setSearch('')
                //  }}><li className="collection-item">{item.email}</li></Link> 
               })  : <></>}
               
              </ul>
          </div>
          <div className="">
            <button className="modal-close waves-effect waves-green btn-flat" onClick={()=>setSearch('')}>close</button>
          </div>
        </div>


      </nav>
    )
}


export default NavBar