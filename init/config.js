const{Sequelize,Model,DataTypes,QueryTypes}=require("sequelize")
 
const sequelize= new Sequelize("mysql://root:@localhost/hospital_manaegmet_system")

module.exports={
    sequelize,
    DataTypes,
    Model,
    QueryTypes
}