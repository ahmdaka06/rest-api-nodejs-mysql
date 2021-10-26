const chalk = require('chalk')

const logDanger = (title, message) => {
    return console.log(chalk.red(`[${title}]`) + ` ${message}`);
}

const logWarning = (title, message) => {
    return console.log(chalk.yellow(`[${title}]`) + ` ${message}`);
}

const logSuccess = (title, message) => {
    return console.log(chalk.green(`[${title}]`) + ` ${message}`);
}

module.exports = {
    logDanger,
    logSuccess,
    logWarning
}