import React,{useEffect,createContext,useReducer,useContext} from 'react';
import NavBar from './components/Navbar'
import NavbarSide from './components/NavbarSide'
import "./App.css"
import { BrowserRouter as Router,Routes ,Route,useNavigate} from 'react-router-dom'
import Home from './components/screens/Home'
import Signin from './components/screens/SignIn'
import Profile from './components/screens/Profile'
import Signup from './components/screens/Signup'
import CreatePost from './components/screens/CreatePost'
import {reducer,initialState} from './reducers/userReducer'
import UserProfile from './components/screens/UserProfile'
import SubscribedUserPosts from './components/screens/SubscribedUserPosts'

export const UserContext = createContext()


const Routing = ()=>{
  const navigate = useNavigate()
  const {state,dispatch} = useContext(UserContext)

  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type:"USER",payload:user})
      navigate("/")
    }else{
      navigate("/signin")
    }
      
  }, [])
  return(
    <Routes >
      <Route exact path="/" element ={<Home />} />
      <Route path="/signin" element ={ <Signin />} />

      <Route path="/signup" element ={ <Signup />} />

      <Route exact path="/profile" element ={  <Profile />} />

      <Route path="/create" element ={ <CreatePost/>} />
      <Route path="/profile/:userId" element ={ <UserProfile/>} />
      <Route path="/myfollowingpost" element={<SubscribedUserPosts/>} />
    </Routes>
  )
}

function App() {
  const [state,dispatch] = useReducer(reducer,initialState)
  return (
    <UserContext.Provider value={{state,dispatch}}>
    <Router>
      <NavBar />
      <Routing />
    </Router>
    </UserContext.Provider>
  );
}

export default App;
