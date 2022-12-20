const rout = require ("./rout")
const express = require("express")
const app =express()
let logger=require("./init/winston")

app.use(express.json())
app.use(express.urlencoded({extended:true}))

logger.error("error")
app.use("/",rout)


app.listen(3001,function(connected){
    console.log("connected")
})