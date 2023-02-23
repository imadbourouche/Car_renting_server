const express = require('express')
const morgan = require('morgan');
require("dotenv").config();
require("./config/database").connect()
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
const userDb=require("./model/user")
const carDb=require("./model/car")
const authMiddelware = require("./middleware/auth")
const app = express()
const path=require('path')
const mongoose = require('mongoose')
var bodyParser = require('body-parser')


// swagger for api documentation
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))


//midellware
app.use(express.json())
app.use(morgan('dev'))
app.use(express.static('public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

//authentification
/*
app.post('/login',authMiddelware.loggedIn,async (req,res)=>{
    console.log(req.body.phoneNumber,req.body.password)
    let reqPhoneNumber= req.body.phoneNumber
    let reqPassword = req.body.password

    if(!reqPassword|| !reqPhoneNumber ){
        res.status(400).json({"status":"error","message":"no credential found"})
    }else{
        userDb.findOne({phoneNumber:reqPhoneNumber})
        .then((user)=>{
            if(!user){
                console.log(`user with phone number ${reqPhoneNumber} not found`)
                res.status(404).json({"status":"error","message":"user not found"})
            }else{
                bcrypt.compare(reqPassword, user.password)
                .then((result)=>{
                    if(result){
                        const userToken = jwt.sign(
                            {user_id: user._id , reqPhoneNumber},
                            process.env.TOKEN_KEY,
                            {
                                expiresIn: "30d",
                            }
                        )
                        user.token = userToken
                        res.status(200).json({"status":"success","token":userToken})
                    }
                })
                .catch((err)=>{
                    res.status(200).json({"status":"error","message":"error"})        
                })
            }
        })
        .catch((err)=>{
            console.log(err)
            res.status(500).json({"status":"error","message":"server error"})
        })
    }

})
*/

// TO-DO
// get the driving licence file
/*
app.post('/register',async (req,res)=>{
    let reqPhoneNumber= req.body.phoneNumber
    let reqCreditCardNumber=req.body.creditCardNumber
    let reqCreditCardExpiration=req.body.creditCardExpiration
    let reqDrivingLicense=req.body.drivingLicense

    if(!reqPhoneNumber || !reqCreditCardNumber || !reqCreditCardExpiration || !reqDrivingLicense){
        res.status(400).json({"status":"error","message":"information not complete"})
    }else{
        try{
            const user = await userDb.findOne({phoneNumber:reqPhoneNumber})
            if(user){
                res.status(400).json({"status":"error","message":"phone number existe"})
            }
            else{
                let pass = Math.floor(Math.random() * (99999999 - 10000000) + 10000000);
                let encryptedPassword = await bcrypt.hash(pass.toString(), 10);
                const newUser = await userDb.create({
                    phoneNumber: reqPhoneNumber,
                    password: encryptedPassword,
                    creditCardNumber: reqCreditCardNumber,
                    creditCardExpiration: reqCreditCardExpiration,
                    drivingLicense: reqDrivingLicense
                });

                const jwtToken = jwt.sign(
                    {User_id: newUser._id,reqPhoneNumber},
                    process.env.TOKEN_KEY,
                    {
                        expiresIn: "30d",
                    }
                )
                newUser.token=jwtToken

                res.status(201).json({"user":newUser,"password":pass.toString()})
            }
        }catch(err){
            if(err.code=11000){
                //console.log(err);
                console.log(`Duplication Error ${Object.keys(err.keyValue)[0]} already exists.`)
                res.status(500).json({"status":"error","message":Object.keys(err.keyValue)[0] + " already exists."})
                //res.status(500).json({"status":"error","message":"information already exists."})
                
            }else{
                console.log(err)
                res.status(500).json({"status":"error","message":"server error"})
            }
        }
    }
})
*/


//routes

app.get("/users",(req,res)=>{
    console.log(req.user)
    userDb.find({})
    .then((users)=>{
        res.status(200).json(users)
    })
    .catch((err)=>{
        console.log(err)
        res.status(500).json({"status":"error","message":"server error"})
    })
})


app.get("/cars",(req,res)=>{
    carDb.aggregate([{ $project: { PIN:0 } }])
    .then((cars)=>{
        res.status(200).json(cars)
    })
    .catch((err)=>{
        console.log(err)
        res.status(500).json({"status":"error","message":"server error"})
    })
})


app.get("/cars/:idCar",(req,res)=>{ 
    carDb.aggregate([ { $match: { $expr : { $eq: [ '$_id' , { $toObjectId: req.params.idCar } ] } } } , { $project: { PIN:0 } }])
    .then((car)=>{
        if(car){
            res.status(200).json(car)
        }else{
            res.status(404).json({"status":"error","message":"Not Found"})
        }
    })
    .catch((err)=>{
        console.log(err)
        res.status(500).json({"status":"error","message":"server error"})
    })
})



app.get("/user/carsRented/:phone",(req,res)=>{
    console.log(req.params.phone)
    userDb.findOne({ phoneNumber: req.params.phone})
    .then(async (user)=>{
        console.log(user)
        let cars = await carDb.find({
            _id: { $in: 
                user.carsRented
            }
        });
        res.status(200).json(cars)
    })
    .catch((err)=>{
        console.log(err)
        res.status(500).json({"status":"error","message":"server error"})
    })
})


app.post("/reserve/:phone/:idCar",async (req,res)=>{
    console.log(req.params.phone)

    carDb.findById(req.params.idCar)
    .then(async (car)=>{
        if(car){
            if(car.availability){
                let user = await userDb.findOne({ phoneNumber: req.params.phone});
                user.carsRented.push(req.params.idCar)
                user.save()
                car.availability = false
                car.PIN = Math.floor(Math.random() * (9999 - 1111) + 1111);
                car.save()
                res.status(200).json(user.carsRented)
            }else{
                res.status(302).json({"status":"error","message":"Already Rented"});
            }

        }else{
            res.status(404).json({"status":"error","message":"Not Found"})
        }
    })
    .catch((err)=>{
        console.log(err)
        res.status(500).json({"status":"error","message":"server error"})
    })
})


app.post("/endreserve/:phone/:idCar",async (req,res)=>{
    //userDb.findById(req.user.user_id)
    console.log(req.params.phone)
    userDb.findOne({ phoneNumber: req.params.phone})
    .then(async (user)=>{
        if(user){
            let car = carDb.findById(req.params.idCar)
            if(car){
                user.carsRented.remove(req.params.idCar)
                user.save()
                const filter = {_id: req.params.idCar}
                const update = {availability: true, PIN:0} 
                let doc = await carDb.findOneAndUpdate(filter,update);
                res.status(404).json({"status":"success","message":"End reservation successfully"})
            }else{
                res.status(404).json({"status":"error","message":"Car Not Found"})
            }
        }else{
            res.status(404).json({"status":"error","message":"User Not Found"})
        }
    })
    .catch((err)=>{
        console.log(err)
        res.status(500).json({"status":"error","message":"server error"})
    })
})



app.post("/editinfo/:phone",(req,res)=>{
    //userDb.findById(req.user.user_id)
    console.log(req.body.phoneNumber,req.body.password,req.body.creditCardNumber)
    userDb.findOne({ phoneNumber: req.params.phone})
    .then(async (user)=>{
        if (user){
            const filter = {phoneNumber:req.params.phone}
            const update = req.body
            let doc = await userDb.findOneAndUpdate(filter,update, {new: true});
            res.status(200).json({"status":"success","message":doc})
        }else{
            res.status(404).json({"status":"error","message":"Not Found"})
        }
    })
    .catch((err)=>{
        if(err.code=11000){
            console.log(`Duplication Error when update ${Object.keys(err.keyValue)[0]} already exists.`)
            res.status(500).json({"status":"error","message":Object.keys(err.keyValue)[0] + " already exists."})
        }else{
            console.log(err)
            res.status(500).json({"status":"error","message":"server error"})
        }
    })

})

module.exports = app;