const { Sequelize, Model, DataTypes } = require("sequelize");

const sequelize = new Sequelize("vov4ikDB", "root", "sc62_)#", {
  host: "localhost",
  dialect: "mysql"

});

class File extends Model  {}

File.init({

  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },

  name: { 
  
    type: DataTypes.STRING,
    isNull: false,
    isLowerCase: true,
    len: [4, 40]
    
  },
  
  size: {
  
    type: DataTypes.INTEGER.UNSIGNED,
    isNull: false,
  
  },
  
  MIME: {
  
    type: DataTypes.STRING,
    isNull: false
  
  },
  
  extension: {
  
    type: DataTypes.STRING,
    isNull: false
  
  },

}, { sequelize, modelName: "file" });

module.exports = File;
