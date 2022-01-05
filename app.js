require('dotenv').config()
const express = require('express')
const cors = require('cors');

const { logDanger, logSuccess } = require('./app/config/chalk')
const { sequelize } = require('./app/config/db')
const routes = require('./app/routes/config.routes')
const app = express();
const port = process.env.PORT || 5000

app.use(cors({
    origin: '*'
}));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}))
// Routes //
//
app.use(routes)

const init = async () => {
    await sequelize.authenticate().then((result) => app.listen(port, () => {
        logSuccess('SERVER', `Server listen on ${process.env.APP_URL}:${port}`)
    })).catch((err) => logDanger('ERROR', err))
    
}

init()