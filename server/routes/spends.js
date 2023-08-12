
const  express= require("express");
const router = express.Router();
const tpn = require('../models/spends');

router.post('/api/addspends',async (req,res)=>{
    try {
        const {uId,amount,note,date}= req.body;
        const time = Date.now();
        const ns = await tpn.create({
            uId,
            amount,
            date,
            time,
            note
        })

        ns?res.json({status:"ok"}):res.json({status:"not created"});
    } catch (error) {
        res.json({status:"error"});
    }
})

router.delete('/api/deletespends/:sid', async (req,res)=>{
    try {
        const a = await tpn.findByIdAndDelete(req.params.sid);
        a?res.json({status:"ok"}):res.json({status:"not deleted"});
    } catch (error) {
        res.json({status:"error"});
    }
})
router.get('/api/getspends/:uid', async (req,res)=>{
    try {
        const spends = await tpn.find({uId:req.params.uid}).sort({time:-1});
        const spend = await tpn.find({uId:req.params.uid});
        let total =0;
        for(let i=0;i<spend.length;i++){
            let e = spend[i];
            total += e.amount;
        }
        spends?res.json({status:"ok",spends,total}):res.json({status:"not found"});
    } catch (error) {
        res.json({status:"error"});
    }
})
router.post('/api/updatespends',async (req,res)=>{
    try {
        const {sid, amount,note} = req.body;
        const spends = await tpn.findByIdAndUpdate(sid,{$set:{amount,note}});
        spends?res.json({status:"ok"}):res.json({status:"not found"});
    } catch (error) {
        res.json({status:"error"});
    }
})
module.exports = router;