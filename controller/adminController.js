const admin= require("../model/adminModel")
const express= require("express")

// const Admin = require("../schema/admin_logine")
async  function findAdmin(request,response){
    let check = await findAdmin(request.body).catch((error)=>{
        return {error:error}
    })
    if(!check || check.error){
        return response.send({error:check.error})
    }
    return response.send({data:check})
}

async function register(request,response){
    let admin1 = await admin.registerAdmin(request.body).catch(function(error){console.log(error)
    })
    if(!admin1 || admin1.error){
        return response.send({error:admin1})
    }
    return response.send({data:admin1.data})
}
async function login(request,response){
    let admin2 = await admin.loginAdmin(request.body).catch((error)=>{
        return {error:error}
    })

    if(!admin2 || admin2.error){

        return response.send({error:admin2.error})
    }
    return response.send({data:admin2})
}

async function forgetpass(request,response){
    let forget1=await admin.forget(request.body).catch((error)=>{
        return{error:error}
    })

    if(!forget1 || forget1.error){
        return response.send({error:forget1.error})
    }
    return response.send({data:forget1})
}

async function resetpass(request,response){
    let resat1=await admin.reset  (request.body).catch((error)=>{
        return{error:error}
    })

    if(!resat1 || resat1.error){
        return response.send({error:resat1.error})
    }
    return response.send({data:resat1})
}

async function find(request,response){
    console.log("find",find)
    let show = await admin.findall(request.body,request.userData).catch((error)=>{
        return{error:error}
    })
   console.log("show",show)
    if(!show || show.error){
        return response.send({error:show.error})
    }
    return response.send({data:show})
}

module.exports={
                register,
                login ,
                findAdmin,
                forgetpass,
                resetpass ,
                find      
}
