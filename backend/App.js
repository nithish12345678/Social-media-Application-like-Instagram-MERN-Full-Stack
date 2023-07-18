const express=require('express');
var bodyParser = require("body-parser");
require('dotenv').config()
const mongoose=require('mongoose');
const app = express();
const port=5000 || process.env.PORT;
const auth=require("./routes/auth");
const post=require("./routes/post");
const user=require("./routes/user");


const cors=require('cors');
app.use(cors())
app.use(express.json());
app.use(auth);
app.use(post);
app.use(user);
mongoose.set("strictQuery", false);
mongoose.connect(process.env.mongoUrl, {useNewUrlParser: true})
mongoose.connection.on("connected",function(){
    console.log("succesfully connected to mongo");
})
mongoose.connection.on("err",function(){
    console.log("not connected to mongoose");
})

require("./models/model");
require("./models/post");


app.get("/",function(req,res) {
}
)
app.listen(port,() => {
 console.log("server started at port " + port);
})