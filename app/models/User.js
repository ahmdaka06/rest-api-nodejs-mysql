const { Sequelize } = require('sequelize');
const sequelize = require('./../config/db').sequelize;
 
// init DataTypes
const { DataTypes } = Sequelize;
 
// Define schema
const User = sequelize.define('users', {
  // Define attributes
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100)
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  username: {
    type: DataTypes.STRING(50)
  },
  password: {
    type: DataTypes.STRING(255),
    scopes: ['self'],
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: 1
  },
  created_at: {
    type: DataTypes.DATE, 
    defaultValue: Sequelize.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
},{
  // Freeze Table Name
  freezeTableName: true
});

User.prototype.toJSON =  function () {
  var values = Object.assign({}, this.get());

  delete values.password;
  return values;
}

module.exports = User
