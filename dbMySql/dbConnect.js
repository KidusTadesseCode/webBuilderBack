require('dotenv').config()
const mysqlPromes = require('promise-mysql');
const {aws_sm_payload} =require("../aws_sdk/dbSecretsManagerRotation")

const _AWS_SM = await aws_sm_payload();

const dbConnect = async()=>{
    return await mysqlPromes.createConnection({
        host     : DB_HOST,
        user     : DB_USER,
        password : DB_PASSWORD,
        database : DB_DATABASE,
    })
}

const EC2_TO_DB = async()=>{
    return await mysqlPromes.createConnection({
        host     : _AWS_SM['host'],
        user     : _AWS_SM['username'],
        password : _AWS_SM['password'],
        database : _AWS_SM['dbInstanceIdentifier'],
    })
}


const selectDBdata = async (select, data)=>{
    let db= await dbConnect()
    let qur = await db.query(select, data)
    await db.end()
    return qur;
}

module.exports={
    dbConnect:dbConnect,
    selectDBdata:selectDBdata
}
