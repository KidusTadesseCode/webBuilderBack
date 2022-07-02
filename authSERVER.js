//runs on port 4000
require('dotenv').config()
//Imported Dependencies
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const cors = require('cors');

const {clg, clr, clb} = require('./developmentOnly');
const {selectDBdata} = require('./dbMySql/dbConnect');
const bcrypt = require('bcrypt');
const {authenticateUser, authenticatTokens, generateAccessToken, logOut} = require('./authFuncion');



app.use(cors());
app.use(express.json());


app.get('/user', async function (req, res) {
    clg("/user");
    
    try {
        var name, admin, userName, email, password;	
        name= 'Smith'; admin  = 1; userName = 'This_is_my_UserName_2'; email = "thisismysecondemail@gmail.com"; password = "123456789";
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt)
        //const hashedPassword = await bcrypt.hash(req.body.password, salt)

        //let insert = `INSERT INTO auth (admin, userName, email, password) VALUES ('${admin}', '${userName}', '${email}', '${hashedPassword}')`;
        let insert = `INSERT INTO auth (userName, email, password) VALUES ('${userName}', '${email}', '${hashedPassword}')`;
        const data = await selectDBdata(insert);
        console.log(data)
        console.log("port 4000")
        
        //clr(salt); clb(hashedPassword)
        res.status(201).send(`Created ${data.affectedRows} number of rows`)
    }catch{
        res.status(500).send()
        console.log("falil port 4000")
        //res.send('fail')
    }
})



app.post('/logout', async (req, res) => {
    let refrishToken = req.body.token;
    console.log('/logout')
    console.log(refrishToken)
     logOut(refrishToken)

    //refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    res.sendStatus(204)
  })




  app.post('/token', async (req, res) => {
    const refreshToken = req.body.authorizationToken
    clb('/token');
    console.log(req.body); 
    clb(refreshToken);
    if (refreshToken == null) return res.sendStatus(401);

    console.log('1. accessToken')
    if (!refreshToken.includes(refreshToken)) return res.sendStatus(403)
    // const checkTokenInDB = `SELECT refreshToken FROM auth WHERE refreshToken='${refreshToken} AND email='${}'`
    // const getUserDB = await selectDBdata(checkTokenInDB);

    console.log('2. accessToken')
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
        console.log('3. accessToken')
        if (err) {console.log(err); return res.sendStatus(403);}
        const checkTokenInDB = `
        SELECT refreshToken FROM auth 
        WHERE refreshToken='${refreshToken}' AND email='${user.usr}'`;
        const tokenDB = await selectDBdata(checkTokenInDB);
        
        if(!tokenDB[0]) return res.sendStatus(403)

        console.log(user)
    

        console.log('4. accessToken')
        const accessToken = generateAccessToken({ usr:user.usr, id:user.id })
        console.log('5. accessToken')
        clg(accessToken)
        console.log('accessToken')
        res.json({ accessToken: accessToken, email:user.usr })
    })
  })






app.post('/user/login', async function (req, res){
    console.log('/user/login')
    const {email, password} = req.body;

    authenticateUser(email, password)
    .catch((error) => {console.log(error); return error})
    .then((e)=>{
        console.log(e)
        if (e['accessToken']){
            console.log(e)
            res.json({accessToken: e['accessToken'], email:email, refreshToken:e['refreshToken']})
        }else res.status(403)
    })
})











const port = 4000;

app.get('/*', async function (req, res) {
    res.send("<b>Localhost is working Port "+port+"</b>")
})

app.listen(port, () => {
    console.log(`Running Backend Server on ${port}`);
})