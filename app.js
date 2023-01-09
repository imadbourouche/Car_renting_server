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

//midellware
app.use(express.json())
app.use(morgan('dev'))

//authentification
app.post('/login',authMiddelware.loggedIn,async (req,res)=>{
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

app.post('/register',async (req,res)=>{
    let reqPhoneNumber= req.body.phoneNumber
    let reqFullName= req.body.fullName
    let reqCreditCardNumber=req.body.creditCardNumber
    let reqCreditCardExpiration=req.body.creditCardExpiration
    let reqDrivingLicense=req.body.drivingLicense

    if(!reqPhoneNumber || !reqFullName || !reqCreditCardNumber || !reqCreditCardExpiration || !reqDrivingLicense){
        res.status(400).json({"status":"error","message":"information not complete"})
    }else{
        try{
            const user = await userDb.findOne({phoneNumber:reqPhoneNumber})
            if(user){
                res.status(400).json({"status":"error","message":"phone number existe"})
            }
            else{
                encryptedPassword = await bcrypt.hash("123", 10);
                const newUser = await userDb.create({
                    fullName: reqFullName,
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

                res.status(201).json(newUser)
            }
        }catch(err){
            if(err.code=11000){
                console.log(`Duplication Error ${Object.keys(err.keyValue)[0]} already exists.`)
                res.status(500).json({"status":"error","message":Object.keys(err.keyValue)[0] + " already exists."})
            }else{
                console.log(err)
                res.status(500).json({"status":"error","message":"server error"})
            }
        }
    }
})



//routes
app.get("/users",authMiddelware.verifyToken,(req,res)=>{
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

app.get("/cars",authMiddelware.verifyToken,(req,res)=>{
    carDb.find({})
    .then((cars)=>{
        res.status(200).json(cars)
    })
    .catch((err)=>{
        console.log(err)
        res.status(500).json({"status":"error","message":"server error"})
    })
})


app.get("/cars/:idCar",authMiddelware.verifyToken,(req,res)=>{ 
    carDb.findById(req.params.idCar)
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


app.get("/user/carsRented",authMiddelware.verifyToken,(req,res)=>{
    userDb.findById(req.user.user_id)
    .then(async (user)=>{
        let cars = await carDb.find({
            '_id': { $in: 
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


app.post("/reserve/:idCar", authMiddelware.verifyToken ,async (req,res)=>{
    console.log(req.body)
    userDb.findById(req.user.user_id)
    .then(async (user)=>{
        console.log(user)
        let alreadyRented=user.carsRented.includes(req.params.idCar);
        if(alreadyRented){
            res.status(302).json({"status":"error","message":"Already Rented"});
        }else{
            let car = await carDb.findById(req.params.idCar);
            if(car){
                car.availability = false
                car.save()
                user.carsRented.push(req.params.idCar)
                user.save()
                res.status(200).json(user.carsRented)
            }else{
                res.status(404).json({"status":"error","message":"Not Found"})
            }
        }
    })
    .catch((err)=>{
        console.log(err)
        res.status(500).json({"status":"error","message":"server error"})
    })
})

module.exports = app;