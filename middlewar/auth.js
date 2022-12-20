let jwt=require ("jsonwebtoken")

let {sequelize,QueryTypes}=require("../init/config")
let user =require("../schema/admin_logine")

function auth (permission){
    return async function(request,response,next){
        if(!request.headers || !request.headers.token){
            return response.status(500).send("token not found")
        }
        let verify = jwt.verify(request.headers.token,"zeesahn@70")
        if(!verify || verify.error){
            return response.status(500).send("token invalid")
        }
    
        let users = await sequelize.query(`SELECT admin.name, permissons.permisonss AS permission
        FROM admin LEFT JOIN admin_permisso ON admin.id=admin_permisso.admin_id 
        LEFT JOIN permissons ON admin_permisso.permisson_id=permissons.id 
        WHERE admin.id =${verify.id}`,{type:QueryTypes.SELECT}).catch((error)=>{
          return {error:error}
        })
        
        if(!users || (users && users.error)){
            return response.status(401).send("you dont hanve permisson for  this task")
        }
        let userPermission = {}
        for(let per of users){
          userPermission[per.permission]=1
        }

       
        if (permission && !userPermission[permission]){
          return response.send("access denied")
        }
        request.userData = {
            id:verify.id,name:users[0].name,permisson:userPermission
          }

        next()
    }
}

module.exports=auth