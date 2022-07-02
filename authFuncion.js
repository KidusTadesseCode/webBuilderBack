// running on port 4000
require('dotenv').config()
const {clg, clr, clb} = require('./developmentOnly');
const {selectDBdata} = require('./dbMySql/dbConnect')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { id } = require('date-fns/locale');

async function authenticateUser(email, password){
    console.log('authenticateUser')
    
    var emailCheck, passwordCheck = false;
    if (email) emailCheck = true
    if (password) passwordCheck = true

    console.log('2 authenticateUser')
    if (emailCheck && passwordCheck){
        try{
            let select = `SELECT userID, email, password FROM auth WHERE email='${email}'`;
            const getUserDB = await selectDBdata(select);
            //console.log(getUserDB)
            if (getUserDB.length != 1) throw 403
            console.log('3 authenticateUser')
            if (await bcrypt.compare(password, getUserDB[0].password)){
                ////////////////////////////////////////////////////////////////
                //const accessToken = jwt.sign({usr:email}, process.env.ACCESS_TOKEN_SECRET);
                ////////////////////////////////////////////////////////////////
                console.log('4 authenticateUser')
                console.log(getUserDB[0]['userID'])
                const accessToken = generateAccessToken({email:email, id:getUserDB[0]['userID']})
                console.log('5 authenticateUser')
                const refreshToken = jwt.sign({usr:email, id: getUserDB[0]['userID']}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1 day' });
                
                const refreshTokenUpdate = `
                UPDATE auth 
                SET refreshToken = '${refreshToken}'
                WHERE email = '${email}'`
                await selectDBdata(refreshTokenUpdate);

                return {accessToken: accessToken, refreshToken:refreshToken}
            }else throw 403
        }catch (err){
            return err
        }
    }else throw 403
}

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '800000s' })
}

function authenticatTokens(req, res, next){
    const authHeader = req.headers['authorization'];
    clg(`started authenticatTokens()`) ////////////////////////////////
    if (authHeader == null) res.status(401);
    jwt.verify(authHeader, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
        if(err) {
            clg(err)
            res.status(403).send('no auth');
            next()
            return
        }
        clb('ended authenticatTokens()') ////////////////////////////////
        req.user = user;
        next()
        return
    })
}


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
    authenticateUser:authenticateUser,
    authenticatTokens:authenticatTokens,
    generateAccessToken:generateAccessToken,
    logOut:logOut
}