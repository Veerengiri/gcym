const mongoose  = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phoneNo: {
        type: String,
        required: true,
        unique: true
    },
    email:{
        type:String, 
        
    },
    isUser: {
        type: Boolean,
        required: true,
    },
    debt: {
        type: Number,
        reuqired: true,
    },
    credit: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    upi:{
        type:String,
        default: "null",
    }
})
module.exports = mongoose.model('user',userSchema);