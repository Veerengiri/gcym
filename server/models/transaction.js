const mongoose  = require('mongoose');

const trcSchema = new mongoose.Schema({
    senderId: {
        type: String,
        required: true
    },
    recId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    fulltime: {
        type: String,
        required: true
    },
    isdebt:{
        type: Boolean,
        required: true
    },
    note: {
        type: String,
        required: true
    }

})
module.exports = mongoose.model('transaction',trcSchema);