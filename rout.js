let user = require ("./controller/adminController");
let authantcation=require("./middlewar/auth")
let cors=require("./init/cors")
let errorhande=require("./middlewar/errorHandler")

let express = require ("express")
let app = express()
app.use(cors)


app.post("/api/v1/admin/register",user.register);
app.post("/api/v1/admin/login",user.login);
app.post("/api/v1/admin/forget",user.forgetpass);
app.post("/api/v1/admin/reset",user.resetpass);
app.post("api/v1/admin/findAdmin",user.findAdmin);
app.get("/api/v1/admin/view",authantcation("getUser"),user.find)






app.use(errorhande)
module.exports=app


