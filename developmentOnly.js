const chalk = require('chalk');

function clg(log){
    console.log(chalk.green(log))
}

function clr(log){
    console.log(chalk.red(log))
}
function clb(log){
    console.log(chalk.blue(log))
}

module.exports={
    clg:clg,
    clr:clr,
    clb:clb
}