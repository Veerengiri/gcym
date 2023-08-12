const express = require('express');
const user = require('./routes/user');
const tra = require('./routes/transactions')
const cnt = require('./routes/contact');
const sp = require('./routes/spends');
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

const mongourl = "mongodb+srv://Veerengiri:762003@cluster0.vjo3ghd.mongodb.net/cym?retryWrites=true&w=majority"

mongoose.connect(mongourl,{}).then(()=>{
    console.log("connected mongourl successfully");
}).catch((err)=>{console.log(err)})

app.use(express.json());
app.use(cors());
app.use(user);
app.use(tra);
app.use(cnt);
app.use(sp);

app.get('/',(req,res)=>{
    res.send("welcome to our hotel...");
}); 
const port = 7000;
app.listen(port,()=>{
    console.log("listening on port: "+port);
})