const { Sequelize, Model, DataTypes } = require("sequelize"),
  passportLocalSequelize = require("passport-local-sequelize");

const sequelize = new Sequelize("vov4ikDB", "root", "sc62_)#", {
  host: "localhost",
  dialect: "mysql"

});

class User extends Model  {}

User.init({

  id: {
  
    type: DataTypes.STRING,
    primaryKey: true,
    isNull: false
    
  },
  
  refreshAvailabale: {
  
    type: DataTypes.BOOLEAN,
    defaultValue: false
  
  },
  
  hash: DataTypes.TEXT,
  salt: DataTypes.TEXT,
  
}, { sequelize, modelName: "user" });

passportLocalSequelize.attachToUser(User, {

    usernameField: "id",
    hashField: "hash",
    saltField: "salt"
    
});

module.exports = User;
