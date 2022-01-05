const jwt = require('jsonwebtoken');
const User = require('./User')
const { Sequelize } = require('sequelize');
const sequelize = require('./../config/db').sequelize;
 
// init DataTypes
const { DataTypes } = Sequelize;
 
// Define schema
const RefreshToken = sequelize.define('refresh_tokens', {
  // Define attributes
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER
  },
  token: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  expired_at: {
    type: DataTypes.DATE, 
    defaultValue: Sequelize.NOW
  },
},{
  // Freeze Table Name
  freezeTableName: true
});

RefreshToken.associate = (models) => {
  RefreshToken.belongsTo(User, {
    foreignKey: 'user_id'
  })
}
RefreshToken.createToken = async (user) => {
    let expiredAt = new Date();

    expiredAt.setSeconds(expiredAt.getSeconds() + process.env.JWT_REFRESH_LIFE);

    let _token = await jwt.sign({
        user
    }, process.env.JWT_REFRESH_SECRET, {
        algorithm: process.env.JWT_ALGORITHM,
        expiresIn: process.env.JWT_REFRESH_LIFE,   
    });
    
    let checkRefreshToken = await RefreshToken.findOne({ 
      where: { 
        user_id: user.id
      } 
    })

    let refreshToken = null
    if (!checkRefreshToken) {
      refreshToken = await RefreshToken.create({
        user_id: user.id,
        token: _token,
        expired_at: expiredAt
      });
    } else {
      refreshToken = await RefreshToken.update({
        user_id: user.id,
        token: _token,
        expired_at: expiredAt
      },{
        where: {
          user_id: user.id
        }
      });
    }
    return refreshToken.token;
};

module.exports = RefreshToken
