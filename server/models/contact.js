const mongoose = require('mongoose');
const contactSchema= new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    time: {
        type: String,
        reuqired: true
    },
    contactId: {
        type: String,
        required: true
    },
    amount:{
        type:Number,
        required: true
    },
    notify:{
        type:Number,
        default: 0,
    }
})
module.exports = mongoose.model('contact',contactSchema);