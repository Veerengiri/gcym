const express = require("express");
const router = express.Router();
const transaction = require("../models/transaction");
const user = require("../models/user");

router.post("/api/addtra", async (req, res) => {
  try {
    const { senderId, recId, amount, date, time, fulltime, note } = req.body;
    let isdebt = false;
    if (amount < 0) {
      isdebt = true;
    }
    const tra = await transaction.create({
      senderId,
      recId,
      amount,
      date,
      time,
      fulltime,
      isdebt,
      note,
    });
    if(tra){
      res.json({ status: "transaction added successfully" })
      // const dt = await user.findById(recId)
      // let message = `You ${amount>0?"got":"gave"} ₹ ${Math.abs(amount)} from ${dt.name}`
      // sendMessage(message,"+15017122661",dt.phoneNo)
    }else{
      res.json({ status: "server error" });
    }
    
  } catch (error) {
    res.json({ status: "error", error: "server error" });
  }
});
router.post("/api/changetra",async (req,res)=>{
  try {
    
    const {cid,tamount,note}= req.body;
    const tra = await transaction.findByIdAndUpdate(cid,{$set: {amount: tamount,note:note}});
  
    tra?res.json({status:"change successfully"}):res.json({status:"not found"});
  } catch (error) {
    res.json({status:"error"});
  }
})
router.post("/api/changetra2",async (req,res)=>{
  try {
    
    const {cid,tamount,note,isdebt}= req.body;
    const tra = await transaction.findByIdAndUpdate(cid,{$set: {amount: tamount,note:note,isdebt}});
  
    tra?res.json({status:"change successfully"}):res.json({status:"not found"});
  } catch (error) {
    res.json({status:"error"});
  }
})
router.get("/api/gettra/:senderId/:recId", async (req, res) => {
  try {
    const { senderId, recId } = req.params;
    // let tra = await transaction.find({ senderId, recId }).sort({_id: -1}).limit(3);
    let tra = await transaction.find({ $or: [ { senderId,recId}, { senderId: recId,recId: senderId } ] } ).sort({fulltime: -1}).limit(6);
    const name = await user.findById(recId);
    const n= name.name;
    let newtra=[];
    for (let i = 0; i < tra.length; i++) {
      let e = tra[i];
      let obj ={
        name: e.senderId==senderId?"you":n,
        amount: e.amount,
        date: e.date,
        time: e.time,
        fulltime: e.fulltime,
        isdebt: e.isdebt,
        note: e.note,
        id: e._id
      }
      newtra.push(obj);
    }
    const userdtails = await user.findById(recId).select("name upi -_id")
    tra && name
      ? res.json({ status: "ok",tra: newtra ,user:userdtails})
      : res.json({ status: "server error" });
  } catch (error) {
    res.json({ status: "error" });
  }
});
router.get("/api/getalltra/:senderId/:recId", async (req, res) => {
  try {
    const { senderId, recId } = req.params;
    let tra = await transaction.find({ $or: [ { senderId,recId}, { senderId: recId,recId: senderId } ] } ).sort({fulltime: -1});
    const name = await user.findById(recId);
    const n= name.name;
    let newtra=[];
    for (let i = 0; i < tra.length; i++) {
      let e = tra[i];
      let obj ={
        name: e.senderId==senderId?"you":n,
        amount: e.amount,
        date: e.date,
        time: e.time,
        fulltime: e.fulltime,
        isdebt: e.isdebt,
        note: e.note,
        id: e._id
      }
      newtra.push(obj);
    }


    tra && name
      ? res.json({ status: "ok",tra: newtra })
      : res.json({ status: "server error" });
  } catch (error) {
    res.json({ status: "error" });
  }
});
router.delete("/api/deletetran/:tid", async (req, res) => {
  try {
    const { tid } = req.params;
    const tra = await transaction.findByIdAndDelete(tid);
    tra
      ? res.json({ status: "transaction deleted" })
      : res.json({ status: "not found" });
  } catch (error) {
    res.json({ status: "error" });
  }
});
router.post("/api/split", async (req, res) => {
  try {
    const { sid, split, amount ,date,time} = req.body;
    let splits = split.filter((item, i, ar) => ar.indexOf(item) === i);
    const len = splits.length;
    const samount = Math.round(amount*1.0 / (len + 1.0));

 
    const sender = await user.findById(sid);
    const name = sender.name;
    const note = "requested by : "+name;
    const fulltime = Date.now();
    
    for (let i = 0; i < splits.length; i++) {
      const rid = splits[i];
      let isdebt = false;
      if (samount < 0) {
        isdebt = true;
      }
      const tra = await transaction.create({
        senderId: sid,
        recId: rid,
        amount: samount,
        date,
        time,
        fulltime,
        isdebt,
        note,
      });
    }
    res.json({ status: "transaction added successfully" })
      
  } catch (error) {}
});

router.get("/api/getlastTra/:senderId",async (req,res)=>{
  try {
    const { senderId } = req.params;
    let tra = await transaction.find({ senderId }).sort({fulltime:-1}).limit(1);
    let sobj = tra[0];
    let {amount,date,time,fulltime,isdebt,note,_id}=sobj
    let nobj = {name:"you",amount,date,time,fulltime,isdebt,note,id:_id}
    res.json({status:'ok',tra:nobj})
  } catch (error) {
    res.json({ status: "error" });
  }
})
router.get("/api/getlastchangeTra/:traid",async (req,res)=>{
  try {
    const { traid } = req.params;
    let tra = await transaction.findById(traid);
    
    let {amount,date,time,fulltime,isdebt,note,_id}=tra;
    let nobj = {name:"you",amount,date,time,fulltime,isdebt,note,id:_id}
    res.json({status:'ok',tra:nobj})
  } catch (error) {
    res.json({ status: "error" });
  }
})
// const sendMessage = async (message,sender,reciver)=>{
//   const accountSid
//   const authToken;
//   const client = require('twilio')(accountSid, authToken);

//   client.messages
//     .create({
//       body: `CYM: ${message} visit:https://gcym.netlify.app`,
//       from: `${sender}`,
//       to: `+91${reciver}`
//     })
//     .then(message => console.log(message.sid));
// }

module.exports = router;
