const mongoose = require('mongoose')

const carSchema = new mongoose.Schema({
    mark:{
        type: String,
        require: true,
    },

    model:{
        type: String,
        require: true,
    },

    engine:{
        type: String,
        require: true,
    },

    tarif:{
        type:String,
        require:true,
    },
    
    mileage:{
        type:String,
        require:true        
    },

    availability:{
        type:Boolean,
        require:true,
        default: true
    },

    location:{
        type: String,
        require: true,
    },

    image:{
        type: String,
        require: true
    }

});

module.exports = mongoose.model("cars",carSchema);

/*
[
{
    "mark":"Bugatti",
    "model":"Chiron",
    "engine":"8.0-liter W16 ",
    "tarif":"200",
    "mileage":"1234",
    "availability": true,
    "location":"36.719436, 3.142146",
    "image":"https://imagebugatti",    
},
{
    "mark":"Bugatti1",
    "model":"Chiron1",
    "engine":"8.0-liter W161",
    "tarif":"2001",
    "mileage":"12341",
    "availability": true,
    "location":"36.719436, 3.142146",
    "image":"https://imagebugatti1",    
},
{
    "mark":"Bugatti2",
    "model":"Chiron2",
    "engine":"8.0-liter W162 ",
    "tarif":"2002",
    "mileage":"12342",
    "availability": true,
    "location":"36.719436, 3.142146",
    "image":"https://imagebugatti2",    
}
]
{
    "model":"",
    "mark":"",
    "engine":"",
    "tarif":"",
    "mileage":"",
    "availability":"",
    "location":"",
    "image":"",    
}
*/