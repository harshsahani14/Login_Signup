const User = require("../Models/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()


exports.signup = async (req,res)=>{

    try{

        // Fetching from request
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const role = req.body.role

        let dbuser = await User.findOne({email})

        // Checking if email exists or not
        if(dbuser){
            return res.status(400).json({
                sucess:false,
                message:"Email already exists"
            })
        }

        // Hashing password
        let hashPass = '';

        try{
            hashPass = await bcrypt.hash(password,10)
        }
        catch(e){
            return res.status(500).json({
                sucess:false,
                message:e.message

            })
        }

        // Creating user and saving it in db
        const user = new User(
        {   name,
            email,
            password:hashPass,
            role        
        })

        const data = await user.save()

        return res.status(200).json({
            sucess:true,
            message:"User registered"
        })
    }
    catch(e){

        return res.status(500).json({
            sucess:false,
            message:e.message
        })
    }
}

exports.login = async (req,res)=>{

    try{

        // Fetching email and password
        const email = req.body.email;
        const password = req.body.password;

        //Checking if the input fields are empty or not 
        if(!email || !password){
            return res.status(400).json({
                sucess:false,
                message:"Input fields are empty"
            })
        }

        // Checking if user exists in db or not
        let user = await User.findOne({email});

        if(!user){
            return res.status(401).json({
                sucess:false,
                message:"User not registered"
            })
        }

        // Password verification
        const payload = {
            name:user.name,
            email:user.email,
            role:user.role
        }

        // Valid password
        if(await bcrypt.compare(password,user.password)){
            
            const token = jwt.sign(payload,process.env.JWT_KEY,
                                    {
                                        expiresIn:"3h"
                                    });

            
            user = user.toObject()
            user.token = token
            user.password = null

            const options = {
                expires:new Date( Date.now() + 30000)
            }

            res.cookie("token",token,options).status(200).json(
                {
                    sucess:true,
                    token:token,
                    user:user,
                    message:"Logged in succesfuly"
                }
            )                       

        }else{
            return res.status(401).json({
                sucess:false,
                message:"Password incorrect"
            })
        }

    }
    catch(e){

        return res.status(500).json({
            sucess:false,
            message:e.message
        })

    }
}