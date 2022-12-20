const{sequelize,Model,DataTypes}=require("../init/config")

class Admin extends Model {}

Admin.init({
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    email_phone_no:{
        type:DataTypes.STRING,
        allowNull:false
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    token:{
        type:DataTypes.STRING,
        allowNull:true
    }
},
{
    modelName:"Admin",
    tableName:"admin",
    sequelize
})

module.exports= Admin