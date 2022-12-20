const{sequelize,Model,DataTypes}=require("../init/config")

class  Admin_permisson extends Model{}

Admin_permisson.init({
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    admin_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    permisson_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    }},{
        modelName:"Admon_permisson",
        tableName:"admin_permisson",
        sequelize
    }
)

module.exports=Admin_permisson