require('dotenv').config()
const { Sequelize } = require('sequelize');

const createConnection = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    define: {
        timestamps: false
    }
});

module.exports = createConnection;