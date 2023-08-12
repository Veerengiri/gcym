const express = require('express');
const router = express.Router();
const transaction = require('../models/transaction');
const contact = require('../models/contact');
const user = require('../models/user');




router.get('/api/addtocontact/:id/:phoneNo/:name',async (req,res)=>{
    try {
        const {phoneNo,id,name}= req.params;
        const cnt = await user.findOne({phoneNo: phoneNo});
        
        const time = Date.now();
        if(cnt!=null){
            const cont = await contact.findOne({userId:id,contactId:cnt._id});
            const cont2 = await contact.findOne({userId:cnt._id,contactId:id});
            if(cont){
            res.json({status:'already axist'});
            return;
            }
            const ac = await contact.create({
                userId: id,
                time,
                contactId: cnt._id,
                amount: 0,
            })
            
            if(!cont2){
                const ac2 = await contact.create({
                    userId: cnt._id,
                    time,
                    contactId:id,
                    amount:0,
                })
            }
            (ac) ?res.json({status:"ok"}):res.json({status:"server error"});
        }else{
            
            const us= await user.create({
                name:name,
                phoneNo:phoneNo,
                email: phoneNo,
                isUser: false,
                debt: 0,
                credit: 0,
                password: "new user"
            })
            const us2 = await user.findOne({phoneNo});
            
            if(us2!=null){
                
                const ac1 = await contact.create({
                    userId: id,
                    time,
                    contactId: us2._id,
                    amount: 0,
                });
                const ac2 = await contact.create({
                    userId: us2._id,
                    time,
                    contactId: id,
                    amount : 0,
                });
                (ac1) ?res.json({status:"ok"}):res.json({status:"server error"});
            }else{
                res.json({status:"server error "});
            }
        }
    } catch (error) {
        res.json({status:error});
    }
})


router.get('/api/getcontact/:uid',async (req,res)=>{
    try {
        const cnt = await contact.find({userId: req.params.uid}).sort({time: -1}).limit(8);
        const totalcontact = await contact.count({userId: req.params.uid});
        let ids=[];
        for (let index = 0; index < cnt.length; index++) {
            const el = cnt[index];
            ids.push(el.contactId);
        }
        // const maindata = await user.find({_id: {$in: ids}});
        let maindata=[];
        for (let index = 0; index < ids.length; index++) {
            const element = ids[index];
            let a = await user.findById(element);
            maindata.push(a);
        }
        let senddata = [];
        for (let index = 0; index < cnt.length; index++) {
            let a= cnt[index];
            let b= maindata[index];
            let obj={
                name: b.name,
                phoneNo: b.phoneNo,
                amount: a.amount,
                id: a.contactId,
                notify: a.notify,
            }
            senddata.push(obj);
        }
        cnt?res.json({status:'ok',contact: senddata,totalcontact}):res.json({status:'not found'});
    } catch (error) {
        res.json({status:"error"});
    }
})

router.get('/api/getallcontact/:uid',async (req,res)=>{
    try {
        const cnt = await contact.find({userId: req.params.uid}).sort({time: -1}).skip(8);
        let ids=[];
        for (let index = 0; index < cnt.length; index++) {
            const el = cnt[index];
            ids.push(el.contactId);
        }
        // const maindata = await user.find({_id: {$in: ids}});
        let maindata=[];
        for (let index = 0; index < ids.length; index++) {
            const element = ids[index];
            let a = await user.findById(element);
            maindata.push(a);
        }
        let senddata = [];
        for (let index = 0; index < cnt.length; index++) {
            let a= cnt[index];
            let b= maindata[index];
            let obj={
                name: b.name,
                phoneNo: b.phoneNo,
                amount: a.amount,
                id: a.contactId,
                notify: a.notify,
            }
            senddata.push(obj);
        }
        
        cnt?res.json({status:'ok',contact: senddata}):res.json({status:'not found'});
    } catch (error) {
        res.json({status:"error"});
    }
})

router.get('/api/getsinglecontact/:sid/:rid',async (req,res)=>{
    try {
        const {sid,rid}=req.params;
        const cnt = await contact.findOne({userId:sid,contactId:rid});
        res.json({status:'ok',cntamt:cnt.amount});
    } catch (error) {
        res.json({status:"error"});
    }
})

router.get('/api/contactupdateamount/:sid/:rid',async (req,res)=>{
    try {
        const {sid,rid} = req.params;
        const data = await transaction.find({senderId:sid,recId:rid});
        const data2 = await transaction.find({senderId:rid,recId: sid});
        let val = 0;
        for (let index = 0; index < data.length; index++) {
            let element = data[index];
            val += element.amount;
        }
        for (let index = 0; index < data2.length; index++) {
            let element = data2[index];
            val -= element.amount;
        }
        const cnt = await contact.updateOne({userId:sid,contactId:rid},{$set: {amount: val}});
        const cnt2 = await contact.updateOne({userId:rid,contactId:sid},{$set: {amount: 0-val}});
        cnt && cnt2?res.json({status:"ok",amount:val}):res.json({status:"not updated"});
    } catch (error) {
        res.json({status:"error"});
    }
})
router.get('/api/updatetime/:sid/:rid',async (req,res)=>{
    try {
        const {sid,rid}=req.params;
        const data = await contact.findOne({userId:sid,contactId:rid});
        const data2 = await contact.findOne({userId:rid,contactId:sid});
        if(!data || !data2){
            res.json({status:"not found"});
            return;
        }
        const id = data._id;
        const id2 = data2._id;
        const dt = await contact.findByIdAndUpdate(id,{$set:{time: Date.now()}})
        const dt2 = await contact.findByIdAndUpdate(id2,{$set:{time: Date.now()}})
        dt && dt2?res.json({status:"ok"}):res.json({status:'not found'});

    } catch (error) {
        res.json({status:"error"})
    }
})


router.get('/api/notify/:sid/:rid',async (req,res)=>{
    try {
        const {sid,rid}=req.params;
        const data = await contact.updateOne({userId:sid,contactId:rid},
            { $inc: { notify: 1 } });
        if(!data){
            res.json({status:"not found"});
            return;
        }
        res.json({status:'ok'})

    } catch (error) {
        res.json({status:"error"})
    }
})
router.get('/api/getnotify/:sid/:rid',async (req,res)=>{
    try {
        const {sid,rid}=req.params;
        const data = await contact.findOne({userId:sid,contactId:rid});
        if(!data){
            res.json({status:"not found"});
            return;
        }
        res.json({status:'ok',notify: data.notify})

    } catch (error) {
        res.json({status:"error"})
    }
})
router.get('/api/clearnotify/:sid/:rid',async (req,res)=>{
    try {
        const {sid,rid}=req.params;
        const data = await contact.updateOne({userId:sid,contactId:rid},{$set:{notify:0}});
        if(!data){
            res.json({status:"not found"});
            return;
        }
        res.json({status:'ok'})

    } catch (error) {
        res.json({status:"error"})
    }
})
module.exports = router;