const jwt = require("jsonwebtoken");

require("dotenv").config()
exports.authenticate = (req,res,next)=>{

    // Checking if the the user has a valid token or not
    try{

        console.log(req.header("Authorization"))
        // Fetching token
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ","");

        if(!token){
            return res.status(401).json(
                {
                    sucess:false,
                    message:"No token provided"
                }
            )
        }

        // Verifying the token
        try{

            const decodeToken =jwt.verify(token,process.env.JWT_KEY);

            req.decodeToken = decodeToken
            next()
        }
        catch(e){
            return res.status(401).json(
                {
                    sucess:false,
                    message:"Invalid token"
                }
            )
        }
    }
    catch(e){

        return res.status(500).json(
            {
                sucess:false,
                message:e.message
            }
        )
    }
}

exports.isStudent = (req,res,next)=>{

    try{

        if(req.decodeToken.role !== 'student'){

            return res.status(401).json(
                {
                    sucess:false,
                    message:"You are not authorized to view this page"
                }
            )
        }
        
        next()
    }
    catch(e){

        return res.status(500).json(
            {
                sucess:false,
                message:e.message
            }
        )
    }
}

exports.isAdmin = (req,res,next)=>{

    try{

        if(req.decodeToken.role !== 'admin'){

            return res.status(401).json(
                {
                    sucess:false,
                    message:"You are not authorized to view this page"
                }
            )
        }
        
        next()
    }
    catch(e){

        return res.status(500).json(
            {
                sucess:false,
                message:e.message
            }
        )
    }
}