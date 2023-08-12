const mongoose = require("mongoose");

const spendSchema = new mongoose.Schema({
    uId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    note: {
        type: String,
        reuqired: true
    },
    date:{
        type: String,
        required: true
    },
    time: {
        type: String,
        reuqired: true
    }
})
module.exports = mongoose.model('spends',spendSchema);