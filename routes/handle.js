require('dotenv').config()

var express = require('express');
var app = express();

var router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {selectDBdata}= require('../dbMySql/dbConnect');
const {clg, clr, clb} = require('../developmentOnly')
const {authenticatTokens} = require('../authFuncion')
const path = require('path')
const nodemailer = require("nodemailer");


router.get('/user', async function (req, res) {
    clg("/user");
    //const {name, email, password} = req.body;
    //this is to create users
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
        console.log("port 8000")
        
        //clr(salt); clb(hashedPassword)
        res.status(201).send(`Created ${data.affectedRows} number of rows`)
    }catch{
        res.status(500).send()
        //res.send('fail')
    }
})

//for testes
router.get('/', async (req, res)=>{
    let testAccount = await nodemailer.createTestAccount()
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: testAccount.user, // generated ethereal user
          pass: testAccount.pass, // generated ethereal password
        },
      });
    let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: "Kidustadessearega@gmail.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
    });
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    main().catch(console.error);
    res.send(`Message sent: %s ${info.messageId} <br> Preview URL: %s ${nodemailer.getTestMessageUrl(info)}`);

})



/*
//for testes
router.get('/', authenticatTokens, (req, res)=>{
    //clb(`from /post `)
    //console.log(req.headers['authorization'])
    res.json(req.userName)
})
*/



module.exports = router; 