const { resonse, json } = require("express");
const express = require("express");
const user = require("../models/user");
const router = express.Router();
const bycrpt = require("bcryptjs");
const transaction = require("../models/transaction");
const contact = require("../models/contact");



router.post("/api/register", async (req, res) => {
  // console.log(req.body);
  try {

    const { name, phoneNo,email,  password } = req.body;
    const salt = await bycrpt.genSalt(10);
    const sespass = await bycrpt.hash(password, salt);

    const finduser = await user.findOne({phoneNo:phoneNo});
    
    if(finduser && !(finduser.isUser)){
        const users = await user.updateOne({phoneNo}, 
        {$set: {name,isUser:true,password:sespass,email}});
        if(users){
          res.json({status:"register successfully"});
        }else{
          res.json({status: "already registered"});
        }
    }else{
        const users = await user.create({
          name,
          phoneNo,
          email,
          isUser:true,
          debt:0,
          credit:0,
          password: sespass,
        });
        if (users) {
          res.json({ status: "register successfully" });
        }else{
            res.json({status: "already registered"});
        }
    }
  } catch (error) {
    res.json({ status: "alredy exists", error: "error" });
  }
});
router.post("/api/changepass", async (req,res)=>{
  const {email,password,phoneNo} = req.body;
  try {
    const us= await user.findOne({phoneNo,email});
    if(!us){
      res.json({status:"user not found"});
    }else{
      if(us.isUser){
        const uid = us._id;
        const salt = await bycrpt.genSalt(10);
        const sespass = await bycrpt.hash(password, salt);
        const updattepass = await user.findByIdAndUpdate(uid,{$set: {password:sespass}});
        updattepass?res.json({status:"ok"}):res.json("not found");
      }else{
        res.json({status:'invalid user'});
      }
    }

  } catch (error) {
    res.json({status:"error"});
  }
})
router.post("/api/login", async (req, res) => {
  try {
    const { phoneNo, password } = req.body;
    const data = await user.findOne({ phoneNo: phoneNo });
    const compare = await bycrpt.compare(password, data.password);
    if (data.isUser && compare) {
      res.json({ status: "ok, user is login successfully", id: data._id });
    } else {
      res.json({ status: "error in password or email" });
    }
  } catch (error) {
    res.json({ status: "error in password or email" });
  }
});
router.get("/api/users", async (req, res) => {
  try {
    const data = await user.find();
    const senddata = [];
    for (let index = 0; index < data.length; index++) {
      let curr = data[index];
      if (curr.isUser) {
        let newobj = {
          name: curr.name,
          phoneNo: curr.phoneNo,
        };
        senddata.push(newobj);
      }
    }
    res.json({ status: "ok", users: senddata });
  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
});
router.get("/api/finduser/:po",async (req,res)=>{
  
  try {
    const {po}=req.params;
    const data = await user.find({"phoneNo": new RegExp(po)});
    const senddata = [];
    for (let index = 0; index < data.length; index++) {
      let curr = data[index];
      if (curr.isUser) {
        let newobj = {
          name: curr.name,
          phoneNo: curr.phoneNo,
        };
        senddata.push(newobj);
      }
    }
    res.json({ status: "ok", users: senddata });
  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
})
router.get('/api/userFindById/:id',async (req,res)=>{
    try {
        const {id}=req.params;
        const data = await user.findById(id);
        data?res.json({status:"ok",user:data}):
             res.json({status:"user not found"});
    } catch (error) {
        res.json({status:'error'});
    }
})
router.get('/api/userFindByNumber/:phoneNo', async (req,res)=>{
    try {
        const {phoneNo}=req.params;
        const data = await user.findOne({phoneNo});
        data?res.json({status:"ok",user:data}):
             res.json({status:"user not found"});
    } catch (error) {
        res.json({status:'error'});
    }
})
router.get('/api/updateamount/:id',async (req,res)=>{
    try {
        const {id}= req.params;
        const cntact = await contact.find({userId:id});
        let credit = 0;
        let debt =0;
        cntact.forEach(el => {
          if(el.amount>=0){
            credit+=el.amount;
          }else{
            debt-=el.amount;
          }
        });
        const updateuser = await user.updateOne({_id: id},{$set: {debt,credit}});
        updateuser?res.json({status:"ok",debt,credit}):res.json({status:"user not found"});
        
    } catch (error) {
        res.json({status:"error"});
    }
})
router.get('/api/addupi/:uid/:upi',async (req,res)=>{
  try {
    const {uid,upi}=req.params;
    await user.findByIdAndUpdate(uid,{$set: {upi:upi}});
    res.json({status:'ok'})
} catch (error) {
  res.json({status:'error'});
}
})
module.exports =router;