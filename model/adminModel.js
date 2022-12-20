const Admin = require ("../schema/admin_logine")
const permisson = require ("../schema/adminPermisson")
const joi =  require ("joi")
const bcrypt = require ("bcrypt")
const jwt = require ("jsonwebtoken");
const mailer=require("nodemailer");
const rs = require("randomstring");
let userData=require("../middlewar/auth")
const { max } = require("../schema/admin_logine");

async function checkRegister(param){
    let schema=joi.object({
        name:joi.string().max(30).min(2).required(),
        email_phone_no:joi.string().max(80).min(2).required(),
        password:joi.string().max(10).min(2).required()
    }).options({
        abortEarly:false
    });
    let check = schema.validate(param)
    if(check.error){
        let error=[]
        for(let err of check.error.details)
        {
            error.push(err.message)
        }
        return {error:error}
    }
    return{data:check.value}
}

async function registerAdmin(param){
    let valid=await checkRegister(param).catch(function(error){
        return {error:error}
    })
    if(!valid || valid.error){
        return{error:valid.error}
    }
    let checkAdmin = await Admin.findOne({where:{email_phone_no:param.email_phone_no}}).catch((error)=>{
       return {error:error}
    })
    if(checkAdmin){
      return  {error:"this Admin is alraday in"}
    }
    param.password = await bcrypt.hash(param.password,10).catch((error)=>{
        return {error:error}
    })
    let addAdmin = await Admin.create(param).catch((error)=>{
        return{error:error}
    })
    console.log(addAdmin)
    if(!addAdmin || addAdmin.error)
    {
        return {error:"Internal server error"}
    }
    return {data:"Register Succesfull",addAdmin}
}

async function checkLogin(param){
    let schema=joi.object({
        email_phone_no:joi.string().max(80).min(2).required(),
        password:joi.string().max(10).min(2).required()
    }).options({abortEarly:false})
    let check = schema.validate(param)
    if(check.error){
        let message=[]
        for(let err of check.error.details)
        {
            message.push(err.message)
        }
        return{error:error}
    }
    return {data:check.value}
}

async function loginAdmin(param){
    let check = await checkLogin(param).catch((error)=>{
        return {error:error}
    })
    if(!check || check.error){
        return{error:check.error}
    }
    let checkAdmin = await Admin.findOne({where:{email_phone_no:param.email_phone_no}}).catch((error)=>{
        return {error:error}
    })
    console.log("check user",checkAdmin)
    if (!checkAdmin || checkAdmin.error){
        return {error:"user not found"}
    }
    let checkPassword = await bcrypt.compare(param.password,checkAdmin.password).catch((error)=>{
        return{error:error}
    })
    console.log("check",checkPassword)
    if (!checkPassword || checkPassword.error){
        return{error:"invalid password"}
    }
    let key = "zeesahn@70"    
    let token =  jwt.sign({id:checkAdmin.id},key)
    console.log("token",token)
    if(!token || token.error){
        return{error:"internal server error"}
    }
    return {data:"login succesfully",token}
}
    // forget password function
async function checkForget(param){
    let schema = joi.object({
        email_phone_no:joi.string().max(80).min(2).required()
    }).options({
        abortEarly:false
    })
    let check = schema.validate(param)
    if(check.error){
        let error = []
        for(let err of check.error.details){
            error.push(err.message)
        }
        return{error:error}
    }
    return{data:check.value}
}

async function forget(param){
    let check = await checkForget(param).catch((error)=>{
        return {errorr:error}
    })
    if(!check || check.error){
        return{error:check.error}
    }
    let getUser = await Admin.findOne({where:{email_phone_no:param.email_phone_no}}).catch((error)=>{
        return {error:error}
    })
    if(!getUser || getUser.error){
        return{error:"pleas enter valid email_phone_no"}
    }
    let token = await rs.generate(10).catch((error)=>{
        return {error:error}
    })

    let result = await Admin.update({token:token},{where:{email_phone_no:param.email_phone_no}}).catch((error)=>{
        return{error:error}
    })
     console.log(reset)
    let transporter= mailer.createTransport({
        service:"gmail",
        auth:{
            user:"poolking90zeeshan90@gmail.com",
            pass:"gtoxrouqvimucnpo"
        }
    })
    let mailoption={
        from:"poolking90zeeshan90@gmail.com",
        to:getUser.email_phone_no,
        subject:"forget password",
        text:"enter this token to reset yor password"+" : "+token
    }
    transporter.sendMail(mailoption,(error,info)=>{
        if(error){
            console.log("mail error",error)
            return{error:"internal server error",error}
        }else{
            return{data:"token sending your email_phone_no ",info}
        }
    })
    return{data:"mail send"}
}

// reset password function
async function checkResat(param){
    let schema = joi.object({
        email_phone_no:joi.string().max(80).min(2).required(),
        token:joi.string().max(200).min(2).required(),
        newPassword:joi.string().max(10).min(2).required()
    }).options({abortEarly:false})

    let check = schema.validate(param)
    if(check.error){
        let error=[]
        for(let err of check.error.message){
            error.push(err.message)
        }
        return {error:error}
    }
    return {data:check.valid}
}

async function reset (param){
    let check = await checkResat(param).catch((error)=>{
        return {error:error}
    })
    if(!check || check.error){
        return{error:check.error}
    }
    
    let user = await Admin.findOne({where:{token:param.token}}).catch((error)=>{
        return {error:error}
    })
    if(!user || (user && user.error)){ return {error:"User not found"}}
    
    // let verifytoken="";
    // try{
    //     verifytoken = jwt.verify(param.token,"zeesahn@70")
    // } catch (error){
    //     return{error:"token invalid",error}
    // }
    // let param1= verifytoken

    let resatpass= await Admin.update({password:await bcrypt.hash(param.newPassword,10)},{where:{id:user.id}}).catch((error)=>{
        return{error:error}
    })
    if(!resatpass || (resatpass && resatpass.error)){
        return{error:resatpass.error}
    }

    let delet = await Admin.update({token:""},{where:{id:user.id}}).catch((error)=>{
        return {error:error}
    })
    return {data:"password resat succesfully"}
}

// finding user 

async function checkbody(param){
    let schema=joi.object({
        id:joi.number().max(20).min(0),
        name:joi.string().max(25).min(1),
        email_phone_no:joi.string().max(80).min(3)
    }).options({abortEarly:false})
    
    let check= schema.validate(param)
    if(check.error){
        let error=[]
        for (let err of check.error.details){
            error.push(err.message)
        }
        return {error:error}
    }
    return {data:check.value}
}

async function findall(param,userData){
    let check2 = await checkbody(param).catch((error)=>{
        return {error:error}
    })
    console.log("check error",check2)
    if(!check2 || check2.error){

        return {error:check2.error}
    }
    let query = {}
    if(param.id){
        query={where:{id:param.id}}
    }

    if(param.name){
        query={where:{name:param.name}}
    }

    if(param.email_phone_no){
        query={where:{email_phone_no:param.email_phone_no}}
    }
    console.log("error",query)
    let allUser = await Admin.findAll(query).catch((error)=>{
        return {error:error}
    })
    if(!allUser || allUser.error){
    return{error:allUser.error}
}
return {data:allUser}
};


module.exports={
        registerAdmin,
        loginAdmin,
        forget,
        findall
}