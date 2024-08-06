const mongoose = require("mongoose")

require("dotenv").config()

exports.dbConnect = ()=>{

    try{
        mongoose.connect(process.env.DB_URL)
        .then(()=> console.log("Db connection established"))
        .catch( (e)=> console.log(e.message));
    }
    catch(e){
        console.log(e.message)
    }
}