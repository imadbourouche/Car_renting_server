const jwt = require('jsonwebtoken')

const verifyToken = (req,res,next)=>{
    const token = req.body.token || req.query.token || req.headers["x-access-token"]
    if(!token){
        res.status(403).json({"status":"error","message":"token required"})
    }else{

    try{
        const tokenDecoded =  jwt.verify(token , process.env.TOKEN_KEY);
        req.user = tokenDecoded;
        next()
    }catch(err){
        res.status(401).json({"status":"error","message":"invalid token"})
    }
}
}

const loggedIn = (req,res,next)=>{
    try{
        const token = req.body.token || req.query.token || req.headers["x-access-token"]
        if(!token){
            next()
        }else{
            console.log("already logged in")
            res.redirect("/users")
        }
    }catch(err){
        res.status(500).json({"status":"error","message":"token required"})
    }
}

exports.loggedIn = loggedIn;
exports.verifyToken = verifyToken;