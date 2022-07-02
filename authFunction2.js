/*
const {clg, clr, clb} = require('./developmentOnly');
const {selectDBdata} = require('./dbMySql/dbConnect')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



async function logOut(refrishToken){
    console.log(refrishToken)
    try {
            const tokenUpdate = `
                UPDATE auth 
                SET refreshToken = ''
                WHERE refreshToken = '${refrishToken}'`;
            await selectDBdata(tokenUpdate);
            return 201;
        }catch(err){
            return err
        }
}





module.exports= {
    logOut:logOut
}
*/