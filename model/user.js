const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    phoneNumber:{
        type: String,
        require: true,
        unique: true
    },
    
    fullName:{
        type: String,
        require: true,
        unique: true
    },

    password:{
        type: String,
        require: true,
    },

    creditCardNumber:{
        type:String,
        require:true,
        unique:true
    },
    
    creditCardExpiration:{
        type:String,
        require:true     
    },

    drivingLicense:{
        type:String,
        require:true
    },
    
    token:{
        type:String
    },

    carsRented:{
        type:Array
    }

});

module.exports = mongoose.model("users",userSchema);